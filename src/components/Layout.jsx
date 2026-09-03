import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">Genius</div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/campaigns">Campañas</NavLink>
          <NavLink to="/landings">Landings</NavLink>
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">Genius Agency — Panel interno</header>
        <Outlet />
      </div>
    </div>
  )
}
