import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomBar } from './components/layout/BottomBar';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Agents } from './pages/Agents';
import { Memory } from './pages/Memory';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Tools } from './pages/Tools';
import { Projects } from './pages/Projects';
import { Settings } from './pages/Settings';
import { ModelManager } from './pages/ModelManager';
import { Console } from './pages/Console';
import { Analytics } from './pages/Analytics';
import { Marketplace } from './pages/Marketplace';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('swift_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('swift_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Top Bar */}
        <TopBar onMenuClick={() => setSidebarOpen(o => !o)} theme={theme} toggleTheme={toggleTheme} />

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          {sidebarOpen && <Sidebar />}

          {/* Main */}
          <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflow: 'auto' }} className="scrollable">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/memory" element={<Memory />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/models" element={<ModelManager />} />
                <Route path="/console" element={<Console />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/marketplace" element={<Marketplace />} />
              </Routes>
            </div>
            <BottomBar />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}