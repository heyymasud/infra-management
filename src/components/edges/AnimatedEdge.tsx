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
          className="absolute flex items-center justify-center z-9999"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              className="w-[100px] px-2 py-0.5 text-[11px] font-medium text-text-body bg-surface border-[1.5px] border-accent rounded-full outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.12)] text-center"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={handleKeyDown}
              placeholder="Label…"
              autoFocus
            />
          ) : edgeData?.label ? (
            <span className="px-2 py-0.5 text-[10.5px] font-semibold text-text-secondary bg-surface-glass-strong border border-border rounded-full whitespace-nowrap cursor-pointer select-none transition-all duration-150 hover:border-accent hover:text-accent">{edgeData.label}</span>
          ) : (
            <span className="edge-label-empty w-[22px] h-[22px] p-0 flex items-center justify-center text-[13px] text-text-muted opacity-0 transition-opacity duration-200 hover:opacity-100 cursor-pointer">+</span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
