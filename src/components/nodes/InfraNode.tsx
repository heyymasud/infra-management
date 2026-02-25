import { memo, useMemo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import {
  Globe,
  Server,
  Database,
  Shield,
  Cloud,
  MemoryStick,
  MessageSquare,
  Network,
} from 'lucide-react';
import type { InfraNodeData, InfraNodeType } from '../../types';
import { NODE_PALETTE } from '../../types';
import { useFlowStore } from '../../store/useFlowStore';

// ── Icon Map ───────────────────────────────────────────────────────────────
const ICON_MAP: Record<InfraNodeType, React.ComponentType<{ size?: number; className?: string }>> = {
  webServer: Globe,
  appServer: Server,
  database: Database,
  loadBalancer: Network,
  firewall: Shield,
  cloud: Cloud,
  cache: MemoryStick,
  messageQueue: MessageSquare,
};

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

  const color = paletteItem?.color ?? '#64748b';
  const Icon = ICON_MAP[data.type];

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
        <Icon size={22} className={`text-[${color}]`} />
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
