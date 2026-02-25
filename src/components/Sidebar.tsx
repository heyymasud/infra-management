import { type DragEvent } from 'react';
import {
  Globe,
  Server,
  Database,
  Shield,
  Cloud,
  MemoryStick,
  MessageSquare,
  Network,
  GripVertical,
  type LucideProps,
} from 'lucide-react';
import type { InfraNodeType } from '../types';
import { NODE_PALETTE } from '../types';

// ── Icon Map ───────────────────────────────────────────────────────────────
const ICON_MAP: Record<InfraNodeType, React.ComponentType<LucideProps>> = {
  webServer: Globe,
  appServer: Server,
  database: Database,
  loadBalancer: Network,
  firewall: Shield,
  cloud: Cloud,
  cache: MemoryStick,
  messageQueue: MessageSquare,
};

// ── Sidebar Component ──────────────────────────────────────────────────────
export default function Sidebar() {
  const onDragStart = (event: DragEvent, nodeType: InfraNodeType) => {
    event.dataTransfer.setData('application/infranode', nodeType);
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
          const Icon = ICON_MAP[item.type];
          return (
            <div
              key={item.type}
              className="sidebar__item"
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
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
