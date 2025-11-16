import { useState, useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  BackgroundVariant,
  Panel,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast, Toaster } from 'sonner@2.0.3';
import { ThemeProvider } from './utils/ThemeContext';
import { BusinessAreaNode } from './components/BusinessAreaNode';
import { ActivityNode } from './components/ActivityNode';
import { ApplicationNode } from './components/ApplicationNode';
import { JobNode } from './components/JobNode';
import { Dashboard } from './components/Dashboard';
import { BusinessAreaSidebar } from './components/BusinessAreaSidebar';
import { ApplicationSidebar } from './components/ApplicationSidebar';
import { generateWorkflowData } from './utils/newDataGenerator';
import { 
  businessAreas, 
  getActivitiesForBusinessArea,
  applications,
  activities,
} from './utils/activityData';

const nodeTypes = {
  businessArea: BusinessAreaNode,
  activity: ActivityNode,
  application: ApplicationNode,
  job: JobNode,
};

export default function App() {
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [allEdges, setAllEdges] = useState<Edge[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [businessDate, setBusinessDate] = useState<Date>(new Date());
  const [selectedBusinessArea, setSelectedBusinessArea] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  // Initialize data based on business date and selections
  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = generateWorkflowData(
      businessDate,
      selectedBusinessArea,
      selectedApplication
    );
    setAllNodes(initialNodes);
    setAllEdges(initialEdges);
    setLastUpdate(new Date());
  }, [businessDate, selectedBusinessArea, selectedApplication]);

  // Simulate real-time updates only for current business date
  useEffect(() => {
    const isToday = businessDate.toDateString() === new Date().toDateString();
    
    if (!isToday) return; // Don't update if viewing historical data
    
    const interval = setInterval(() => {
      setAllNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.type === 'job' || (node.type === 'activity' && node.data.status)) {
            // Randomly update job statuses
            const random = Math.random();
            let newStatus = node.data.status;
            
            if (node.data.status === 'not-started' && random > 0.7) {
              newStatus = 'in-progress';
            } else if (node.data.status === 'in-progress' && random > 0.8) {
              newStatus = random > 0.5 ? 'met' : 'missed';
            }

            if (newStatus !== node.data.status) {
              return {
                ...node,
                data: {
                  ...node.data,
                  status: newStatus,
                  progress: newStatus === 'in-progress' ? Math.random() * 100 : node.data.progress,
                },
              };
            }
          }
          return node;
        })
      );
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [businessDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    return allNodes.reduce(
      (acc, node) => {
        if (node.type === 'job' || (node.type === 'activity' && node.data.status)) {
          acc.total++;
          if (node.data.status === 'met') acc.met++;
          if (node.data.status === 'missed') acc.missed++;
          if (node.data.status === 'not-started') acc.notStarted++;
          if (node.data.status === 'in-progress') acc.inProgress++;
        }
        return acc;
      },
      { total: 0, met: 0, missed: 0, notStarted: 0, inProgress: 0 }
    );
  }, [allNodes]);

  // Calculate business area statistics
  const businessAreaStats = useMemo(() => {
    return businessAreas.map((ba) => {
      const areaActivities = getActivitiesForBusinessArea(ba);
      // For now, use mock data - in real app, would calculate from actual job statuses
      const slaMet = Math.floor(areaActivities.length * 0.7);
      const slaMissed = areaActivities.length - slaMet;
      
      return {
        id: ba,
        name: ba,
        jobCount: areaActivities.length,
        slaMet,
        slaMissed,
      };
    });
  }, []);

  // Calculate application statistics for selected business area
  const applicationStats = useMemo(() => {
    if (!selectedBusinessArea) return [];
    
    const areaActivities = getActivitiesForBusinessArea(selectedBusinessArea);
    const appIds = new Set(areaActivities.map((a) => a.appId));
    
    return Array.from(appIds).map((appId) => {
      const app = applications.find((a) => a.id === appId);
      const appActivities = areaActivities.filter((a) => a.appId === appId);
      const slaMet = Math.floor(appActivities.length * 0.75);
      const slaMissed = appActivities.length - slaMet;
      
      return {
        id: appId,
        name: appId,
        activityCount: appActivities.length,
        activityTypes: app?.activityTypes || [],
        slaMet,
        slaMissed,
      };
    });
  }, [selectedBusinessArea]);

  const handleSelectBusinessArea = (areaId: string | null) => {
    setSelectedBusinessArea(areaId);
    setSelectedApplication(null); // Reset application selection
  };

  const handleSelectApplication = (appId: string | null) => {
    setSelectedApplication(appId);
  };

  const handleBackToBusinessAreas = () => {
    setSelectedBusinessArea(null);
    setSelectedApplication(null);
  };

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Double clicked node:', node);
    
    if (node.type === 'businessArea') {
      // Navigate to business area detail (activity type view)
      const baName = node.data.label;
      setSelectedBusinessArea(baName);
      setSelectedApplication(null);
      toast.success(`Viewing ${baName} activities by type`);
    } else if (node.type === 'application') {
      // Navigate to application detail (activity & jobs view)
      const appId = node.data.label;
      setSelectedApplication(appId);
      
      // If we're in the overview and don't have a business area selected,
      // we need to determine which business area this app belongs to
      if (!selectedBusinessArea) {
        const appActivity = activities.find(a => a.appId === appId);
        if (appActivity) {
          setSelectedBusinessArea(appActivity.businessArea);
          toast.success(`Viewing ${appId} activities and jobs`);
        }
      } else {
        toast.success(`Viewing ${appId} activities and jobs`);
      }
    } else if (node.type === 'activity' && node.data.activityType && !selectedApplication) {
      // If we're viewing activity types and double-click one,
      // find an application that runs this activity type
      const activityType = node.data.label; // This is the activity type name like "Trade", "Risk", etc.
      
      // Find an application for this activity type in the current business area
      if (selectedBusinessArea) {
        const relevantActivity = activities.find(
          a => a.businessArea === selectedBusinessArea && a.activityType === activityType
        );
        
        if (relevantActivity) {
          setSelectedApplication(relevantActivity.appId);
          toast.success(`Viewing ${relevantActivity.appId} for ${activityType} activities`);
        }
      }
    }
  }, [selectedBusinessArea, selectedApplication]);

  return (
    <ThemeProvider>
      <div className="w-full h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
        <Toaster position="top-right" richColors />
        <Dashboard 
        stats={stats} 
        lastUpdate={lastUpdate} 
        businessDate={businessDate}
        onBusinessDateChange={setBusinessDate}
        selectedBusinessArea={selectedBusinessArea}
        businessAreaName={selectedBusinessArea}
        selectedApplication={selectedApplication}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {!selectedBusinessArea ? (
          <BusinessAreaSidebar
            businessAreas={businessAreaStats}
            selectedArea={selectedBusinessArea}
            onSelectArea={handleSelectBusinessArea}
          />
        ) : (
          <ApplicationSidebar
            businessAreaName={selectedBusinessArea}
            applications={applicationStats}
            selectedApp={selectedApplication}
            onSelectApp={handleSelectApplication}
            onBack={handleBackToBusinessAreas}
          />
        )}
        
        <div className="flex-1 relative">
          <ReactFlow
            nodes={allNodes}
            edges={allEdges}
            nodeTypes={nodeTypes}
            onNodeDoubleClick={handleNodeDoubleClick}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            key={`${selectedBusinessArea}-${selectedApplication}`}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="bg-white border border-slate-200"
            />
            <Panel position="bottom-right" className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 m-4">
              <div className="space-y-3">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Status Legend</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">SLA Met</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">SLA Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Not Started</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 italic">💡 Double-click nodes to drill down</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
      </div>
    </ThemeProvider>
  );
}
