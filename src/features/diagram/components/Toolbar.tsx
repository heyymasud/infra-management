import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, Download, Upload, Trash2 } from 'lucide-react';
import { useFlowImportExport } from '../hooks/useFlowImportExport';
import { IconButton } from '../../../shared/ui';

export default function Toolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { handleExport, handleImportClick, handleFileChange, clearCanvas, fileInputRef } = useFlowImportExport();



  return (
    <div className="absolute top-4 right-4 flex items-center gap-1 p-1.5 z-10 bg-surface-glass-strong backdrop-blur-lg border border-border rounded-xl shadow-xl">
      <IconButton variant="standard" onClick={() => zoomIn()} title="Zoom In">
        <ZoomIn size={18} />
      </IconButton>
      <IconButton variant="standard" onClick={() => zoomOut()} title="Zoom Out">
        <ZoomOut size={18} />
      </IconButton>
      <IconButton variant="standard" onClick={() => fitView({ padding: 0.2 })} title="Fit View">
        <Maximize size={18} />
      </IconButton>

      <div className="w-px h-6 mx-1 bg-border" />

      <IconButton variant="action" onClick={handleExport} title="Export JSON">
        <Download size={18} />
      </IconButton>
      <IconButton variant="action" onClick={handleImportClick} title="Import JSON">
        <Upload size={18} />
      </IconButton>

      <div className="w-px h-6 mx-1 bg-border" />

      <IconButton variant="danger" onClick={clearCanvas} title="Clear Canvas">
        <Trash2 size={18} />
      </IconButton>

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
