import { useEffect, useRef, useCallback } from 'react';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { useFlowStore } from '../store/useFlowStore';

export default function ContextMenu() {
  const contextMenu = useFlowStore((s) => s.contextMenu);
  const closeContextMenu = useFlowStore((s) => s.closeContextMenu);
  const setEditingNode = useFlowStore((s) => s.setEditingNode);
  const duplicateNode = useFlowStore((s) => s.duplicateNode);
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleEdit = useCallback(() => {
    if (contextMenu) setEditingNode(contextMenu.nodeId);
  }, [contextMenu, setEditingNode]);

  const handleDuplicate = useCallback(() => {
    if (contextMenu) {
      duplicateNode(contextMenu.nodeId);
      closeContextMenu();
    }
  }, [contextMenu, duplicateNode, closeContextMenu]);

  const handleDelete = useCallback(() => {
    if (contextMenu) {
      deleteNode(contextMenu.nodeId);
    }
  }, [contextMenu, deleteNode]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu();
    };
    if (contextMenu) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [contextMenu, closeContextMenu]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };
    if (contextMenu) {
      // Delay to avoid closing immediately from the context menu trigger
      requestAnimationFrame(() => window.addEventListener('mousedown', onClick));
    }
    return () => window.removeEventListener('mousedown', onClick);
  }, [contextMenu, closeContextMenu]);

  if (!contextMenu) return null;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      <button className="context-menu__item" onClick={handleEdit}>
        <Pencil size={14} />
        <span>Edit</span>
      </button>
      <button className="context-menu__item" onClick={handleDuplicate}>
        <Copy size={14} />
        <span>Duplicate</span>
      </button>
      <div className="context-menu__divider" />
      <button className="context-menu__item context-menu__item--danger" onClick={handleDelete}>
        <Trash2 size={14} />
        <span>Delete</span>
      </button>
    </div>
  );
}
