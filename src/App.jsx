import React from 'react';
import { BotProvider, useBot } from './context/BotContext'; // Imported useBot here to use inside sub-component if needed, but structure requires wrapping.
import ConfigPanel from './components/ConfigPanel';
import ChatWindow from './components/ChatWindow';
import AvatarViewer from './components/AvatarViewer';

// Wrapper component to consume context
const MainLayout = () => {
  const { botConfig } = useBot();

  return (
    <div className="app-container">
      {/* Left: Configuration */}
      <div className="sidebar flex flex-col gap-4">
        <div style={{ flex: 1, minHeight: 0 }}>
          <ConfigPanel />
        </div>
      </div>

      {/* Right: Chat & 3D */}
      <div className="main-content flex flex-col gap-4">
        {/* Top: 3D Viewer (40% height) */}
        <div style={{ flex: '0 0 500px', minHeight: '300px' }}>
          <AvatarViewer
            modelUrl={botConfig.avatarUrl}
            color={botConfig.avatarColor}
            shape={botConfig.avatarShape}
          />
        </div>

        {/* Bottom: Chat (60% height) */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <ChatWindow />
        </div>

        {/* Mobile Placeholder */}
        <div className="md:hidden" style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
          {/* Toggle button */}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <BotProvider>
      <MainLayout />
    </BotProvider>
  );
}

export default App;
