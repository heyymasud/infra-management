import { Pencil, Copy, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useContextMenu } from '../hooks/useContextMenu';

export default function ContextMenu() {
  const {
    contextMenu,
    menuRef,
    handleEdit,
    handleDuplicate,
    handleDelete
  } = useContextMenu();

  if (!contextMenu) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-90 min-w-[160px] p-1 bg-surface-glass-strong backdrop-blur-lg border border-border rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] animate-[ctx-in_0.15s_var(--ease-smooth)]"
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      <Button variant="menuItem" onClick={handleEdit}>
        <Pencil size={14} />
        <span>Edit</span>
      </Button>
      <Button variant="menuItem" onClick={handleDuplicate}>
        <Copy size={14} />
        <span>Duplicate</span>
      </Button>
      <div className="h-px mx-2 my-1 bg-border-light" />
      <Button variant="menuItemDanger" onClick={handleDelete}>
        <Trash2 size={14} />
        <span>Delete</span>
      </Button>
    </div>
  );
}
