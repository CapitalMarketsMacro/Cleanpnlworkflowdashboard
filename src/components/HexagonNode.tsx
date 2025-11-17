import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface HexagonNodeProps {
  data: {
    label: string;
    application?: string;
    activityCount?: number;
    slaMet?: number;
    slaMissed?: number;
    inProgress?: number;
    color?: 'pink' | 'blue' | 'purple' | 'gray' | 'red' | 'green' | 'lavender';
    size?: 'small' | 'medium' | 'large';
  };
}

export const HexagonNode = memo(({ data }: HexagonNodeProps) => {
  const { label, color = 'blue', size = 'medium', activityCount, slaMet, slaMissed, inProgress } = data;
  
  // Color schemes
  const colorSchemes = {
    pink: {
      bg: '#fecdd3',
      border: '#f43f5e',
      text: '#881337'
    },
    blue: {
      bg: '#bfdbfe',
      border: '#3b82f6',
      text: '#1e3a8a'
    },
    purple: {
      bg: '#ddd6fe',
      border: '#8b5cf6',
      text: '#4c1d95'
    },
    lavender: {
      bg: '#e9d5ff',
      border: '#a855f7',
      text: '#581c87'
    },
    gray: {
      bg: '#d1d5db',
      border: '#6b7280',
      text: '#1f2937'
    },
    red: {
      bg: '#dc2626',
      border: '#991b1b',
      text: '#ffffff'
    },
    green: {
      bg: '#86efac',
      border: '#16a34a',
      text: '#14532d'
    }
  };
  
  const colorScheme = colorSchemes[color];
  
  // Size configurations
  const sizeConfig = {
    small: { width: 90, height: 60, fontSize: 11 },
    medium: { width: 120, height: 80, fontSize: 13 },
    large: { width: 150, height: 100, fontSize: 15 }
  };
  
  const sizeSettings = sizeConfig[size];
  
  // Create hexagon path
  const createHexagonPath = (width: number, height: number) => {
    const w = width;
    const h = height;
    const offset = w * 0.25;
    
    return `
      M ${offset},0 
      L ${w - offset},0 
      L ${w},${h / 2} 
      L ${w - offset},${h} 
      L ${offset},${h} 
      L 0,${h / 2} 
      Z
    `;
  };
  
  const hasStats = activityCount !== undefined;
  
  return (
    <div style={{ width: sizeSettings.width, height: sizeSettings.height }}>
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ 
          background: colorScheme.border, 
          width: 8, 
          height: 8,
          left: -4
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ 
          background: colorScheme.border, 
          width: 8, 
          height: 8,
          right: -4
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ 
          background: colorScheme.border, 
          width: 8, 
          height: 8,
          top: -4
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ 
          background: colorScheme.border, 
          width: 8, 
          height: 8,
          bottom: -4
        }}
      />
      
      {/* Hexagon SVG */}
      <svg 
        width={sizeSettings.width} 
        height={sizeSettings.height}
        style={{ 
          filter: color === 'red' ? 'drop-shadow(0px 0px 12px rgba(220, 38, 38, 0.6))' : 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))',
          transition: 'transform 0.2s'
        }}
        className="hover:scale-105 cursor-pointer"
      >
        <path
          d={createHexagonPath(sizeSettings.width, sizeSettings.height)}
          fill={colorScheme.bg}
          stroke={colorScheme.border}
          strokeWidth={color === 'red' ? 3 : 2}
        />
        <text
          x={sizeSettings.width / 2}
          y={hasStats ? sizeSettings.height / 2 - 8 : sizeSettings.height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={colorScheme.text}
          fontSize={sizeSettings.fontSize}
          fontWeight={color === 'red' ? 'bold' : '600'}
        >
          {label}
        </text>
        {hasStats && (
          <text
            x={sizeSettings.width / 2}
            y={sizeSettings.height / 2 + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colorScheme.text}
            fontSize={9}
            opacity={0.8}
          >
            {activityCount} jobs
          </text>
        )}
      </svg>
    </div>
  );
});

HexagonNode.displayName = 'HexagonNode';
