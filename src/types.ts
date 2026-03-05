import type { Node, Edge } from '@xyflow/react';

// Infrastructure Node Types
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
  hostname?: string;
  ipAddress?: string;
  environment?: 'development' | 'staging' | 'production';
  metadata?: Record<string, string>;
}

export type InfraNode = Node<InfraNodeData, 'infraNode'>;
export type InfraEdge = Edge<InfraEdgeData>;

// Edge Data
export interface InfraEdgeData extends Record<string, unknown> {
  label?: string;
}

// Group Node Types
export type GroupType = 'environment' | 'layer';

export interface GroupNodeData extends Record<string, unknown> {
  label: string;
  groupType: GroupType;
  color: string;
}

export type InfraGroupNode = Node<GroupNodeData, 'groupNode'>;

// Node Palette Item
export interface NodePaletteItem {
  type: InfraNodeType;
  label: string;
  color: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
}

// Group Palette Item
export interface GroupPaletteItem {
  groupType: GroupType;
  label: string;
  color: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  defaultWidth: number;
  defaultHeight: number;
}
