import { Node, Edge } from 'reactflow';
import { applications, activities, getActivitiesForApplication, SwimLaneType } from './activityData';

export function generateVerticalColumnLayout(
  businessArea: string,
  selectedDate: Date
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  
  // Column configuration (vertical columns from left to right)
  const COLUMN_WIDTH = 280;
  const COLUMN_SPACING = 180;
  const NODE_SPACING = 140;
  const HEADER_HEIGHT = 80;
  
  const columns = [
    { name: 'Trade Events', x: 50, color: 'pink' as const },
    { name: 'Risk Engines', x: 50 + COLUMN_WIDTH + COLUMN_SPACING, color: 'blue' as const },
    { name: 'Aggregation', x: 50 + (COLUMN_WIDTH + COLUMN_SPACING) * 2, color: 'purple' as const },
    { name: 'Downstream\nClients', x: 50 + (COLUMN_WIDTH + COLUMN_SPACING) * 3, color: 'green' as const }
  ];
  
  // Create column headers
  columns.forEach((column, index) => {
    nodes.push({
      id: `header-${column.name}`,
      type: 'columnHeader',
      position: { x: column.x, y: 20 },
      data: {
        label: column.name,
      },
      draggable: false,
      selectable: false,
    });
  });
  
  // --- TRADE EVENTS COLUMN ---
  const tradeCol = columns[0];
  const tradeStartY = HEADER_HEIGHT + 50;
  
  // Get activity counts for ENDUR
  const endurTradeActivities = getActivitiesForApplication('Endur-Trade');
  const endurRiskActivities = getActivitiesForApplication('Endur-Risk');
  
  // Endur (Trade Events)
  nodes.push({
    id: 'node-Endur-Trade',
    type: 'hexagon',
    position: { x: tradeCol.x + COLUMN_WIDTH / 2 - 60, y: tradeStartY },
    data: {
      label: 'Endur',
      application: 'Endur-Trade',
      color: 'pink',
      size: 'medium',
      activityCount: endurTradeActivities.length,
    },
    draggable: false,
  });
  
  // CIRC
  nodes.push({
    id: 'node-CIRC',
    type: 'hexagon',
    position: { x: tradeCol.x + COLUMN_WIDTH / 2 - 60, y: tradeStartY + NODE_SPACING },
    data: {
      label: 'CIRC',
      application: 'CIRC',
      color: 'pink',
      size: 'medium',
    },
    draggable: false,
  });
  
  // FXTS OPICS
  nodes.push({
    id: 'node-FXTS OPICS',
    type: 'hexagon',
    position: { x: tradeCol.x + COLUMN_WIDTH / 2 - 60, y: tradeStartY + NODE_SPACING * 2 },
    data: {
      label: 'FXTS OPICS',
      application: 'FXTS OPICS',
      color: 'pink',
      size: 'medium',
    },
    draggable: false,
  });
  
  // TDS - Hub between Trade Events and Risk Engines
  const tdsY = tradeStartY + NODE_SPACING;
  nodes.push({
    id: 'node-TDS',
    type: 'hexagon',
    position: { 
      x: tradeCol.x + COLUMN_WIDTH + COLUMN_SPACING / 2 - 50, 
      y: tdsY 
    },
    data: {
      label: 'TDS',
      application: 'TDS',
      color: 'lavender',
      size: 'small',
    },
    draggable: false,
  });
  
  // Edges from Trade Events to TDS (CIRC and FXTS OPICS only)
  edges.push({
    id: 'edge-CIRC-to-TDS',
    source: 'node-CIRC',
    target: 'node-TDS',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#f472b6', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  edges.push({
    id: 'edge-FXTS-to-TDS',
    source: 'node-FXTS OPICS',
    target: 'node-TDS',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#f472b6', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  // --- RISK ENGINES COLUMN ---
  const riskCol = columns[1];
  const riskStartY = HEADER_HEIGHT + 50;
  
  // Endur (Risk Engines)
  nodes.push({
    id: 'node-Endur-Risk',
    type: 'hexagon',
    position: { x: riskCol.x + COLUMN_WIDTH / 2 - 60, y: riskStartY },
    data: {
      label: 'Endur',
      application: 'Endur-Risk',
      color: 'blue',
      size: 'medium',
      activityCount: endurRiskActivities.length,
    },
    draggable: false,
  });
  
  // Edge from Endur (Trade) to Endur (Risk)
  edges.push({
    id: 'edge-Endur-Trade-to-Endur-Risk',
    source: 'node-Endur-Trade',
    target: 'node-Endur-Risk',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  // Vasara
  nodes.push({
    id: 'node-Vasara',
    type: 'hexagon',
    position: { x: riskCol.x + COLUMN_WIDTH / 2 - 60, y: riskStartY + NODE_SPACING },
    data: {
      label: 'Vasara',
      application: 'Vasara',
      color: 'blue',
      size: 'medium',
    },
    draggable: false,
  });
  
  // Edge from TDS to Vasara
  edges.push({
    id: 'edge-TDS-to-Vasara',
    source: 'node-TDS',
    target: 'node-Vasara',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#60a5fa', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  // DDS - Hub between Risk Engines and Aggregation
  const ddsRiskY = riskStartY + NODE_SPACING * 2;
  nodes.push({
    id: 'node-DDS-Risk',
    type: 'hexagon',
    position: { 
      x: riskCol.x + COLUMN_WIDTH + COLUMN_SPACING / 2 - 50, 
      y: ddsRiskY 
    },
    data: {
      label: 'DDS',
      application: 'DDS-Risk',
      color: 'gray',
      size: 'small',
    },
    draggable: false,
  });
  
  // Edges from Risk Engines to DDS
  edges.push({
    id: 'edge-Endur-Risk-to-DDS',
    source: 'node-Endur-Risk',
    target: 'node-DDS-Risk',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#60a5fa', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  edges.push({
    id: 'edge-Vasara-to-DDS',
    source: 'node-Vasara',
    target: 'node-DDS-Risk',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#60a5fa', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  // --- AGGREGATION COLUMN ---
  const aggCol = columns[2];
  const aggStartY = HEADER_HEIGHT + 150;
  
  // Kessel (PROMINENT RED)
  nodes.push({
    id: 'node-Kessel',
    type: 'hexagon',
    position: { x: aggCol.x + COLUMN_WIDTH / 2 - 75, y: aggStartY },
    data: {
      label: 'Kessel',
      application: 'Kessel',
      color: 'red',
      size: 'large',
    },
    draggable: false,
  });
  
  // Edge from DDS (Risk) to Kessel
  edges.push({
    id: 'edge-DDS-Risk-to-Kessel',
    source: 'node-DDS-Risk',
    target: 'node-Kessel',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#f97316', strokeWidth: 3 },
    type: 'smoothstep',
  });
  
  // DDS - Hub between Aggregation and Downstream
  const ddsDownstreamY = aggStartY + 130;
  nodes.push({
    id: 'node-DDS-Downstream',
    type: 'hexagon',
    position: { 
      x: aggCol.x + COLUMN_WIDTH + COLUMN_SPACING / 2 - 50, 
      y: ddsDownstreamY 
    },
    data: {
      label: 'DDS',
      application: 'DDS-Downstream',
      color: 'lavender',
      size: 'small',
    },
    draggable: false,
  });
  
  // Edge from Kessel to DDS (Downstream)
  edges.push({
    id: 'edge-Kessel-to-DDS-Downstream',
    source: 'node-Kessel',
    target: 'node-DDS-Downstream',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#f97316', strokeWidth: 3 },
    type: 'smoothstep',
  });
  
  // --- DOWNSTREAM CLIENTS COLUMN ---
  const downCol = columns[3];
  const downStartY = HEADER_HEIGHT + 100;
  
  // VMDR
  nodes.push({
    id: 'node-VMDR',
    type: 'hexagon',
    position: { x: downCol.x + COLUMN_WIDTH / 2 - 60, y: downStartY },
    data: {
      label: 'VMDR',
      application: 'VMDR',
      color: 'green',
      size: 'medium',
    },
    draggable: false,
  });
  
  // MARS
  nodes.push({
    id: 'node-MARS',
    type: 'hexagon',
    position: { x: downCol.x + COLUMN_WIDTH / 2 - 60, y: downStartY + NODE_SPACING },
    data: {
      label: 'MARS',
      application: 'MARS',
      color: 'green',
      size: 'medium',
    },
    draggable: false,
  });
  
  // PCW
  nodes.push({
    id: 'node-PCW',
    type: 'hexagon',
    position: { x: downCol.x + COLUMN_WIDTH / 2 - 60, y: downStartY + NODE_SPACING * 2 },
    data: {
      label: 'PCW',
      application: 'PCW',
      color: 'green',
      size: 'medium',
    },
    draggable: false,
  });
  
  // Edges from DDS (Downstream) to consumers
  edges.push({
    id: 'edge-DDS-to-VMDR',
    source: 'node-DDS-Downstream',
    target: 'node-VMDR',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#10b981', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  edges.push({
    id: 'edge-DDS-to-MARS',
    source: 'node-DDS-Downstream',
    target: 'node-MARS',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#10b981', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  edges.push({
    id: 'edge-DDS-to-PCW',
    source: 'node-DDS-Downstream',
    target: 'node-PCW',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: isToday,
    style: { stroke: '#10b981', strokeWidth: 2 },
    type: 'smoothstep',
  });
  
  return { nodes, edges };
}
