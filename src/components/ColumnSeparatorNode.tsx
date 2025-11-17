import { memo } from 'react';

interface ColumnSeparatorNodeProps {
  data: {
    height: number;
  };
}

export const ColumnSeparatorNode = memo(({ data }: ColumnSeparatorNodeProps) => {
  return (
    <div 
      style={{ 
        width: 2, 
        height: data.height,
        borderLeft: '2px dotted #94a3b8',
        opacity: 0.5
      }}
    />
  );
});

ColumnSeparatorNode.displayName = 'ColumnSeparatorNode';
