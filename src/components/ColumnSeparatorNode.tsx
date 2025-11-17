import { memo } from 'react';

interface ColumnSeparatorNodeProps {
  data: {
    height: number;
  };
}

export const ColumnSeparatorNode = memo(({ data }: ColumnSeparatorNodeProps) => {
  return (
    <div 
      className="pointer-events-none"
      style={{ 
        width: 2, 
        height: data.height,
        background: 'linear-gradient(to bottom, transparent 0%, #cbd5e1 20%, #cbd5e1 80%, transparent 100%)',
        opacity: 0.4,
        boxShadow: '0 0 10px rgba(148, 163, 184, 0.2)',
        position: 'relative',
        zIndex: 100, // Ensure it's on top
      }}
    >
      {/* Subtle glow effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: -1,
          width: 4,
          height: '100%',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(148, 163, 184, 0.15) 20%, rgba(148, 163, 184, 0.15) 80%, transparent 100%)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
});

ColumnSeparatorNode.displayName = 'ColumnSeparatorNode';
