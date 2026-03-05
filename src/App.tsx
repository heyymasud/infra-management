import { ReactFlowProvider } from '@xyflow/react';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';

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
