import { memo, useState, useCallback } from 'react';
import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { GroupNodeData } from '../../types';
import { useFlowStore } from '../../store/useFlowStore';

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
        lineClassName="group-node__resizer-line"
        handleClassName="group-node__resizer-handle"
        color={color}
      />
      <div className="group-node" style={{ '--group-color': color } as React.CSSProperties}>
        <div className="group-node__header" onDoubleClick={handleDoubleClick}>
          <div
            className="group-node__badge"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {data.groupType === 'environment' ? 'ENV' : 'LAYER'}
          </div>
          {isEditing ? (
            <input
              className="group-node__label-input"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={commitLabel}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span className="group-node__label">{data.label}</span>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(GroupNodeComponent);
