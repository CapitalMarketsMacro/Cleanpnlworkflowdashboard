import { Node, Edge, MarkerType } from 'reactflow';

const businessAreas = [
  'Commodities',
  'Equities',
  'Rates',
  'FX',
  'Munis',
  'SPG',
  'XVA FISIN',
  'Credit',
];

const activities = [
  'Trade Events',
  'Risk Engine',
  'Aggregation',
  'Finance Reports',
];

const applications = ['CIRC', 'Catalyst', 'Endur', 'Apex', 'Summit'];

const jobTemplates = [
  'EOD Calculation',
  'Risk Assessment',
  'PNL Generation',
  'Data Aggregation',
  'Reconciliation',
  'Validation',
  'Report Generation',
];

const slaTargets = ['09:00', '10:30', '12:00', '14:30', '17:00'];

type JobStatus = 'met' | 'missed' | 'not-started' | 'in-progress';

// Generate a deterministic random value based on date and seed
function seededRandom(date: Date, seed: number): number {
  const dateNum = date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
  const x = Math.sin(dateNum + seed) * 10000;
  return x - Math.floor(x);
}

function randomStatus(date: Date, seed: number): JobStatus {
  const isToday = date.toDateString() === new Date().toDateString();
  
  // For historical dates, show completed statuses
  if (!isToday) {
    const rand = seededRandom(date, seed);
    if (rand < 0.7) return 'met';
    return 'missed';
  }
  
  // For today, show a mix including in-progress
  const rand = seededRandom(date, seed);
  if (rand < 0.35) return 'met';
  if (rand < 0.45) return 'missed';
  if (rand < 0.65) return 'in-progress';
  return 'not-started';
}

export function generateInitialData(businessDate: Date = new Date()) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;
  let seedCounter = 0;

  const spacing = {
    businessArea: { x: 0, y: 200 },
    activity: { x: 300, y: 150 },
    application: { x: 600, y: 120 },
    job: { x: 900, y: 100 },
  };

  // Create business area nodes (all 8 business areas)
  const businessAreaNodes = businessAreas.map((area, index) => {
    const id = `ba-${nodeId++}`;
    nodes.push({
      id,
      type: 'businessArea',
      position: { x: spacing.businessArea.x, y: index * spacing.businessArea.y },
      data: { label: area },
    });
    return id;
  });

  // Create activity nodes
  const activityNodes = activities.map((activity, index) => {
    const id = `activity-${nodeId++}`;
    nodes.push({
      id,
      type: 'activity',
      position: { x: spacing.activity.x, y: index * spacing.activity.y + 50 },
      data: { label: activity },
    });
    return id;
  });

  // Connect business areas to activities
  businessAreaNodes.forEach((baId) => {
    activityNodes.forEach((actId) => {
      edges.push({
        id: `${baId}-${actId}`,
        source: baId,
        target: actId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#64748b', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#64748b',
        },
      });
    });
  });

  // Create application nodes
  const applicationNodes: string[] = [];
  activities.forEach((_, activityIndex) => {
    const numApps = 2 + Math.floor(seededRandom(businessDate, seedCounter++) * 2);
    const appsForActivity = applications.slice(0, numApps);
    
    appsForActivity.forEach((app, appIndex) => {
      const id = `app-${nodeId++}`;
      const yPos = activityIndex * spacing.activity.y + appIndex * spacing.application.y + 20;
      
      nodes.push({
        id,
        type: 'application',
        position: { x: spacing.application.x, y: yPos },
        data: { label: app },
      });
      
      applicationNodes.push(id);
      
      // Connect activity to application
      edges.push({
        id: `${activityNodes[activityIndex]}-${id}`,
        source: activityNodes[activityIndex],
        target: id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6',
        },
      });
    });
  });

  // Create job nodes
  applicationNodes.forEach((appId, appIndex) => {
    const jobsForApp = 2 + Math.floor(seededRandom(businessDate, seedCounter++) * 2);
    
    for (let i = 0; i < jobsForApp; i++) {
      const id = `job-${nodeId++}`;
      const jobTemplate = jobTemplates[Math.floor(seededRandom(businessDate, seedCounter++) * jobTemplates.length)];
      const status = randomStatus(businessDate, seedCounter++);
      
      const yPos = appIndex * 120 + i * spacing.job.y;
      
      nodes.push({
        id,
        type: 'job',
        position: { x: spacing.job.x, y: yPos },
        data: {
          label: jobTemplate,
          jobId: `JOB-${1000 + nodeId}`,
          status,
          slaTime: slaTargets[Math.floor(seededRandom(businessDate, seedCounter++) * slaTargets.length)],
          progress: status === 'in-progress' ? seededRandom(businessDate, seedCounter++) * 100 : 0,
        },
      });
      
      // Connect application to job
      const edgeColor = 
        status === 'met' ? '#22c55e' :
        status === 'missed' ? '#ef4444' :
        status === 'in-progress' ? '#eab308' :
        '#94a3b8';
      
      edges.push({
        id: `${appId}-${id}`,
        source: appId,
        target: id,
        type: 'smoothstep',
        animated: status === 'in-progress',
        style: { stroke: edgeColor, strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
        },
      });
    }
  });

  return { nodes, edges };
}
