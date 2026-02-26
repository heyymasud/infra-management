import type { Connection } from '@xyflow/react';
import type { InfraNode } from './types';
import { CONNECTION_RULES } from './config';

// ── Connection Validation ──────────────────────────────────────────────────
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
  // return allowedTargets.includes(targetType);
  return true;
}
