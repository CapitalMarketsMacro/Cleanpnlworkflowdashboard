import { Handle, Position } from 'reactflow';
import { Clock, CheckCircle2, XCircle, Circle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type JobStatus = 'met' | 'missed' | 'not-started' | 'in-progress';

interface JobNodeProps {
  data: {
    label: string;
    jobId: string;
    status: JobStatus;
    slaTime?: string;
    progress?: number;
    activityType?: string;
    businessStepId?: string;
    businessStepDescription?: string;
    expectedStartTime?: string;
    expectedEndTime?: string;
  };
}

const statusConfig = {
  met: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    icon: CheckCircle2,
    iconColor: 'text-green-600',
    text: 'text-green-900',
    label: 'SLA Met',
  },
  missed: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    icon: XCircle,
    iconColor: 'text-red-600',
    text: 'text-red-900',
    label: 'SLA Missed',
  },
  'not-started': {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    icon: Circle,
    iconColor: 'text-slate-400',
    text: 'text-slate-900',
    label: 'Not Started',
  },
  'in-progress': {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    icon: Clock,
    iconColor: 'text-yellow-600',
    text: 'text-yellow-900',
    label: 'In Progress',
  },
};

export function JobNode({ data }: JobNodeProps) {
  // Provide default status if undefined or invalid
  const status = data.status && statusConfig[data.status] ? data.status : 'not-started';
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${config.bg} rounded-lg shadow-md border-2 ${config.border} min-w-[200px] cursor-pointer`}>
            <Handle
              type="target"
              position={Position.Left}
              className={`!${config.border.replace('border-', 'bg-')} !w-3 !h-3`}
            />
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wide text-slate-600">Job</span>
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
              </div>
              <div className={`${config.text} mb-1`}>{data.label}</div>
              <div className="text-xs text-slate-600 mb-2">ID: {data.jobId}</div>
        
        {data.status === 'in-progress' && data.progress !== undefined && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600">Progress</span>
              <span className="text-xs text-slate-600">{Math.round(data.progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${data.progress}%` }}
              />
            </div>
          </div>
        )}
        
        {data.slaTime && (
          <div className="mt-2 text-xs text-slate-600">
            SLA: {data.slaTime}
          </div>
        )}
        
        <div className={`mt-2 text-xs ${config.iconColor}`}>
          {config.label}
        </div>
      </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm">
          <div className="space-y-2">
            <div className="font-semibold border-b pb-1">{data.label}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-500">Activity ID:</div>
              <div className="font-mono">{data.jobId}</div>
              
              {data.businessStepId && (
                <>
                  <div className="text-slate-500">Business Step:</div>
                  <div className="font-mono">{data.businessStepId}</div>
                </>
              )}
              
              {data.businessStepDescription && (
                <>
                  <div className="text-slate-500">Step Description:</div>
                  <div>{data.businessStepDescription}</div>
                </>
              )}
              
              {data.activityType && (
                <>
                  <div className="text-slate-500">Activity Type:</div>
                  <div className="uppercase">{data.activityType}</div>
                </>
              )}
              
              {data.expectedStartTime && (
                <>
                  <div className="text-slate-500">Expected Start:</div>
                  <div>{data.expectedStartTime}</div>
                </>
              )}
              
              {data.expectedEndTime && (
                <>
                  <div className="text-slate-500">Expected End:</div>
                  <div>{data.expectedEndTime}</div>
                </>
              )}
              
              {data.slaTime && (
                <>
                  <div className="text-slate-500">SLA Time:</div>
                  <div>{data.slaTime}</div>
                </>
              )}
              
              <div className="text-slate-500">Status:</div>
              <div className={`${config.iconColor} font-semibold`}>{config.label}</div>
              
              {data.status === 'in-progress' && data.progress !== undefined && (
                <>
                  <div className="text-slate-500">Progress:</div>
                  <div>{Math.round(data.progress)}%</div>
                </>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
