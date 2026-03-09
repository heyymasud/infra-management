
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  InfraNode,
  GroupNode,
  AnimatedEdge,
  NodeConfigModal,
  ContextMenu,
} from '../../infrastructure';
import Toolbar from './Toolbar';
import { useFlowStore } from '../store/useFlowStore';
import { useCanvasInteractions } from '../hooks/useCanvasInteractions';

// ── Node & Edge Type Maps ──────────────────────────────────────────────────
const nodeTypes = { infraNode: InfraNode, groupNode: GroupNode };
const edgeTypes = { animatedEdge: AnimatedEdge };

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, isValidConnection } = useFlowStore();
  const { handlers } = useCanvasInteractions();

  return (
    <div className="flex-1 h-full relative bg-canvas-bg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={handlers.onDrop}
        onDragOver={handlers.onDragOver}
        onNodeClick={handlers.onNodeClick}
        onPaneClick={handlers.onPaneClick}
        onNodeDoubleClick={handlers.onNodeDoubleClick}
        onNodeContextMenu={handlers.onNodeContextMenu}
        onEdgeDoubleClick={handlers.onEdgeDoubleClick}
        onNodeDragStop={handlers.onNodeDragStop}
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
        <Controls className="overflow-hidden rounded-lg! border! border-border! shadow-md! [&_button]:bg-surface-glass-strong! [&_button]:border-b! [&_button]:border-border-light! [&_button]:text-text-secondary! [&_button]:w-8! [&_button]:h-8! hover:[&_button]:bg-hover-bg! hover:[&_button]:text-text-body! [&_button_svg]:fill-current!" />
        <MiniMap
          nodeColor={() => 'var(--color-edge)'}
          maskColor="color-mix(in srgb, var(--color-border-light) 70%, transparent)"
          className="overflow-hidden rounded-lg! border! border-border! shadow-md! bg-surface-glass-strong!"
        />
      </ReactFlow>

      <Toolbar />
      <NodeConfigModal />
      <ContextMenu />
    </div>
  );
}
