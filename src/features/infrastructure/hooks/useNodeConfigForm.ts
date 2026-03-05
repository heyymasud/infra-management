import { useState, useEffect, useCallback } from 'react';
import { useFlowStore } from '../../diagram';
import type { InfraNodeData } from '../types';

export function useNodeConfigForm() {
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

  return {
    editingNodeId,
    data,
    label,
    setLabel,
    hostname,
    setHostname,
    ipAddress,
    setIpAddress,
    environment,
    setEnvironment,
    description,
    setDescription,
    handleClose,
    handleSubmit
  };
}
