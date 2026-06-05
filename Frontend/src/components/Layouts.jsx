import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>💰 Expense Tracker</h2>
          <p>Trip Expense Management</p>
        </div>

        <nav>
          <Link to="/">Summary</Link>
          <Link to="/deposits">Deposits</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/members">Members</Link>
        </nav>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default Layout;