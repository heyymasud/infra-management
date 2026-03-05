import { type DragEvent } from 'react';
import { GripVertical } from 'lucide-react';

interface DraggableItemProps {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onDragStart: (e: DragEvent) => void;
}

export function DraggableItem({ label, description, icon: Icon, color, onDragStart }: DraggableItemProps) {
  return (
    <div
      className="group flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-grab select-none border border-transparent transition-all duration-200 hover:bg-(--item-color-light) hover:border-(--item-color-medium) hover:translate-x-1 hover:shadow-md active:cursor-grabbing active:scale-[0.97]"
      draggable
      onDragStart={onDragStart}
      style={{
        '--item-color': color,
        '--item-color-light': `${color}12`,
        '--item-color-medium': `${color}25`,
      } as React.CSSProperties}
    >
      <GripVertical size={14} className="shrink-0 text-handle-border transition-colors duration-200 group-hover:text-(--item-color)" />
      <div className="w-9 h-9 flex items-center justify-center shrink-0 rounded-md transition-transform duration-200 group-hover:scale-105" style={{ backgroundColor: `${color}15` }}>
        <Icon size={18} color={color} />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[13px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-text-body">{label}</span>
        <span className="text-[11px] font-normal whitespace-nowrap overflow-hidden text-ellipsis text-text-muted">{description}</span>
      </div>
    </div>
  );
}
