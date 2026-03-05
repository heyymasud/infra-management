import { type DragEvent } from 'react';
import { GripVertical } from 'lucide-react';
import type { InfraNodeType, GroupType } from '../types';
import { NODE_PALETTE, GROUP_PALETTE } from '../config';

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
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Components</h2>
        <p className="sidebar__subtitle">Drag to canvas</p>
      </div>

      <div className="sidebar__list">
        {NODE_PALETTE.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              className="sidebar__item"
              draggable
              onDragStart={(e) => onDragStartNode(e, item.type)}
              style={{
                '--item-color': item.color,
                '--item-color-light': `${item.color}12`,
                '--item-color-medium': `${item.color}25`,
              } as React.CSSProperties}
            >
              <GripVertical size={14} className="sidebar__grip" />
              <div className="sidebar__item-icon" style={{ backgroundColor: `${item.color}15` }}>
                <Icon size={18} color={item.color} />
              </div>
              <div className="sidebar__item-info">
                <span className="sidebar__item-label">{item.label}</span>
                <span className="sidebar__item-desc">{item.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Groups Section */}
      <div className="sidebar__header sidebar__header--section">
        <h2 className="sidebar__title">Groups</h2>
        <p className="sidebar__subtitle">Drag to canvas, then place nodes inside</p>
      </div>

      <div className="sidebar__list">
        {GROUP_PALETTE.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.groupType}
              className="sidebar__item"
              draggable
              onDragStart={(e) => onDragStartGroup(e, item.groupType)}
              style={{
                '--item-color': item.color,
                '--item-color-light': `${item.color}12`,
                '--item-color-medium': `${item.color}25`,
              } as React.CSSProperties}
            >
              <GripVertical size={14} className="sidebar__grip" />
              <div className="sidebar__item-icon" style={{ backgroundColor: `${item.color}15` }}>
                <Icon size={18} color={item.color} />
              </div>
              <div className="sidebar__item-info">
                <span className="sidebar__item-label">{item.label}</span>
                <span className="sidebar__item-desc">{item.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
