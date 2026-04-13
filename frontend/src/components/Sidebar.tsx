import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../stylesheet/sidebar.css";
import {  House, ScrollText, FolderRoot } from "lucide-react"
import Card from "../pages/Card";
const navLinks = [
  {
    section: "Main",
    items: [
      { path: "/app/card", label: "Home", icon: <House /> },
      { path: "/app/preview", label: "Store", icon: <ScrollText /> },
      {path: "/app/project",label:"project",icon:<FolderRoot />}
    ],
  },
];



export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* Header with brand + toggle */}
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-dot" />
          <span className="brand-name">MyApp</span>
        </div>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={2} strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {navLinks.map(({ section, items }) => (
          <div key={section}>
            <span className="nav-section-label">{section}</span>
            {items.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                {icon}
                <span className="nav-label">{label}</span>
                {collapsed && <span className="tooltip">{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
    {/* {props.children} */}
    {/* <Card/> */}
    </>
  );
}