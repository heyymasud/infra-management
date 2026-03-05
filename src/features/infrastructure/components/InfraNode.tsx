import { memo, useMemo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { InfraNodeData } from '../types';
import { NODE_PALETTE } from '../config';
import { useFlowStore } from '../../diagram';

// ── Type Alias ─────────────────────────────────────────────────────────────
type InfraNodeInstance = Node<InfraNodeData, 'infraNode'>;

// ── Environment Colors ─────────────────────────────────────────────────────
const ENV_COLORS: Record<string, string> = {
  production: '#ef4444',
  staging: '#f59e0b',
  development: '#10b981',
};

// ── InfraNode Component ────────────────────────────────────────────────────
function InfraNodeComponent({ id, data, selected }: NodeProps<InfraNodeInstance>) {
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const isSelected = selected || selectedNodeId === id;

  const paletteItem = useMemo(
    () => NODE_PALETTE.find((p) => p.type === data.type),
    [data.type],
  );

  const color = paletteItem?.color ?? 'var(--color-text-secondary)';
  const Icon = paletteItem?.icon;

  const hasExtra = data.hostname || data.ipAddress;

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 min-w-[180px] bg-surface-glass-node backdrop-blur-md border-[1.5px] border-border rounded-xl shadow-sm transition-all duration-200 hover:border-(--node-color-medium) hover:shadow-[0_4px_12px_var(--node-color-light)] hover:-translate-y-px data-[selected=true]:border-(--node-color) data-[selected=true]:shadow-[0_4px_16px_var(--node-color-glow),0_0_0_3px_var(--node-color-light)]"
      style={{
        '--node-color': color,
        '--node-color-light': `${color}15`,
        '--node-color-medium': `${color}30`,
        '--node-color-glow': `${color}40`,
      } as React.CSSProperties}
      data-selected={isSelected}
    >
      {/* Target Handle (Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5! h-2.5! bg-handle-bg! border-2! border-handle-border! rounded-full! transition-all duration-150 hover:border-(--node-color)! hover:shadow-[0_0_8px_var(--node-color-glow)] hover:transform-[translate(-50%,-50%)_scale(1.2)]!"
        style={{ borderColor: color }}
      />

      {/* Node Content */}
      <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-[11px]" style={{ backgroundColor: `${color}15` }}>
        {Icon && <Icon size={22} color={color} />}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold whitespace-nowrap text-text-primary">{data.label}</span>
          {data.environment && (
            <span
              className="text-[8px] font-bold uppercase px-1.5 py-px rounded-full whitespace-nowrap leading-tight tracking-[0.04em]"
              style={{
                backgroundColor: `${ENV_COLORS[data.environment] ?? '#94a3b8'}14`,
                color: ENV_COLORS[data.environment] ?? '#94a3b8',
              }}
            >
              {data.environment.slice(0, 3).toUpperCase()}
            </span>
          )}
        </div>
        {hasExtra ? (
          <span className="text-[10px] font-medium whitespace-nowrap text-text-muted font-mono">
            {data.hostname}{data.hostname && data.ipAddress ? ' · ' : ''}{data.ipAddress}
          </span>
        ) : (
          <span className="text-[10.5px] font-normal whitespace-nowrap text-text-muted">{paletteItem?.description}</span>
        )}
      </div>

      {/* Source Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5! h-2.5! bg-handle-bg! border-2! border-handle-border! rounded-full! transition-all duration-150 hover:border-(--node-color)! hover:shadow-[0_0_8px_var(--node-color-glow)] hover:transform-[translate(50%,-50%)_scale(1.2)]!"
        style={{ borderColor: color }}
      />
    </div>
  );
}

export default memo(InfraNodeComponent);
