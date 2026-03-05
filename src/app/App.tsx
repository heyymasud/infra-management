import { ReactFlowProvider } from '@xyflow/react';
import { Canvas, Sidebar } from '../features/diagram';

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="flex h-full w-full">
        <Sidebar />
        <Canvas />
      </div>
    </ReactFlowProvider>
  );
}
