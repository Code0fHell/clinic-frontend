import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "200px",
          background: "#f0f0f0",
          padding: "1rem",
          borderRight: "1px solid #ddd",
        }}
      >
        <h3>🏥 Clinic System</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "1.5rem" }}>
        {/* Outlet sẽ render các route con */}
        <Outlet />
      </main>
    </div>
  );
}
