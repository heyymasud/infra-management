import { useCallback, type DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InfraNode from './nodes/InfraNode';
import GroupNode from './nodes/GroupNode';
import AnimatedEdge from './edges/AnimatedEdge';
import Toolbar from './Toolbar';
import NodeConfigModal from './NodeConfigModal';
import ContextMenu from './ContextMenu';
import { useFlowStore } from '../store/useFlowStore';
import type { InfraNodeType, GroupType } from '../types';

// ── Node & Edge Type Maps ──────────────────────────────────────────────────
const nodeTypes = { infraNode: InfraNode, groupNode: GroupNode };
const edgeTypes = { animatedEdge: AnimatedEdge };

export default function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    addNode,
    addGroup,
    setSelectedNode,
    setEditingNode,
    openContextMenu,
    closeContextMenu,
    setEditingEdge,
    assignNodeToGroup,
    removeNodeFromGroup,
  } = useFlowStore();

  const { screenToFlowPosition } = useReactFlow();

  // ── Drag & Drop Handlers ───────────────────────────────────────────────
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Check for group node drop first
      const groupType = event.dataTransfer.getData('application/infragroup') as GroupType;
      if (groupType) {
        addGroup(groupType, position);
        return;
      }

      // Infra node drop
      const nodeType = event.dataTransfer.getData('application/infranode') as InfraNodeType;
      if (nodeType) {
        addNode(nodeType, position);
      }
    },
    [screenToFlowPosition, addNode, addGroup],
  );

  // ── Node Selection ─────────────────────────────────────────────────────
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    closeContextMenu();
  }, [setSelectedNode, closeContextMenu]);

  // ── Double Click → Edit (only for infra nodes) ─────────────────────────
  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: { id: string; type?: string }) => {
      // Skip group nodes — they handle their own label editing internally
      if (node.type === 'groupNode') return;
      setEditingNode(node.id);
    },
    [setEditingNode],
  );

  // ── Right Click → Context Menu ─────────────────────────────────────────
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      openContextMenu({ nodeId: node.id, x: event.clientX, y: event.clientY });
    },
    [openContextMenu],
  );

  // ── Edge Double Click → Label Edit ─────────────────────────────────────
  const onEdgeDoubleClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      setEditingEdge(edge.id);
    },
    [setEditingEdge],
  );

  // ── Node Drag Stop → Auto-assign to group ──────────────────────────────
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, draggedNode: Node) => {
      // Don't try to assign a group node into another group (only single-level nesting for now)
      // But allow: infra nodes → group nodes, layer groups → environment groups
      if (draggedNode.parentId) {
        // Already has a parent — check if still inside
        const parent = nodes.find((n) => n.id === draggedNode.parentId);
        if (parent) {
          const pw = (parent.measured?.width ?? parent.width ?? parent.style?.width ?? 0) as number;
          const ph = (parent.measured?.height ?? parent.height ?? parent.style?.height ?? 0) as number;
          const { x, y } = draggedNode.position; // relative to parent
          if (x < -20 || y < -20 || x > pw + 20 || y > ph + 20) {
            removeNodeFromGroup(draggedNode.id);
          }
        }
        return;
      }

      // Find all group nodes and compute their absolute bounds
      const groupNodes = nodes.filter(
        (n) => n.type === 'groupNode' && n.id !== draggedNode.id,
      );

      // Build absolute positions for each group (groups can be nested)
      const groupBounds = groupNodes.map((group) => {
        let absX = group.position.x;
        let absY = group.position.y;
        let pid = group.parentId;
        while (pid) {
          const p = nodes.find((n) => n.id === pid);
          if (!p) break;
          absX += p.position.x;
          absY += p.position.y;
          pid = p.parentId;
        }
        const w = (group.measured?.width ?? group.width ?? group.style?.width ?? 0) as number;
        const h = (group.measured?.height ?? group.height ?? group.style?.height ?? 0) as number;
        return { group, absX, absY, w, h, area: w * h };
      });

      // Sort by area ascending → smallest (innermost) groups first
      groupBounds.sort((a, b) => a.area - b.area);

      const { x: nx, y: ny } = draggedNode.position;

      for (const { group, absX, absY, w, h } of groupBounds) {
        if (nx >= absX && nx <= absX + w && ny >= absY && ny <= absY + h) {
          const groupData = group.data as { groupType?: string };
          const draggedData = draggedNode.data as { groupType?: string };

          if (draggedNode.type === 'groupNode') {
            // Only allow layer → environment
            if (draggedData.groupType === 'layer' && groupData.groupType === 'environment') {
              assignNodeToGroup(draggedNode.id, group.id);
              break;
            }
          } else {
            // Infra node → any group
            assignNodeToGroup(draggedNode.id, group.id);
            break;
          }
        }
      }
    },
    [nodes, assignNodeToGroup, removeNodeFromGroup],
  );

  return (
    <div className="canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onNodeDragStop={onNodeDragStop}
        isValidConnection={(edge) =>
          isValidConnection({
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle ?? null,
            targetHandle: edge.targetHandle ?? null,
          })
        }
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={[16, 16]}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--color-canvas-dot)" />
        <Controls className="flow-controls" />
        <MiniMap
          nodeColor={() => 'var(--color-edge)'}
          maskColor="color-mix(in srgb, var(--color-border-light) 70%, transparent)"
          className="flow-minimap"
        />
      </ReactFlow>

      <Toolbar />
      <NodeConfigModal />
      <ContextMenu />
    </div>
  );
}
