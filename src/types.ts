import type { Node, Edge } from '@xyflow/react';

// ── Infrastructure Node Types ──────────────────────────────────────────────
export type InfraNodeType =
  | 'webServer'
  | 'appServer'
  | 'database'
  | 'loadBalancer'
  | 'firewall'
  | 'cloud'
  | 'cache'
  | 'messageQueue';

export interface InfraNodeData extends Record<string, unknown> {
  label: string;
  type: InfraNodeType;
  description?: string;
}

export type InfraNode = Node<InfraNodeData, 'infraNode'>;
export type InfraEdge = Edge;

// ── Node Palette Item ─────────────────────────────────────────────────────
export interface NodePaletteItem {
  type: InfraNodeType;
  label: string;
  color: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
}
