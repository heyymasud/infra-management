import { memo, useMemo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { InfraNodeData } from '../../types';
import { NODE_PALETTE } from '../../config';
import { useFlowStore } from '../../store/useFlowStore';

// ── Type Alias ─────────────────────────────────────────────────────────────
type InfraNodeInstance = Node<InfraNodeData, 'infraNode'>;

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

  return (
    <div
      className="infra-node"
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
        className="infra-handle"
        style={{ borderColor: color }}
      />

      {/* Node Content */}
      <div className="infra-node__icon" style={{ backgroundColor: `${color}15` }}>
        {Icon && <Icon size={22} color={color} />}
      </div>
      <div className="infra-node__info">
        <span className="infra-node__label">{data.label}</span>
        <span className="infra-node__type">{paletteItem?.description}</span>
      </div>

      {/* Source Handle (Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="infra-handle"
        style={{ borderColor: color }}
      />
    </div>
  );
}

export default memo(InfraNodeComponent);
