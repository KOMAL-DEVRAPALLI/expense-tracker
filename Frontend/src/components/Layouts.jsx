import { Link, NavLink } from "react-router-dom";
function Layout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
  <h2>💰 Expense Tracker</h2>
  <span>Trip Expense Management</span>
</div>

        <nav>
        <NavLink to="/">Summary</NavLink>
        <NavLink to="/expenses">Expenses</NavLink>
        <NavLink to ="/membersDeposits">Members and Deposits</NavLink>
        </nav>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default Layout;