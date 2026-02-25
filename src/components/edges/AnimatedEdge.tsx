import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

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
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: '#94a3b8',
        strokeWidth: 2,
        strokeDasharray: '6 3',
        animation: 'dash-flow 1s linear infinite',
      }}
    />
  );
}
