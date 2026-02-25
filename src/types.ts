import type { Node, Edge, Connection } from '@xyflow/react';

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

// ── Connection Validation Rules ────────────────────────────────────────────
// Maps source node type → allowed target node types
export const CONNECTION_RULES: Record<InfraNodeType, InfraNodeType[]> = {
  loadBalancer: ['webServer', 'appServer'],
  webServer: ['appServer', 'cache', 'messageQueue'],
  appServer: ['database', 'cache', 'messageQueue', 'appServer'],
  database: ['cache'],
  firewall: ['loadBalancer', 'webServer', 'appServer', 'database', 'cloud', 'cache', 'messageQueue'],
  cloud: ['loadBalancer', 'webServer', 'appServer', 'database', 'firewall', 'cache', 'messageQueue'],
  cache: ['appServer', 'webServer'],
  messageQueue: ['appServer', 'webServer'],
};

// ── Node Palette Config ────────────────────────────────────────────────────
export interface NodePaletteItem {
  type: InfraNodeType;
  label: string;
  color: string;
  description: string;
}

export const NODE_PALETTE: NodePaletteItem[] = [
  { type: 'loadBalancer', label: 'Load Balancer', color: '#8b5cf6', description: 'Distributes incoming traffic' },
  { type: 'firewall', label: 'Firewall', color: '#ef4444', description: 'Network security barrier' },
  { type: 'webServer', label: 'Web Server', color: '#3b82f6', description: 'Serves web content' },
  { type: 'appServer', label: 'App Server', color: '#10b981', description: 'Application logic layer' },
  { type: 'database', label: 'Database', color: '#f59e0b', description: 'Data persistence layer' },
  { type: 'cache', label: 'Cache', color: '#06b6d4', description: 'In-memory data cache' },
  { type: 'messageQueue', label: 'Message Queue', color: '#ec4899', description: 'Async message broker' },
  { type: 'cloud', label: 'Cloud Service', color: '#6366f1', description: 'Cloud provider service' },
];

// ── Helpers ────────────────────────────────────────────────────────────────
export function isValidInfraConnection(
  connection: Connection,
  nodes: InfraNode[],
): boolean {
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  // Prevent self-connections
  if (connection.source === connection.target) return false;

  const sourceType = sourceNode.data.type;
  const targetType = targetNode.data.type;

  const allowedTargets = CONNECTION_RULES[sourceType];
  return allowedTargets.includes(targetType);
}
