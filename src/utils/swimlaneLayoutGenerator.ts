import { Node, Edge } from 'reactflow';
import { activities, applications, downstreamApps, getActivitiesForApplication } from './activityData';
import { ActivityStatus } from './activityStatusApi';

// Generate application detail view (when user clicks an app in column view)
export function generateApplicationDetailView(
  businessArea: string, 
  applicationId: string, 
  businessDate: Date,
  activityStatuses?: ActivityStatus[]
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const isToday = businessDate.toDateString() === new Date().toDateString();
  
  // Get activities for this app and business area
  const appActivities = getActivitiesForApplication(applicationId).filter(
    a => a.businessArea === businessArea
  );

  // Layout constants
  const JOB_NODE_HEIGHT = 80;
  const JOB_NODE_SPACING = 30;
  const COLUMN_SPACING = 400;

  // Create activity/job nodes
  appActivities.forEach((activity, index) => {
    // Get status from API if available, otherwise use default
    const apiStatus = activityStatuses?.find(s => s.activityId === activity.id);
    let status: 'met' | 'missed' | 'in-progress' | 'not-started';
    let progress: number | undefined;

    if (apiStatus) {
      status = apiStatus.status;
      progress = apiStatus.progress;
    } else {
      // Fallback: Status distribution: 70% met, 15% in-progress, 10% missed, 5% not-started
      const randomValue = Math.random();
      
      if (randomValue < 0.70) {
        status = 'met';
      } else if (randomValue < 0.85) {
        status = 'in-progress';
        progress = Math.random() * 100;
      } else if (randomValue < 0.95) {
        status = 'missed';
      } else {
        status = 'not-started';
      }
    }

    nodes.push({
      id: activity.id,
      type: 'job',
      position: { 
        x: 100, 
        y: index * (JOB_NODE_HEIGHT + JOB_NODE_SPACING) 
      },
      data: {
        label: activity.name,
        jobId: activity.id,
        status: status,
        slaTime: `${activity.expectedStartTime} - ${activity.expectedEndTime}`,
        progress: progress,
        activityType: activity.activityType,
        businessStepId: activity.businessStepId,
        businessStepDescription: activity.businessStepDescription,
        expectedStartTime: activity.expectedStartTime,
        expectedEndTime: activity.expectedEndTime,
      },
    });

    // Create edge to next application in flow if app sends data somewhere
    const app = applications.find(a => a.id === applicationId);
    if (app?.sendsDataTo && app.sendsDataTo.length > 0) {
      const targetApp = app.sendsDataTo[0]; // Use first destination
      
      // Add target app node if not exists
      if (!nodes.find(n => n.id === `${targetApp}-node`)) {
        const targetAppData = applications.find(a => a.id === targetApp || a.name === targetApp);
        nodes.push({
          id: `${targetApp}-node`,
          type: 'application',
          position: { x: 100 + COLUMN_SPACING, y: 100 },
          data: {
            label: targetAppData?.name || targetApp,
            application: targetApp,
            activityCount: 10,
            slaMet: 8,
            slaMissed: 2,
            inProgress: isToday ? 1 : 0,
          },
        });
      }

      edges.push({
        id: `edge-${activity.id}-to-${targetApp}`,
        source: activity.id,
        target: `${targetApp}-node`,
        animated: isToday && status === 'in-progress',
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        type: 'smoothstep',
      });
    }
  });

  // Special handling: If this is a hub node or flows to downstream, show the flow
  const app = applications.find(a => a.id === applicationId);
  
  // Add downstream consumers if Kessel or DDS-Downstream
  if (applicationId === 'Kessel' || applicationId === 'DDS-Downstream') {
    downstreamApps.forEach((consumer, index) => {
      nodes.push({
        id: `${consumer.id}-node`,
        type: 'application',
        position: { 
          x: 100 + COLUMN_SPACING * 2, 
          y: index * 150 
        },
        data: {
          label: consumer.name,
          application: consumer.name,
          activityCount: 5,
          slaMet: 4,
          slaMissed: 1,
          inProgress: isToday ? 1 : 0,
        },
      });

      edges.push({
        id: `edge-${applicationId}-to-${consumer.id}`,
        source: nodes.find(n => n.type === 'job')?.id || `${applicationId}-main`,
        target: `${consumer.id}-node`,
        animated: isToday,
        style: { stroke: '#10b981', strokeWidth: 2 },
        type: 'smoothstep',
      });
    });
  }

  return { nodes, edges };
}
