export interface Activity {
  id: string;
  name: string;
  activityType: 'Trade' | 'Risk' | 'Market Data' | 'Aggregation';
  expectedStartTime: string;
  expectedEndTime: string;
  appId: string;
  businessArea: string;
}

export interface Application {
  id: string;
  name: string;
  activityTypes: string[];
}

export const activities: Activity[] = [
  // Commodities Activities (1COM)
  {
    id: '1COM-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-02',
    name: 'EOD Bump&Reset Scenario Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:30',
    expectedEndTime: '17:00',
    appId: 'CIRC',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-03',
    name: 'EOD Market Data Snapshot (T-1)',
    activityType: 'Market Data',
    expectedStartTime: '17:00',
    expectedEndTime: '17:30',
    appId: 'Catalyst',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-04',
    name: 'EOD Bump&Reset Marketdata Snapshot',
    activityType: 'Market Data',
    expectedStartTime: '17:30',
    expectedEndTime: '18:00',
    appId: 'Catalyst',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-05',
    name: 'SOD Market Data Snapshot (T)',
    activityType: 'Market Data',
    expectedStartTime: '06:00',
    expectedEndTime: '06:30',
    appId: 'Catalyst',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-06',
    name: 'SOD Simulation Run (T-1 TradeData T SOD Market Data)',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Endur',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-08',
    name: 'PLA Risk Attribution',
    activityType: 'Risk',
    expectedStartTime: '08:00',
    expectedEndTime: '09:00',
    appId: 'Endur',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-09',
    name: 'Prelim EOD Market Data Snapshot',
    activityType: 'Market Data',
    expectedStartTime: '14:00',
    expectedEndTime: '14:30',
    appId: 'Catalyst',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-10',
    name: 'Prelim EOD Simulation Run (T-1 TradeData T Prelim EOD Market Data)',
    activityType: 'Risk',
    expectedStartTime: '14:30',
    expectedEndTime: '15:30',
    appId: 'Endur',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'Commodities',
  },
  {
    id: '1COM-13',
    name: 'FO PLA Clean PNL Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:30',
    expectedEndTime: '10:00',
    appId: 'Kessel',
    businessArea: 'Commodities',
  },
  // Equities Activities (2EQU)
  {
    id: '2EQU-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'Equities',
  },
  {
    id: '2EQU-03',
    name: 'EOD Market Data Snapshot (T-1)',
    activityType: 'Market Data',
    expectedStartTime: '17:00',
    expectedEndTime: '17:30',
    appId: 'Catalyst',
    businessArea: 'Equities',
  },
  {
    id: '2EQU-05',
    name: 'SOD Market Data Snapshot (T)',
    activityType: 'Market Data',
    expectedStartTime: '06:00',
    expectedEndTime: '06:30',
    appId: 'Catalyst',
    businessArea: 'Equities',
  },
  {
    id: '2EQU-06',
    name: 'SOD Simulation Run',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Summit',
    businessArea: 'Equities',
  },
  {
    id: '2EQU-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'Equities',
  },
  // Rates Activities (3RAT)
  {
    id: '3RAT-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'Rates',
  },
  {
    id: '3RAT-03',
    name: 'EOD Market Data Snapshot (T-1)',
    activityType: 'Market Data',
    expectedStartTime: '17:00',
    expectedEndTime: '17:30',
    appId: 'Murex',
    businessArea: 'Rates',
  },
  {
    id: '3RAT-06',
    name: 'SOD Simulation Run',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Murex',
    businessArea: 'Rates',
  },
  {
    id: '3RAT-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'Rates',
  },
  // FX Activities (4FX)
  {
    id: '4FX-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'FX',
  },
  {
    id: '4FX-03',
    name: 'EOD Market Data Snapshot (T-1)',
    activityType: 'Market Data',
    expectedStartTime: '17:00',
    expectedEndTime: '17:30',
    appId: 'Murex',
    businessArea: 'FX',
  },
  {
    id: '4FX-06',
    name: 'SOD Simulation Run',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Calypso',
    businessArea: 'FX',
  },
  {
    id: '4FX-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'FX',
  },
  // Munis Activities (5MUN)
  {
    id: '5MUN-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'Munis',
  },
  {
    id: '5MUN-03',
    name: 'EOD Market Data Snapshot (T-1)',
    activityType: 'Market Data',
    expectedStartTime: '17:00',
    expectedEndTime: '17:30',
    appId: 'Catalyst',
    businessArea: 'Munis',
  },
  {
    id: '5MUN-06',
    name: 'SOD Simulation Run',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Endur',
    businessArea: 'Munis',
  },
  {
    id: '5MUN-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'Munis',
  },
  // SPG Activities (6SPG)
  {
    id: '6SPG-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'SPG',
  },
  {
    id: '6SPG-06',
    name: 'SOD Simulation Run',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Summit',
    businessArea: 'SPG',
  },
  {
    id: '6SPG-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'SPG',
  },
  // XVA FISIN Activities (7XVA)
  {
    id: '7XVA-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'XVA FISIN',
  },
  {
    id: '7XVA-06',
    name: 'SOD Simulation Run',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Murex',
    businessArea: 'XVA FISIN',
  },
  {
    id: '7XVA-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'XVA FISIN',
  },
  // Credit Activities (8CRD)
  {
    id: '8CRD-01',
    name: 'EOD Trade Snapshot (T-1)',
    activityType: 'Trade',
    expectedStartTime: '16:00',
    expectedEndTime: '16:30',
    appId: 'CIRC',
    businessArea: 'Credit',
  },
  {
    id: '8CRD-03',
    name: 'EOD Market Data Snapshot (T-1)',
    activityType: 'Market Data',
    expectedStartTime: '17:00',
    expectedEndTime: '17:30',
    appId: 'Murex',
    businessArea: 'Credit',
  },
  {
    id: '8CRD-06',
    name: 'SOD Simulation Run',
    activityType: 'Risk',
    expectedStartTime: '06:30',
    expectedEndTime: '07:30',
    appId: 'Summit',
    businessArea: 'Credit',
  },
  {
    id: '8CRD-12',
    name: 'FO PLA Risk Reports',
    activityType: 'Aggregation',
    expectedStartTime: '09:00',
    expectedEndTime: '09:30',
    appId: 'Kessel',
    businessArea: 'Credit',
  },
];

export const applications: Application[] = [
  { id: 'CIRC', name: 'CIRC', activityTypes: ['Trade'] },
  { id: 'Catalyst', name: 'Catalyst', activityTypes: ['Market Data'] },
  { id: 'Endur', name: 'Endur', activityTypes: ['Risk'] },
  { id: 'Summit', name: 'Summit', activityTypes: ['Risk'] },
  { id: 'Murex', name: 'Murex', activityTypes: ['Risk', 'Market Data'] },
  { id: 'Calypso', name: 'Calypso', activityTypes: ['Risk'] },
  { id: 'Kessel', name: 'Kessel', activityTypes: ['Aggregation'] },
];

export const downstreamApps = [
  { id: 'VMDR', name: 'VMDR', type: 'Consumer' },
  { id: 'MARS', name: 'MARS', type: 'Consumer' },
  { id: 'PCW', name: 'PCW', type: 'Consumer' },
];

export const businessAreas = [
  'Commodities',
  'Equities',
  'Rates',
  'FX',
  'Munis',
  'SPG',
  'XVA FISIN',
  'Credit',
];

export function getActivitiesForBusinessArea(businessArea: string): Activity[] {
  return activities.filter((activity) => activity.businessArea === businessArea);
}

export function getApplicationsForBusinessArea(businessArea: string): string[] {
  const businessActivities = getActivitiesForBusinessArea(businessArea);
  const appIds = new Set(businessActivities.map((activity) => activity.appId));
  return Array.from(appIds);
}

export function getActivitiesByType(businessArea: string, activityType: string): Activity[] {
  return activities.filter(
    (activity) =>
      activity.businessArea === businessArea &&
      activity.activityType === activityType
  );
}
