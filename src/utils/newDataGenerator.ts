import { Node, Edge } from 'reactflow';
import {
  activities,
  applications,
  downstreamApps,
  businessAreas,
  getActivitiesForBusinessArea,
  Activity,
} from './activityData';

// Seeded random number generator for deterministic results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getStatusForActivity(
  activityId: string,
  businessDate: Date,
  seedOffset: number
): 'met' | 'missed' | 'in-progress' | 'not-started' {
  const isToday = businessDate.toDateString() === new Date().toDateString();
  
  if (!isToday) {
    // Historical data - deterministic final results
    const seed = businessDate.getTime() + activityId.charCodeAt(0) * 1000 + seedOffset;
    const rand = seededRandom(seed);
    if (rand < 0.75) return 'met'; // 75% success rate for historical
    return 'missed';
  }
  
  // Live data - show various states
  const seed = Date.now() + activityId.charCodeAt(0) * 1000 + seedOffset;
  const rand = seededRandom(seed);
  if (rand < 0.5) return 'met';
  if (rand < 0.6) return 'missed';
  if (rand < 0.8) return 'in-progress';
  return 'not-started';
}

export function generateWorkflowData(
  businessDate: Date = new Date(),
  selectedBusinessArea: string | null = null,
  selectedApplication: string | null = null
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  const spacing = {
    businessArea: { x: 50, y: 0 },
    activityType: { x: 400, y: 0 },
    application: { x: 800, y: 0 },
    activity: { x: 1200, y: 0 },
    downstream: { x: 1600, y: 0 },
  };

  // If a business area is selected, show only that business area
  const areasToShow = selectedBusinessArea
    ? businessAreas.filter((ba) => ba === selectedBusinessArea)
    : businessAreas;

  if (selectedBusinessArea && !selectedApplication) {
    // Show Activity Type grouping for selected business area
    const businessAreaId = `ba-${nodeId++}`;
    nodes.push({
      id: businessAreaId,
      type: 'businessArea',
      position: { x: spacing.businessArea.x, y: 200 },
      data: { label: selectedBusinessArea },
    });

    // Group activities by type
    const activityTypes = ['Trade', 'Risk', 'Market Data', 'Aggregation'];
    const typeNodeIds: Record<string, string> = {};

    activityTypes.forEach((type, typeIndex) => {
      const activitiesOfType = activities.filter(
        (a) => a.businessArea === selectedBusinessArea && a.activityType === type
      );

      if (activitiesOfType.length > 0) {
        const typeId = `type-${nodeId++}`;
        typeNodeIds[type] = typeId;

        nodes.push({
          id: typeId,
          type: 'activity',
          position: { x: spacing.activityType.x, y: typeIndex * 150 + 50 },
          data: { 
            label: type,
            count: activitiesOfType.length,
          },
        });

        edges.push({
          id: `edge-${businessAreaId}-${typeId}`,
          source: businessAreaId,
          target: typeId,
          type: 'smoothstep',
          animated: false,
        });

        // Get unique applications for this activity type
        const appsForType = new Set(activitiesOfType.map((a) => a.appId));
        
        Array.from(appsForType).forEach((appId, appIndex) => {
          const appNodeId = `app-${type}-${appId}-${nodeId++}`;
          const appActivities = activitiesOfType.filter((a) => a.appId === appId);
          const metCount = appActivities.filter((a) => 
            getStatusForActivity(a.id, businessDate, 0) === 'met'
          ).length;

          nodes.push({
            id: appNodeId,
            type: 'application',
            position: { 
              x: spacing.application.x, 
              y: typeIndex * 150 + appIndex * 80 
            },
            data: { 
              label: appId,
              activityCount: appActivities.length,
              metCount,
            },
          });

          edges.push({
            id: `edge-${typeId}-${appNodeId}`,
            source: typeId,
            target: appNodeId,
            type: 'smoothstep',
            animated: false,
          });
        });
      }
    });

    // Add Kessel aggregation output to downstream apps
    const kesselNodes = nodes.filter((n) => n.data.label === 'Kessel');
    if (kesselNodes.length > 0) {
      downstreamApps.forEach((downstream, idx) => {
        const downstreamId = `downstream-${nodeId++}`;
        nodes.push({
          id: downstreamId,
          type: 'application',
          position: { x: spacing.downstream.x, y: 300 + idx * 80 },
          data: { 
            label: downstream.name,
            type: downstream.type,
          },
        });

        kesselNodes.forEach((kesselNode) => {
          edges.push({
            id: `edge-${kesselNode.id}-${downstreamId}`,
            source: kesselNode.id,
            target: downstreamId,
            type: 'smoothstep',
            animated: true,
          });
        });
      });
    }
  } else if (selectedApplication) {
    // Show activities and jobs for selected application
    const appActivities = activities.filter(
      (a) => a.appId === selectedApplication &&
        (!selectedBusinessArea || a.businessArea === selectedBusinessArea)
    );

    const appNodeId = `app-main-${nodeId++}`;
    nodes.push({
      id: appNodeId,
      type: 'application',
      position: { x: 100, y: 200 },
      data: { 
        label: selectedApplication,
        activityCount: appActivities.length,
      },
    });

    appActivities.forEach((activity, activityIndex) => {
      const activityId = `activity-${nodeId++}`;
      const status = getStatusForActivity(activity.id, businessDate, 0);

      nodes.push({
        id: activityId,
        type: 'activity',
        position: { x: 400, y: activityIndex * 120 + 50 },
        data: { 
          label: activity.name,
          activityId: activity.id,
          activityType: activity.activityType,
          expectedStart: activity.expectedStartTime,
          expectedEnd: activity.expectedEndTime,
          status,
        },
      });

      edges.push({
        id: `edge-${appNodeId}-${activityId}`,
        source: appNodeId,
        target: activityId,
        type: 'smoothstep',
        animated: status === 'in-progress',
      });

      // Add 2-4 jobs per activity
      const jobCount = 2 + Math.floor(seededRandom(activityIndex * 1000) * 3);
      for (let i = 0; i < jobCount; i++) {
        const jobId = `job-${nodeId++}`;
        const jobStatus = getStatusForActivity(activity.id, businessDate, i * 100);

        nodes.push({
          id: jobId,
          type: 'job',
          position: { x: 800, y: activityIndex * 120 + i * 40 },
          data: {
            label: `${activity.id}-Job-${i + 1}`,
            status: jobStatus,
            progress: jobStatus === 'in-progress' ? Math.random() * 100 : 0,
          },
        });

        edges.push({
          id: `edge-${activityId}-${jobId}`,
          source: activityId,
          target: jobId,
          type: 'smoothstep',
          animated: jobStatus === 'in-progress',
        });
      }
    });
  } else {
    // Show all business areas overview
    areasToShow.forEach((area, index) => {
      const businessAreaId = `ba-${nodeId++}`;
      const areaActivities = getActivitiesForBusinessArea(area);
      const metCount = areaActivities.filter(
        (a) => getStatusForActivity(a.id, businessDate, 0) === 'met'
      ).length;

      nodes.push({
        id: businessAreaId,
        type: 'businessArea',
        position: { x: spacing.businessArea.x, y: index * 120 },
        data: { 
          label: area,
          activityCount: areaActivities.length,
          metCount,
        },
      });
    });
  }

  return { nodes, edges };
}
