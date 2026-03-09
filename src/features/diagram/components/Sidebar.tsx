import { type DragEvent } from 'react';

import {
  NODE_PALETTE,
  GROUP_PALETTE,
} from '../../infrastructure';
import type { InfraNodeType, GroupType } from '../../infrastructure/types';
import { DraggableItem } from './ui/DraggableItem';

// ── Sidebar Component ──────────────────────────────────────────────────────
export default function Sidebar() {
  const onDragStartNode = (event: DragEvent, nodeType: InfraNodeType) => {
    event.dataTransfer.setData('application/infranode', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragStartGroup = (event: DragEvent, groupType: GroupType) => {
    event.dataTransfer.setData('application/infragroup', groupType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-[280px] min-w-[280px] h-full flex flex-col overflow-y-auto z-10 bg-surface-glass backdrop-blur-[20px] border-r border-border">
      <div className="px-5 pt-6 pb-4 border-b border-border-light">
        <h2 className="text-lg font-bold tracking-tight text-text-primary">Components</h2>
        <p className="text-xs font-medium mt-1 text-text-muted">Drag to canvas</p>
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        {NODE_PALETTE.map((item) => {
          const Icon = item.icon;
          return (
            <DraggableItem
              key={item.type}
              label={item.label}
              description={item.description}
              icon={Icon}
              color={item.color}
              onDragStart={(e) => onDragStartNode(e, item.type)}
            />
          );
        })}
      </div>

      {/* Groups Section */}
      <div className="px-5 pb-4 border-b border-border-light mt-1 pt-4 border-t">
        <h2 className="text-lg font-bold tracking-tight text-text-primary">Groups</h2>
        <p className="text-xs font-medium mt-1 text-text-muted">Drag to canvas, then place nodes inside</p>
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        {GROUP_PALETTE.map((item) => {
          const Icon = item.icon;
          return (
            <DraggableItem
              key={item.groupType}
              label={item.label}
              description={item.description}
              icon={Icon}
              color={item.color}
              onDragStart={(e) => onDragStartGroup(e, item.groupType)}
            />
          );
        })}
      </div>
    </aside>
  );
}
