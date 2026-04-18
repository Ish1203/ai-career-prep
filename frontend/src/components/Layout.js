import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', icon: '⚡', label: 'Home', exact: true },
  { to: '/interview', icon: '🎤', label: 'Interview Coach' },
  { to: '/resume', icon: '📄', label: 'Resume Analyser' },
  { to: '/exam', icon: '📚', label: 'Exam Prep' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: 8,
        transition: 'width 0.25s ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 8px 24px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
            boxShadow: '0 0 20px var(--accent-glow)',
          }}>🚀</div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, lineHeight: 1 }}>CareerAI</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>Prep Platform</div>
            </div>
          )}
        </div>

        {/* Nav links */}
        {NAV.map(({ to, icon, label, exact }) => {
          const isActive = exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/';
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                textDecoration: 'none', transition: 'var(--transition)',
                background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                border: active ? '1px solid rgba(108,99,255,0.25)' : '1px solid transparent',
                fontFamily: 'var(--font-display)',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}

        {/* Collapse toggle */}
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', padding: '10px 12px' }}
          >
            <span style={{ fontSize: 16 }}>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span style={{ fontSize: 13 }}>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
