import { memo } from 'react';

interface ColumnHeaderNodeProps {
  data: {
    label: string;
  };
}

export const ColumnHeaderNode = memo(({ data }: ColumnHeaderNodeProps) => {
  const isActivityInfo = data.label.includes('ActivityId:');
  
  return (
    <div className="text-center">
      <div 
        className={`${
          isActivityInfo 
            ? 'text-[10px] text-slate-600 dark:text-slate-400' 
            : 'text-sm font-semibold text-slate-700 dark:text-slate-300'
        } whitespace-pre-line`}
      >
        {data.label}
      </div>
    </div>
  );
});

ColumnHeaderNode.displayName = 'ColumnHeaderNode';
