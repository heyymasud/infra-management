import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import {
  isValidInfraConnection,
  NODE_PALETTE,
  GROUP_PALETTE,
} from '../../infrastructure';
import type {
  InfraNode,
  InfraEdge,
  InfraNodeType,
  InfraNodeData,
  GroupType,
  InfraGroupNode,
} from '../../infrastructure/types';

// Context Menu State
interface ContextMenuState {
  nodeId: string;
  x: number;
  y: number;
}

// Any Canvas Node (infra or group)
type CanvasNode = InfraNode | InfraGroupNode;

// Store Interface
interface FlowState {
  nodes: CanvasNode[];
  edges: InfraEdge[];
  selectedNodeId: string | null;

  // UI state
  editingNodeId: string | null;
  contextMenu: ContextMenuState | null;
  editingEdgeId: string | null;

  // React Flow handlers
  onNodesChange: (changes: NodeChange<CanvasNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node CRUD
  addNode: (type: InfraNodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<InfraNodeData>) => void;
  duplicateNode: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (id: string | null) => void;

  // Node config modal
  setEditingNode: (id: string | null) => void;

  // Context menu
  openContextMenu: (state: ContextMenuState) => void;
  closeContextMenu: () => void;

  // Edge actions
  updateEdgeLabel: (edgeId: string, label: string) => void;
  setEditingEdge: (id: string | null) => void;

  // Group actions
  addGroup: (groupType: GroupType, position: { x: number; y: number }) => void;
  assignNodeToGroup: (nodeId: string, groupId: string) => void;
  removeNodeFromGroup: (nodeId: string) => void;

  // Validation
  isValidConnection: (connection: Connection) => boolean;

  // Export / Import
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  clearCanvas: () => void;
}

// ID Generator
let idCounter = 0;
const generateId = (prefix: string) => `${prefix}_${Date.now()}_${idCounter++}`;

// Node Reordering Helper (parents must come before children)
function reorderNodes(nodes: CanvasNode[]): CanvasNode[] {
  const ordered: CanvasNode[] = [];
  const remaining = [...nodes];
  const placed = new Set<string>();

  // First pass: place all root nodes (no parentId)
  for (let i = remaining.length - 1; i >= 0; i--) {
    if (!remaining[i].parentId) {
      ordered.push(remaining[i]);
      placed.add(remaining[i].id);
      remaining.splice(i, 1);
    }
  }

  // Multi-pass: keep placing nodes whose parent is already placed
  let safety = 0;
  while (remaining.length > 0 && safety < 10) {
    for (let i = remaining.length - 1; i >= 0; i--) {
      if (remaining[i].parentId && placed.has(remaining[i].parentId!)) {
        ordered.push(remaining[i]);
        placed.add(remaining[i].id);
        remaining.splice(i, 1);
      }
    }
    safety++;
  }

  // Any leftovers (orphaned nodes) go at the end
  ordered.push(...remaining);
  return ordered;
}

// Store
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  editingNodeId: null,
  contextMenu: null,
  editingEdgeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    const { nodes, edges } = get();
    // Only validate connections between infra nodes
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (sourceNode?.type === 'infraNode' && targetNode?.type === 'infraNode') {
      if (!isValidInfraConnection(connection, nodes as InfraNode[])) return;
    }

    const newEdge: InfraEdge = {
      ...connection,
      id: generateId('edge'),
      type: 'animatedEdge',
      animated: true,
      source: connection.source!,
      target: connection.target!,
      data: {},
    };

    set({ edges: addEdge(newEdge, edges) });
  },

  // Node CRUD
  addNode: (type, position) => {
    const paletteItem = NODE_PALETTE.find((p) => p.type === type);
    if (!paletteItem) return;

    const newNode: InfraNode = {
      id: generateId('node'),
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

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? ({ ...n, data: { ...n.data, ...data } } as CanvasNode)
          : n,
      ),
    });
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const newNode: CanvasNode = {
      ...node,
      id: generateId(node.type === 'groupNode' ? 'group' : 'node'),
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      selected: false,
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  deleteNode: (nodeId) => {
    const { nodes, edges } = get();
    set({
      nodes: nodes
        .filter((n) => n.id !== nodeId)
        // Also unparent any children of the deleted node
        .map((n) => (n.parentId === nodeId ? { ...n, parentId: undefined, extent: undefined } : n)),
      edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: null,
      contextMenu: null,
    });
  },

  removeSelectedNode: () => {
    const { selectedNodeId } = get();
    if (selectedNodeId) get().deleteNode(selectedNodeId);
  },

  setSelectedNode: (id) => {
    set({ selectedNodeId: id });
  },

  // Node Config Modal
  setEditingNode: (id) => {
    set({ editingNodeId: id, contextMenu: null });
  },

  // Context Menu
  openContextMenu: (state) => {
    set({ contextMenu: state });
  },

  closeContextMenu: () => {
    set({ contextMenu: null });
  },

  // Edge Actions
  updateEdgeLabel: (edgeId, label) => {
    set({
      edges: get().edges.map((e) =>
        e.id === edgeId ? { ...e, data: { ...e.data, label } } : e,
      ),
      editingEdgeId: null,
    });
  },

  setEditingEdge: (id) => {
    set({ editingEdgeId: id });
  },

  // Group Actions
  addGroup: (groupType, position) => {
    const palette = GROUP_PALETTE.find((g) => g.groupType === groupType);
    if (!palette) return;

    const newGroup: InfraGroupNode = {
      id: generateId('group'),
      type: 'groupNode',
      position,
      style: { width: palette.defaultWidth, height: palette.defaultHeight },
      data: {
        label: palette.label,
        groupType,
        color: palette.color,
      },
    };

    // Groups must come before child nodes — reorder after adding
    set({ nodes: reorderNodes([newGroup, ...get().nodes]) });
  },

  assignNodeToGroup: (nodeId, groupId) => {
    const allNodes = get().nodes;
    const group = allNodes.find((n) => n.id === groupId);
    if (!group) return;

    // Compute absolute position of the target group by walking up parent chain
    let groupAbsX = group.position.x;
    let groupAbsY = group.position.y;
    let currentParentId = group.parentId;
    while (currentParentId) {
      const parentNode = allNodes.find((n) => n.id === currentParentId);
      if (!parentNode) break;
      groupAbsX += parentNode.position.x;
      groupAbsY += parentNode.position.y;
      currentParentId = parentNode.parentId;
    }

    const updatedNodes = allNodes.map((n) => {
      if (n.id !== nodeId) return n;

      // Compute absolute position of the dragged node
      let nodeAbsX = n.position.x;
      let nodeAbsY = n.position.y;
      let nParentId = n.parentId;
      while (nParentId) {
        const parentNode = allNodes.find((p) => p.id === nParentId);
        if (!parentNode) break;
        nodeAbsX += parentNode.position.x;
        nodeAbsY += parentNode.position.y;
        nParentId = parentNode.parentId;
      }

      return {
        ...n,
        parentId: groupId,
        extent: 'parent' as const,
        position: {
          x: nodeAbsX - groupAbsX,
          y: nodeAbsY - groupAbsY,
        },
      };
    });

    // Reorder so parents always come before children
    set({ nodes: reorderNodes(updatedNodes) });
  },

  removeNodeFromGroup: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node || !node.parentId) return;

    const parent = get().nodes.find((n) => n.id === node.parentId);
    set({
      nodes: get().nodes.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          parentId: undefined,
          extent: undefined,
          position: parent
            ? { x: n.position.x + parent.position.x, y: n.position.y + parent.position.y }
            : n.position,
        };
      }),
    });
  },

  // Validation
  isValidConnection: (connection) => {
    return isValidInfraConnection(connection, get().nodes as InfraNode[]);
  },

  // Export / Import
  exportToJSON: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ version: '1.0', nodes, edges }, null, 2);
  },

  importFromJSON: (json) => {
    try {
      const data = JSON.parse(json) as { version?: string; nodes: CanvasNode[]; edges: InfraEdge[] };
      if (data.nodes && data.edges) {
        set({ nodes: data.nodes, edges: data.edges, selectedNodeId: null });
      }
    } catch (e) {
      console.error('Failed to import JSON:', e);
    }
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null, editingNodeId: null, contextMenu: null, editingEdgeId: null });
  },
}));
