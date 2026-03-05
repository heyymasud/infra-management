import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../store/useFlowStore';
import type { InfraNodeData } from '../types';

export default function NodeConfigModal() {
  const editingNodeId = useFlowStore((s) => s.editingNodeId);
  const nodes = useFlowStore((s) => s.nodes);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const setEditingNode = useFlowStore((s) => s.setEditingNode);

  const node = nodes.find((n) => n.id === editingNodeId);
  const data = node?.data as InfraNodeData | undefined;

  const [label, setLabel] = useState('');
  const [hostname, setHostname] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [environment, setEnvironment] = useState<string>('');
  const [description, setDescription] = useState('');

  // Sync form when modal opens
  useEffect(() => {
    if (data) {
      setLabel(data.label ?? '');
      setHostname(data.hostname ?? '');
      setIpAddress(data.ipAddress ?? '');
      setEnvironment(data.environment ?? '');
      setDescription(data.description ?? '');
    }
  }, [data]);

  const handleClose = useCallback(() => setEditingNode(null), [setEditingNode]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingNodeId) return;

      updateNodeData(editingNodeId, {
        label: label.trim() || 'Untitled',
        hostname: hostname.trim() || undefined,
        ipAddress: ipAddress.trim() || undefined,
        environment: (environment as InfraNodeData['environment']) || undefined,
        description: description.trim() || undefined,
      });
      handleClose();
    },
    [editingNodeId, label, hostname, ipAddress, environment, description, updateNodeData, handleClose],
  );

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (editingNodeId) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editingNodeId, handleClose]);

  if (!editingNodeId || !data) return null;

  return (
    <div className="modal-overlay" onMouseDown={handleClose}>
      <form
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="modal__header">
          <h3 className="modal__title">Configure Node</h3>
          <button type="button" className="modal__close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <div className="modal__field">
            <label className="modal__label">Label</label>
            <input
              className="modal__input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Web Server 01"
              autoFocus
            />
          </div>
          <div className="modal__field">
            <label className="modal__label">Hostname</label>
            <input
              className="modal__input"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              placeholder="e.g. web-prod-01"
            />
          </div>
          <div className="modal__field">
            <label className="modal__label">IP Address</label>
            <input
              className="modal__input"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="e.g. 192.168.1.10"
            />
          </div>
          <div className="modal__field">
            <label className="modal__label">Environment</label>
            <select
              className="modal__select"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            >
              <option value="">— None —</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
          <div className="modal__field">
            <label className="modal__label">Description</label>
            <textarea
              className="modal__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this node…"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal__footer">
          <button type="button" className="modal__btn modal__btn--ghost" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="modal__btn modal__btn--primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
