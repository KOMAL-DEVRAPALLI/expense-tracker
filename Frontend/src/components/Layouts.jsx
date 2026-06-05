function Layout({ children }) {
  return (
    <div className="layout">

      <aside className="sidebar">
        <div className="logo">
          <h2>💰 Expense Tracker</h2>
          <p>Trip Expense Management</p>
        </div>

        <nav>
          <a href="/">Summary</a>
          <a href="/deposits">Deposits</a>
          <a href="/expenses">Expenses</a>
          <a href="/members">Members</a>
        </nav>
      </aside>

      <main className="content">
        {children}
      </main>

    </div>
  );
}

export default Layout;