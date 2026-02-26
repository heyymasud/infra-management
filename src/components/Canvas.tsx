import { useCallback, type DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InfraNode from './nodes/InfraNode';
import AnimatedEdge from './edges/AnimatedEdge';
import Toolbar from './Toolbar';
import { useFlowStore } from '../store/useFlowStore';
import type { InfraNodeType } from '../types';

// ── Node & Edge Type Maps ──────────────────────────────────────────────────
const nodeTypes = { infraNode: InfraNode };
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
    setSelectedNode,
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
      const nodeType = event.dataTransfer.getData('application/infranode') as InfraNodeType;
      if (!nodeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(nodeType, position);
    },
    [screenToFlowPosition, addNode],
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
  }, [setSelectedNode]);

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
    </div>
  );
}
