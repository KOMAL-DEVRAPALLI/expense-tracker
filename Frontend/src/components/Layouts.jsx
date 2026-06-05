import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Expense Tracker</h1>

      <nav
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
      </nav>

      {children}
    </div>
  );
}

export default Layout;