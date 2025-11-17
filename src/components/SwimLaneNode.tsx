import { NodeProps } from 'reactflow';

export interface SwimLaneData {
  label: string;
  type: 'trade' | 'risk' | 'marketData' | 'aggregation' | 'consumer';
  width: number;
  height: number;
}

export function SwimLaneNode({ data }: NodeProps<SwimLaneData>) {
  const colorMap = {
    trade: 'border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/20',
    risk: 'border-purple-300 dark:border-purple-700 bg-purple-50/30 dark:bg-purple-950/20',
    marketData: 'border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-950/20',
    aggregation: 'border-orange-300 dark:border-orange-700 bg-orange-50/30 dark:bg-orange-950/20',
    consumer: 'border-pink-300 dark:border-pink-700 bg-pink-50/30 dark:bg-pink-950/20',
  };

  const textColorMap = {
    trade: 'text-blue-700 dark:text-blue-300',
    risk: 'text-purple-700 dark:text-purple-300',
    marketData: 'text-green-700 dark:text-green-300',
    aggregation: 'text-orange-700 dark:text-orange-300',
    consumer: 'text-pink-700 dark:text-pink-300',
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg ${colorMap[data.type]} p-4`}
      style={{ 
        width: data.width, 
        height: data.height,
        pointerEvents: 'none',
      }}
    >
      <div className={`${textColorMap[data.type]} uppercase tracking-wide opacity-80`}>
        {data.label}
      </div>
    </div>
  );
}
