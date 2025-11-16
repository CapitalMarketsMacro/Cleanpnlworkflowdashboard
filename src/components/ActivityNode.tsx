import { Handle, Position } from 'reactflow';
import { Activity, Clock, CheckCircle2, XCircle, PlayCircle, Circle, MousePointerClick } from 'lucide-react';

interface ActivityNodeProps {
  data: {
    label: string;
    activityId?: string;
    activityType?: string;
    expectedStart?: string;
    expectedEnd?: string;
    status?: 'met' | 'missed' | 'in-progress' | 'not-started';
    count?: number;
  };
}

export function ActivityNode({ data }: ActivityNodeProps) {
  const getStatusColor = () => {
    if (!data.status) return 'from-purple-500 to-purple-600';
    switch (data.status) {
      case 'met':
        return 'from-green-500 to-green-600';
      case 'missed':
        return 'from-red-500 to-red-600';
      case 'in-progress':
        return 'from-yellow-500 to-yellow-600';
      case 'not-started':
        return 'from-slate-400 to-slate-500';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  const getStatusIcon = () => {
    if (!data.status) return null;
    switch (data.status) {
      case 'met':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'missed':
        return <XCircle className="w-3 h-3" />;
      case 'in-progress':
        return <PlayCircle className="w-3 h-3" />;
      case 'not-started':
        return <Circle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getStatusColor()} rounded-lg shadow-lg border-2 border-opacity-70 min-w-[180px] max-w-[280px] cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-200 group relative`}>
      {!data.status && data.activityType && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <MousePointerClick className="w-3 h-3 text-purple-600" />
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-white !w-3 !h-3"
      />
      <div className="p-3">
        <div className="flex items-center gap-2 text-white mb-2">
          <Activity className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wide opacity-90">
            {data.activityType || 'Activity'}
          </span>
          {data.status && (
            <span className="ml-auto">{getStatusIcon()}</span>
          )}
        </div>
        <div className="text-white mb-1">
          {data.activityId && (
            <div className="text-xs opacity-90 mb-1">{data.activityId}</div>
          )}
          <div className="text-sm">{data.label}</div>
        </div>
        {data.count !== undefined && (
          <div className="text-xs text-white opacity-75 mt-2">
            {data.count} activities
          </div>
        )}
        {(data.expectedStart || data.expectedEnd) && (
          <div className="flex items-center gap-2 text-xs text-white opacity-75 mt-2">
            <Clock className="w-3 h-3" />
            <span>{data.expectedStart} - {data.expectedEnd}</span>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-white !w-3 !h-3"
      />
    </div>
  );
}
