import { Handle, Position } from 'reactflow';
import { Server, CheckCircle2, Database, MousePointerClick, AlertCircle, PlayCircle } from 'lucide-react';

interface ApplicationNodeProps {
  data: {
    label: string;
    application?: string;
    activityCount?: number;
    slaMet?: number;
    slaMissed?: number;
    inProgress?: number;
    metCount?: number;
    type?: string;
  };
}

export function ApplicationNode({ data }: ApplicationNodeProps) {
  const isConsumer = data.type === 'Consumer';
  const hasDetailedStats = data.slaMet !== undefined;
  
  return (
    <div className={`bg-gradient-to-br ${isConsumer ? 'from-teal-500 to-teal-600 border-teal-700' : 'from-orange-500 to-orange-600 border-orange-700'} rounded-lg shadow-lg border-2 min-w-[160px] cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-200 group relative`}>
      {!isConsumer && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <MousePointerClick className="w-3 h-3 text-orange-600" />
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`${isConsumer ? '!bg-teal-700' : '!bg-orange-700'} !w-3 !h-3`}
      />
      <div className="p-3">
        <div className="flex items-center gap-2 text-white mb-2">
          {isConsumer ? <Database className="w-4 h-4" /> : <Server className="w-4 h-4" />}
          <span className="text-xs uppercase tracking-wide opacity-90">
            {isConsumer ? 'Consumer' : 'Application'}
          </span>
        </div>
        <div className="text-white mb-1">
          <div className="text-sm">{data.label}</div>
        </div>
        {hasDetailedStats ? (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-xs text-white opacity-90">
              <span>{data.activityCount} jobs</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white opacity-90">
              <CheckCircle2 className="w-3 h-3 text-green-200" />
              <span>{data.slaMet}</span>
              <AlertCircle className="w-3 h-3 text-red-200 ml-1" />
              <span>{data.slaMissed}</span>
              {data.inProgress! > 0 && (
                <>
                  <PlayCircle className="w-3 h-3 text-yellow-200 ml-1" />
                  <span>{data.inProgress}</span>
                </>
              )}
            </div>
          </div>
        ) : data.activityCount !== undefined ? (
          <div className="flex items-center gap-2 text-xs text-white opacity-75 mt-2">
            <span>{data.activityCount} activities</span>
            {data.metCount !== undefined && (
              <>
                <span>•</span>
                <CheckCircle2 className="w-3 h-3" />
                <span>{data.metCount}</span>
              </>
            )}
          </div>
        ) : null}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`${isConsumer ? '!bg-teal-700' : '!bg-orange-700'} !w-3 !h-3`}
      />
    </div>
  );
}
