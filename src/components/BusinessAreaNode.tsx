import { Handle, Position } from 'reactflow';
import { Building2, CheckCircle2, MousePointerClick } from 'lucide-react';

interface BusinessAreaNodeProps {
  data: {
    label: string;
    activityCount?: number;
    metCount?: number;
  };
}

export function BusinessAreaNode({ data }: BusinessAreaNodeProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg border-2 border-blue-700 min-w-[180px] cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-200 group relative">
      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <MousePointerClick className="w-3 h-3 text-blue-600" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-white mb-2">
          <Building2 className="w-5 h-5" />
          <span className="text-xs uppercase tracking-wide opacity-90">Business Area</span>
        </div>
        <div className="text-white mb-1">{data.label}</div>
        {data.activityCount !== undefined && (
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
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-700 !w-3 !h-3"
      />
    </div>
  );
}
