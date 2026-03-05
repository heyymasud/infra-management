import { useCallback, type DragEvent } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';
import { useFlowStore } from '../store/useFlowStore';
import type { InfraNodeType, GroupType } from '../../infrastructure/types';

export function useCanvasInteractions() {
  const {
    nodes,
    addGroup,
    addNode,
    setSelectedNode,
    closeContextMenu,
    setEditingNode,
    openContextMenu,
    setEditingEdge,
    assignNodeToGroup,
    removeNodeFromGroup,
  } = useFlowStore();

  const { screenToFlowPosition } = useReactFlow();

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

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: { id: string; type?: string }) => {
      // Skip group nodes — they handle their own label editing internally
      if (node.type === 'groupNode') return;
      setEditingNode(node.id);
    },
    [setEditingNode],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      openContextMenu({ nodeId: node.id, x: event.clientX, y: event.clientY });
    },
    [openContextMenu],
  );

  const onEdgeDoubleClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      setEditingEdge(edge.id);
    },
    [setEditingEdge],
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, draggedNode: Node) => {
      if (draggedNode.parentId) {
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

      const groupNodes = nodes.filter(
        (n) => n.type === 'groupNode' && n.id !== draggedNode.id,
      );

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

      groupBounds.sort((a, b) => a.area - b.area);

      const { x: nx, y: ny } = draggedNode.position;

      for (const { group, absX, absY, w, h } of groupBounds) {
        if (nx >= absX && nx <= absX + w && ny >= absY && ny <= absY + h) {
          const groupData = group.data as { groupType?: string };
          const draggedData = draggedNode.data as { groupType?: string };

          if (draggedNode.type === 'groupNode') {
            if (draggedData.groupType === 'layer' && groupData.groupType === 'environment') {
              assignNodeToGroup(draggedNode.id, group.id);
              break;
            }
          } else {
            assignNodeToGroup(draggedNode.id, group.id);
            break;
          }
        }
      }
    },
    [nodes, assignNodeToGroup, removeNodeFromGroup],
  );

  return {
    handlers: {
      onDragOver,
      onDrop,
      onNodeClick,
      onPaneClick,
      onNodeDoubleClick,
      onNodeContextMenu,
      onEdgeDoubleClick,
      onNodeDragStop,
    }
  };
}
