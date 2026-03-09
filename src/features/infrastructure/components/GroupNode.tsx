import { memo, useState, useCallback } from 'react';
import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { GroupNodeData } from '../types';
import { useFlowStore } from '../../diagram';

type GroupNodeInstance = Node<GroupNodeData, 'groupNode'>;

function GroupNodeComponent({ id, data, selected }: NodeProps<GroupNodeInstance>) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label);

  const color = data.color;

  const handleDoubleClick = useCallback(() => {
    setEditLabel(data.label);
    setIsEditing(true);
  }, [data.label]);

  const commitLabel = useCallback(() => {
    const trimmed = editLabel.trim();
    if (trimmed) {
      updateNodeData(id, { label: trimmed });
    }
    setIsEditing(false);
  }, [id, editLabel, updateNodeData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') commitLabel();
      if (e.key === 'Escape') setIsEditing(false);
    },
    [commitLabel],
  );

  return (
    <>
      <NodeResizer
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        lineClassName="!border-(--group-color)"
        handleClassName="!w-2 !h-2 !rounded-full !bg-surface !border-2 !border-(--group-color)"
        color={color}
      />
      <div className="w-full h-full min-w-[200px] min-h-[150px] bg-[color-mix(in_srgb,var(--group-color)_4%,var(--color-surface))] border-[1.5px] border-dashed border-[color-mix(in_srgb,var(--group-color)_30%,transparent)] rounded-xl overflow-visible" style={{ '--group-color': color } as React.CSSProperties}>
        <div className="flex items-center gap-2 py-2 px-3.5 border-b border-dashed border-[color-mix(in_srgb,var(--group-color)_15%,transparent)] cursor-default" onDoubleClick={handleDoubleClick}>
          <div
            className="px-2 py-0.5 text-[9px] font-bold tracking-[0.06em] uppercase rounded-full shrink-0"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {data.groupType === 'environment' ? 'ENV' : 'LAYER'}
          </div>
          {isEditing ? (
            <input
              className="px-1.5 py-0.5 text-[13px] font-semibold text-text-primary bg-surface border-[1.5px] border-accent rounded-sm outline-none w-[160px]"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span className="text-[13px] font-semibold text-text-primary cursor-default">{data.label}</span>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(GroupNodeComponent);
