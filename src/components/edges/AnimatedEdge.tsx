import { useState, useCallback } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { useFlowStore } from '../../store/useFlowStore';
import type { InfraEdgeData } from '../../types';

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const edgeData = data as InfraEdgeData | undefined;
  const updateEdgeLabel = useFlowStore((s) => s.updateEdgeLabel);
  const editingEdgeId = useFlowStore((s) => s.editingEdgeId);
  const setEditingEdge = useFlowStore((s) => s.setEditingEdge);

  const isEditing = editingEdgeId === id;
  const [draft, setDraft] = useState(edgeData?.label ?? '');

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDoubleClick = useCallback(() => {
    setDraft(edgeData?.label ?? '');
    setEditingEdge(id);
  }, [edgeData?.label, id, setEditingEdge]);

  const commitLabel = useCallback(() => {
    updateEdgeLabel(id, draft.trim());
  }, [id, draft, updateEdgeLabel]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') commitLabel();
      if (e.key === 'Escape') setEditingEdge(null);
    },
    [commitLabel, setEditingEdge],
  );

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: 'var(--color-edge)',
          strokeWidth: 2,
          strokeDasharray: '6 3',
          animation: 'dash-flow 1s linear infinite',
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="edge-label-wrapper"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              className="edge-label-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={handleKeyDown}
              placeholder="Label…"
              autoFocus
            />
          ) : edgeData?.label ? (
            <span className="edge-label">{edgeData.label}</span>
          ) : (
            <span className="edge-label edge-label--empty">+</span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
