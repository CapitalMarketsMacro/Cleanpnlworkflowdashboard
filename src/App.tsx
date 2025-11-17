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
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import { BusinessAreaNode } from './components/BusinessAreaNode';
import { ActivityNode } from './components/ActivityNode';
import { ApplicationNode } from './components/ApplicationNode';
import { JobNode } from './components/JobNode';
import { SwimLaneNode } from './components/SwimLaneNode';
import { HexagonNode } from './components/HexagonNode';
import { ColumnHeaderNode } from './components/ColumnHeaderNode';
import { ColumnSeparatorNode } from './components/ColumnSeparatorNode';
import { Dashboard } from './components/Dashboard';
import { BusinessAreaSidebar } from './components/BusinessAreaSidebar';
import { ApplicationSidebar } from './components/ApplicationSidebar';
import { generateWorkflowData } from './utils/newDataGenerator';
import { generateSwimLaneLayout, generateApplicationDetailView } from './utils/swimlaneLayoutGenerator';
import { generateVerticalColumnLayout } from './utils/verticalColumnLayoutGenerator';
import { 
  businessAreas, 
  getActivitiesForBusinessArea,
  applications,
  activities,
} from './utils/activityData';
import { 
  fetchActivityStatus, 
  calculateStatsFromStatuses, 
  ActivityStatus 
} from './utils/activityStatusApi';

const nodeTypes = {
  businessArea: BusinessAreaNode,
  activity: ActivityNode,
  application: ApplicationNode,
  job: JobNode,
  swimlane: SwimLaneNode,
  hexagon: HexagonNode,
  columnHeader: ColumnHeaderNode,
  columnSeparator: ColumnSeparatorNode,
};

function AppContent() {
  const { theme } = useTheme();
  const [allNodes, setAllNodes] = useState<Node[]>([]);
  const [allEdges, setAllEdges] = useState<Edge[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [businessDate, setBusinessDate] = useState<Date>(new Date());
  const [selectedBusinessArea, setSelectedBusinessArea] = useState<string | null>('Commodities');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [activityStatuses, setActivityStatuses] = useState<ActivityStatus[]>([]);

  // Initialize data based on business date and selections
  useEffect(() => {
    let initialNodes: Node[];
    let initialEdges: Edge[];

    if (!selectedBusinessArea) {
      // Show all business areas
      const result = generateWorkflowData(businessDate, null, null);
      initialNodes = result.nodes;
      initialEdges = result.edges;
    } else if (selectedBusinessArea && !selectedApplication) {
      // Show vertical column layout for selected business area
      const result = generateVerticalColumnLayout(
        selectedBusinessArea,
        businessDate,
        activityStatuses
      );
      initialNodes = result.nodes;
      initialEdges = result.edges;
    } else {
      // Show application detail view
      const result = generateApplicationDetailView(
        selectedBusinessArea,
        selectedApplication!,
        businessDate,
        activityStatuses
      );
      initialNodes = result.nodes;
      initialEdges = result.edges;
    }

    setAllNodes(initialNodes);
    setAllEdges(initialEdges);
    setLastUpdate(new Date());
  }, [businessDate, selectedBusinessArea, selectedApplication, activityStatuses]);

  // Poll REST API for activity status updates every 10 seconds
  useEffect(() => {
    let isFirstFetch = true;
    
    // Initial fetch
    const fetchStatus = async () => {
      const statuses = await fetchActivityStatus();
      setActivityStatuses(statuses);
      setLastUpdate(new Date());
      
      // Show notification for first successful fetch
      if (isFirstFetch && statuses.length > 0) {
        toast.success(`Activity status loaded: ${statuses.length} activities`);
        isFirstFetch = false;
      }
    };

    fetchStatus();

    // Poll every 10 seconds
    const interval = setInterval(fetchStatus, 10000);

    return () => clearInterval(interval);
  }, [businessDate]);

  // Update nodes when activity statuses change
  useEffect(() => {
    if (activityStatuses.length === 0) return;

    setAllNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.type === 'job' || (node.type === 'activity' && node.data.jobId)) {
          const activityId = node.data.jobId || node.id;
          const statusUpdate = activityStatuses.find(s => s.activityId === activityId);
          
          if (statusUpdate) {
            return {
              ...node,
              data: {
                ...node.data,
                status: statusUpdate.status,
                progress: statusUpdate.progress,
              },
            };
          }
        }
        return node;
      })
    );
  }, [activityStatuses]);

  // Calculate statistics based on API activity statuses
  const stats = useMemo(() => {
    if (activityStatuses.length === 0) {
      // Default to all activities if no API data yet
      const relevantActivities = selectedBusinessArea 
        ? getActivitiesForBusinessArea(selectedBusinessArea)
        : activities;
      
      return {
        total: relevantActivities.length,
        met: 0,
        missed: 0,
        notStarted: relevantActivities.length,
        inProgress: 0
      };
    }

    // Filter statuses by selected business area if applicable
    const relevantStatuses = selectedBusinessArea
      ? activityStatuses.filter(status => {
          const activity = activities.find(a => a.id === status.activityId);
          return activity?.businessArea === selectedBusinessArea;
        })
      : activityStatuses;
    
    return calculateStatsFromStatuses(relevantStatuses);
  }, [activityStatuses, selectedBusinessArea]);

  // Calculate business area statistics from API data
  const businessAreaStats = useMemo(() => {
    return businessAreas.map((ba) => {
      const areaActivities = getActivitiesForBusinessArea(ba);
      
      if (activityStatuses.length === 0) {
        // Default values if no API data yet
        return {
          id: ba,
          name: ba,
          jobCount: areaActivities.length,
          slaMet: 0,
          slaMissed: 0,
        };
      }

      // Get statuses for this business area
      const areaStatuses = activityStatuses.filter(status => {
        const activity = activities.find(a => a.id === status.activityId);
        return activity?.businessArea === ba;
      });

      const stats = calculateStatsFromStatuses(areaStatuses);
      
      return {
        id: ba,
        name: ba,
        jobCount: areaActivities.length,
        slaMet: stats.met,
        slaMissed: stats.missed,
      };
    });
  }, [activityStatuses]);

  // Calculate application statistics for selected business area from API data
  const applicationStats = useMemo(() => {
    if (!selectedBusinessArea) return [];
    
    const areaActivities = getActivitiesForBusinessArea(selectedBusinessArea);
    const appIds = new Set(areaActivities.map((a) => a.appId));
    
    return Array.from(appIds).map((appId) => {
      const app = applications.find((a) => a.id === appId);
      const appActivities = areaActivities.filter((a) => a.appId === appId);
      
      if (activityStatuses.length === 0) {
        // Default values if no API data yet
        return {
          id: appId,
          name: app?.name || appId,
          activityCount: appActivities.length,
          activityTypes: [app?.swimlane || 'Unknown'],
          slaMet: 0,
          slaMissed: 0,
        };
      }

      // Get statuses for this application
      const appStatuses = activityStatuses.filter(status => {
        const activity = activities.find(a => a.id === status.activityId);
        return activity?.appId === appId;
      });

      const stats = calculateStatsFromStatuses(appStatuses);
      
      return {
        id: appId,
        name: app?.name || appId,
        activityCount: appActivities.length,
        activityTypes: [app?.swimlane || 'Unknown'],
        slaMet: stats.met,
        slaMissed: stats.missed,
      };
    });
  }, [selectedBusinessArea, activityStatuses]);

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
    } else if (node.type === 'application' || node.type === 'hexagon') {
      // Navigate to application detail (activity & jobs view)
      const appId = node.data.label || node.data.application;
      
      // Skip if it's a hub node or doesn't have an app name
      if (!appId || appId === '') return;
      
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
            defaultViewport={{ 
              x: 0, 
              y: 0, 
              zoom: selectedBusinessArea && !selectedApplication ? 0.7 : 0.8 
            }}
            key={`${selectedBusinessArea}-${selectedApplication}`}
          >
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={12} 
              size={1} 
              color={theme === 'dark' ? '#475569' : '#e2e8f0'}
              className={theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}
            />
            <Controls className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''} />
            <MiniMap
              nodeStrokeWidth={3}
              className={theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}
              zoomable
              pannable
            />
            <Panel position="bottom-right" className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 m-4">
              <div className="space-y-2">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-1.5 mb-1.5">
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {selectedBusinessArea && !selectedApplication ? 'Column View' : 'Status Legend'}
                  </span>
                </div>
                {selectedBusinessArea && !selectedApplication ? (
                  <>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 pb-2 border-b border-slate-200 dark:border-slate-600">
                      <div className="mb-1">📊 <span className="font-semibold">Data Flow:</span></div>
                      <div className="pl-4 text-[10px]">Trade → Risk → DDS → Kessel → Consumers</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="12" className="flex-shrink-0">
                        <path d="M 4,0 L 12,0 L 16,6 L 12,12 L 4,12 L 0,6 Z" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-xs text-slate-700 dark:text-slate-300">Trade Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="12" className="flex-shrink-0">
                        <path d="M 4,0 L 12,0 L 16,6 L 12,12 L 4,12 L 0,6 Z" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-xs text-slate-700 dark:text-slate-300">Risk Engines</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="12" className="flex-shrink-0">
                        <path d="M 4,0 L 12,0 L 16,6 L 12,12 L 4,12 L 0,6 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-xs text-slate-700 dark:text-slate-300">Kessel (Aggregation)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="12" className="flex-shrink-0">
                        <path d="M 4,0 L 12,0 L 16,6 L 12,12 L 4,12 L 0,6 Z" fill="#86efac" stroke="#16a34a" strokeWidth="1.5"/>
                      </svg>
                      <span className="text-xs text-slate-700 dark:text-slate-300">Consumers</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-xs text-slate-700 dark:text-slate-300">SLA Met</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-xs text-slate-700 dark:text-slate-300">SLA Missed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-xs text-slate-700 dark:text-slate-300">In Progress</span>
                    </div>
                  </>
                )}
                {!selectedBusinessArea || selectedApplication ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded"></div>
                    <span className="text-xs text-slate-700 dark:text-slate-300">Not Started</span>
                  </div>
                ) : null}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 italic">💡 Double-click to drill down</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
