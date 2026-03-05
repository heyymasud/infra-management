import { X } from 'lucide-react';
import { useNodeConfigForm } from '../hooks/useNodeConfigForm';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';

export default function NodeConfigModal() {
  const form = useNodeConfigForm();

  if (!form.editingNodeId || !form.data) return null;

  return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(15,23,42,0.35)] backdrop-blur-sm animate-[modal-bg-in_0.2s_ease]" onMouseDown={form.handleClose}>
      <form
        className="w-[420px] max-w-[92vw] bg-surface-glass-strong backdrop-blur-[20px] border border-border rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden animate-[modal-in_0.25s_var(--ease-smooth)]"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={form.handleSubmit}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-5 border-b border-border-light">
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight">Configure Node</h3>
          <IconButton variant="ghost" size="sm" type="button" onClick={form.handleClose}>
            <X size={18} />
          </IconButton>
        </div>

        {/* Body */}
        <div className="py-4 px-5 flex flex-col gap-3.5">
          <Input
            label="Label"
            value={form.label}
            onChange={(e) => form.setLabel(e.target.value)}
            placeholder="e.g. Web Server 01"
            autoFocus
          />
          <Input
            label="Hostname"
            value={form.hostname}
            onChange={(e) => form.setHostname(e.target.value)}
            placeholder="e.g. web-prod-01"
          />
          <Input
            label="IP Address"
            value={form.ipAddress}
            onChange={(e) => form.setIpAddress(e.target.value)}
            placeholder="e.g. 192.168.1.10"
          />
          <Select
            label="Environment"
            value={form.environment}
            onChange={(e) => form.setEnvironment(e.target.value)}
          >
            <option value="">— None —</option>
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </Select>
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
            placeholder="Brief description of this node…"
            rows={3}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 pt-3 pb-4 border-t border-border-light">
          <Button type="button" variant="ghost" onClick={form.handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
