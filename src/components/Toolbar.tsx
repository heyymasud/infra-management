import { useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Upload,
  Trash2,
} from 'lucide-react';
import { useFlowStore } from '../store/useFlowStore';

export default function Toolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const exportToJSON = useFlowStore((s) => s.exportToJSON);
  const importFromJSON = useFlowStore((s) => s.importFromJSON);
  const clearCanvas = useFlowStore((s) => s.clearCanvas);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infrastructure-diagram.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importFromJSON(content);
    };
    reader.readAsText(file);

    // Reset so the same file can be re-imported
    e.target.value = '';
  };

  return (
    <div className="toolbar">
      <button className="toolbar__btn" onClick={() => zoomIn()} title="Zoom In">
        <ZoomIn size={18} />
      </button>
      <button className="toolbar__btn" onClick={() => zoomOut()} title="Zoom Out">
        <ZoomOut size={18} />
      </button>
      <button className="toolbar__btn" onClick={() => fitView({ padding: 0.2 })} title="Fit View">
        <Maximize size={18} />
      </button>

      <div className="toolbar__divider" />

      <button className="toolbar__btn" onClick={handleExport} title="Export JSON">
        <Download size={18} />
      </button>
      <button className="toolbar__btn" onClick={handleImport} title="Import JSON">
        <Upload size={18} />
      </button>

      <div className="toolbar__divider" />

      <button className="toolbar__btn toolbar__btn--danger" onClick={clearCanvas} title="Clear Canvas">
        <Trash2 size={18} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
