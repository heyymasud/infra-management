import { useRef } from 'react';
import { useFlowStore } from '../store/useFlowStore';

export function useFlowImportExport() {
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

  const handleImportClick = () => {
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

  return {
    handleExport,
    handleImportClick,
    handleFileChange,
    clearCanvas,
    fileInputRef,
  };
}
