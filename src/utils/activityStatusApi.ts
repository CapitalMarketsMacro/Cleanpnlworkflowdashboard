// API Response interface matching the REST API format
export interface ActivityStatusResponse {
  "APP ID": string;
  "Business Step ID": string;
  "Activity ID": string;
  "Activity Type": string;
  "Activity Name": string;
  "BusinessArea": string;
  "Activity Status": "RUNNING" | "COMPLETED" | "NOT_STARTED" | "FAILED";
  "Business Date": string;
  "Reporting Time": string;
  "Run ID": string;
  "SLA Status": "SLA_SUCCESS" | "SLA_FAILURE" | "NOT_APPLICABLE";
  "Business Area": string;
}

export type JobStatus = 'met' | 'missed' | 'not-started' | 'in-progress';

export interface ActivityStatus {
  activityId: string;
  status: JobStatus;
  reportingTime: string;
  runId: string;
  businessDate: string;
  progress?: number;
}

// Map API status to internal job status
export function mapApiStatusToJobStatus(apiResponse: ActivityStatusResponse): ActivityStatus {
  let status: JobStatus;
  
  // Determine status based on Activity Status and SLA Status
  if (apiResponse["Activity Status"] === "NOT_STARTED") {
    status = 'not-started';
  } else if (apiResponse["Activity Status"] === "RUNNING") {
    status = 'in-progress';
  } else if (apiResponse["Activity Status"] === "COMPLETED") {
    status = apiResponse["SLA Status"] === "SLA_SUCCESS" ? 'met' : 'missed';
  } else if (apiResponse["Activity Status"] === "FAILED") {
    status = 'missed';
  } else {
    status = 'not-started';
  }

  // Calculate progress for running activities (mock based on time)
  let progress: number | undefined;
  if (status === 'in-progress') {
    // In a real scenario, this might come from the API
    progress = 30 + Math.random() * 40; // Random progress between 30-70%
  }

  return {
    activityId: apiResponse["Activity ID"],
    status,
    reportingTime: apiResponse["Reporting Time"],
    runId: apiResponse["Run ID"],
    businessDate: apiResponse["Business Date"],
    progress,
  };
}

// Mock API endpoint - In production, replace with actual API URL
const API_ENDPOINT = '/api/activity-status';

// Simulation start time (set when module loads)
let simulationStartTime: number | null = null;

// Reset simulation (useful for testing)
export function resetSimulation() {
  simulationStartTime = null;
}

// Get elapsed seconds since simulation started
function getElapsedSeconds(): number {
  if (!simulationStartTime) {
    simulationStartTime = Date.now();
    return 0;
  }
  return Math.floor((Date.now() - simulationStartTime) / 1000);
}

// Export elapsed seconds for external use
export function getSimulationElapsedSeconds(): number {
  return getElapsedSeconds();
}

// Simulate activity progression over 1 minute
function getSimulatedStatus(activityIndex: number, totalActivities: number): {
  activityStatus: ActivityStatusResponse["Activity Status"];
  slaStatus: ActivityStatusResponse["SLA Status"];
} {
  const elapsedSeconds = getElapsedSeconds();
  
  // All activities start as NOT_STARTED
  if (elapsedSeconds < 10) {
    return {
      activityStatus: "NOT_STARTED",
      slaStatus: "NOT_APPLICABLE"
    };
  }
  
  // Calculate when this activity should start (staggered based on index)
  const startDelay = (activityIndex / totalActivities) * 20; // Spread starts over 20 seconds
  const activityElapsed = elapsedSeconds - 10 - startDelay;
  
  // Not started yet
  if (activityElapsed < 0) {
    return {
      activityStatus: "NOT_STARTED",
      slaStatus: "NOT_APPLICABLE"
    };
  }
  
  // Running phase (5-15 seconds after start)
  if (activityElapsed < 15) {
    return {
      activityStatus: "RUNNING",
      slaStatus: "NOT_APPLICABLE"
    };
  }
  
  // Completed - determine success or failure
  // 85% success rate, 15% failure rate
  const willFail = activityIndex % 7 === 0; // Every 7th activity fails (roughly 14%)
  
  return {
    activityStatus: "COMPLETED",
    slaStatus: willFail ? "SLA_FAILURE" : "SLA_SUCCESS"
  };
}

// Base activity definitions (without status - status is simulated)
const baseActivities = [
  { "APP ID": "1COM", "Business Step ID": "Trade.PD", "Activity ID": "1COM-01", "Activity Type": "TRADE", "Activity Name": "EOD Trade Snapshot (T-1)", "BusinessArea": "Commodities", "Business Date": "2025-11-16T05:00:00.000Z", "Reporting Time": "2025-11-16T21:25:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Trade.BR", "Activity ID": "1COM-02", "Activity Type": "TRADE", "Activity Name": "EOD Bump & Reset Scenario Trade Snapshot (T-1)", "BusinessArea": "Commodities", "Business Date": "2025-11-16T05:00:00.000Z", "Reporting Time": "2025-11-16T22:50:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "MD.EOD", "Activity ID": "1COM-03", "Activity Type": "MARKET_DATA", "Activity Name": "EOD Market Data Snapshot (T-1)", "BusinessArea": "Commodities", "Business Date": "2025-11-16T05:00:00.000Z", "Reporting Time": "2025-11-16T23:20:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "MD.BR", "Activity ID": "1COM-04", "Activity Type": "MARKET_DATA", "Activity Name": "EOD Bump & Reset Market Data Snapshot", "BusinessArea": "Commodities", "Business Date": "2025-11-16T05:00:00.000Z", "Reporting Time": "2025-11-16T23:55:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "MD.SOD", "Activity ID": "1COM-05", "Activity Type": "MARKET_DATA", "Activity Name": "SOD Market Data Snapshot (T)", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T06:25:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.SOD", "Activity ID": "1COM-06", "Activity Type": "RISK", "Activity Name": "SOD Simulation Run (T-1 Trade Data, T SOD Market Data)", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T07:15:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.PLA", "Activity ID": "1COM-07", "Activity Type": "RISK", "Activity Name": "PLA Risk Attribution", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T08:20:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.CPNL", "Activity ID": "1COM-08", "Activity Type": "RISK", "Activity Name": "Clean PNL Calculation", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T08:45:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "MD.PEOD", "Activity ID": "1COM-09", "Activity Type": "MARKET_DATA", "Activity Name": "Prelim EOD Market Data Snapshot", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T08:45:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.PEOD", "Activity ID": "1COM-10", "Activity Type": "RISK", "Activity Name": "Prelim EOD Simulation Run (T-1 Trade Data, T Prelim EOD Market Data)", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T08:45:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Trade.ID1", "Activity ID": "1COM-11", "Activity Type": "TRADE", "Activity Name": "Intraday Trade Snapshot 1", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T10:25:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.ID1", "Activity ID": "1COM-12", "Activity Type": "RISK", "Activity Name": "Intraday Risk Run 1", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T10:55:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Trade.ID2", "Activity ID": "1COM-13", "Activity Type": "TRADE", "Activity Name": "Intraday Trade Snapshot 2", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T12:15:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.ID2", "Activity ID": "1COM-14", "Activity Type": "RISK", "Activity Name": "Intraday Risk Run 2", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T12:15:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.VAR", "Activity ID": "1COM-15", "Activity Type": "RISK", "Activity Name": "VaR Calculation", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T09:25:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.STRESS", "Activity ID": "1COM-16", "Activity Type": "RISK", "Activity Name": "Stress Testing", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T09:55:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.REG", "Activity ID": "1COM-17", "Activity Type": "RISK", "Activity Name": "Regulatory Reporting Prep", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T09:55:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Trade.RECON", "Activity ID": "1COM-18", "Activity Type": "TRADE", "Activity Name": "Trade Booking Reconciliation", "BusinessArea": "Commodities", "Business Date": "2025-11-16T05:00:00.000Z", "Reporting Time": "2025-11-16T20:25:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Trade.VAL", "Activity ID": "1COM-19", "Activity Type": "TRADE", "Activity Name": "Position Validation", "BusinessArea": "Commodities", "Business Date": "2025-11-16T05:00:00.000Z", "Reporting Time": "2025-11-16T20:55:00.000Z", "Run ID": "001", "Business Area": "Commodities" },
  { "APP ID": "1COM", "Business Step ID": "Risk.REPORT", "Activity ID": "1COM-20", "Activity Type": "RISK", "Activity Name": "Daily Risk Report Generation", "BusinessArea": "Commodities", "Business Date": "2025-11-17T05:00:00.000Z", "Reporting Time": "2025-11-17T09:55:00.000Z", "Run ID": "001", "Business Area": "Commodities" }
];

// Mock data generator for demonstration with 1-minute simulation
function generateMockApiResponse(): ActivityStatusResponse[] {
  // Apply simulated statuses to all base activities
  return baseActivities.map((activity, index) => {
    const simulatedStatus = getSimulatedStatus(index, baseActivities.length);
    return {
      ...activity,
      "Activity Status": simulatedStatus.activityStatus,
      "SLA Status": simulatedStatus.slaStatus
    } as ActivityStatusResponse;
  });
}

// Fetch activity status from REST API
export async function fetchActivityStatus(): Promise<ActivityStatus[]> {
  try {
    // In production, uncomment this to use real API:
    // const response = await fetch(API_ENDPOINT);
    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status}`);
    // }
    // const data: ActivityStatusResponse[] = await response.json();
    
    // For now, use mock data with simulation
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    const data = generateMockApiResponse();
    
    // Map API responses to internal format
    return data.map(mapApiStatusToJobStatus);
  } catch (error) {
    console.error('Error fetching activity status:', error);
    return [];
  }
}

// Calculate statistics from activity statuses
export function calculateStatsFromStatuses(statuses: ActivityStatus[]) {
  const total = statuses.length;
  const met = statuses.filter(s => s.status === 'met').length;
  const missed = statuses.filter(s => s.status === 'missed').length;
  const inProgress = statuses.filter(s => s.status === 'in-progress').length;
  const notStarted = statuses.filter(s => s.status === 'not-started').length;

  return {
    total,
    met,
    missed,
    inProgress,
    notStarted,
  };
}
