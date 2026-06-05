import { Link, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout">

      <aside className="sidebar">
        <h2>Expense Tracker</h2>

        <nav>
          <Link to="/summary">Summary</Link>
          <Link to="/deposits">Deposits</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/members">Members</Link>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;