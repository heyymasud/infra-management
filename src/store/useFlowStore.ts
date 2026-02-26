import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import type { InfraNode, InfraEdge, InfraNodeType } from '../types';
import { isValidInfraConnection } from '../validation';
import { NODE_PALETTE } from '../config';

// ── Store Interface ────────────────────────────────────────────────────────
interface FlowState {
  nodes: InfraNode[];
  edges: InfraEdge[];
  selectedNodeId: string | null;

  // React Flow handlers
  onNodesChange: (changes: NodeChange<InfraNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node CRUD
  addNode: (type: InfraNodeType, position: { x: number; y: number }) => void;
  removeSelectedNode: () => void;
  setSelectedNode: (id: string | null) => void;

  // Validation
  isValidConnection: (connection: Connection) => boolean;

  // Export / Import
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  clearCanvas: () => void;
}

// ── ID Generator ───────────────────────────────────────────────────────────
let nodeIdCounter = 0;
const generateNodeId = () => `node_${Date.now()}_${nodeIdCounter++}`;

// ── Store ──────────────────────────────────────────────────────────────────
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const { nodes, edges } = get();
    if (!isValidInfraConnection(connection, nodes)) return;

    const newEdge: InfraEdge = {
      ...connection,
      id: `edge_${connection.source}_${connection.target}_${Date.now()}`,
      type: 'animatedEdge',
      animated: true,
      source: connection.source!,
      target: connection.target!,
    };

    set({ edges: addEdge(newEdge, edges) });
  },

  addNode: (type, position) => {
    const paletteItem = NODE_PALETTE.find((p) => p.type === type);
    if (!paletteItem) return;

    const newNode: InfraNode = {
      id: generateNodeId(),
      type: 'infraNode',
      position,
      data: {
        label: paletteItem.label,
        type,
        description: paletteItem.description,
      },
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  removeSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;

    set({
      nodes: nodes.filter((n) => n.id !== selectedNodeId),
      edges: edges.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
      ),
      selectedNodeId: null,
    });
  },

  setSelectedNode: (id) => {
    set({ selectedNodeId: id });
  },

  isValidConnection: (connection) => {
    return isValidInfraConnection(connection, get().nodes);
  },

  exportToJSON: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importFromJSON: (json) => {
    try {
      const data = JSON.parse(json) as { nodes: InfraNode[]; edges: InfraEdge[] };
      if (data.nodes && data.edges) {
        set({ nodes: data.nodes, edges: data.edges, selectedNodeId: null });
      }
    } catch (e) {
      console.error('Failed to import JSON:', e);
    }
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
  },
}));
