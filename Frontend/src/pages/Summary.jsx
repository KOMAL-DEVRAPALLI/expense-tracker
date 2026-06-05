import { useEffect, useState } from "react";
import api from "../services/api";

function Summary() {
  const [summary, setSummary] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenseShare, setExpenseShare] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchSummary = async () => {
    try {
      const res = await api.get("/summary");

      setSummary(res.data.data);
      setTotalExpense(res.data.totalExpense);
      setExpenseShare(res.data.expenseShare);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const downloadPdf = () => {
    window.open(
      "https://expense-tracker-1-ewb1.onrender.com/api/reports/pdf",
      "_blank"
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1>Trip Summary</h1>
        <p>Track trip expenses and balances</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Members</h4>
          <h2>{summary.length}</h2>
          <p>People on this trip</p>
        </div>

        <div className="stat-card expense">
          <h4>Total Expense</h4>
          <h2>₹{totalExpense.toFixed(2)}</h2>
          <p>Total of all expenses</p>
        </div>

        <div className="stat-card share">
          <h4>Expense Share</h4>
          <h2>₹{expenseShare.toFixed(2)}</h2>
          <p>Per member</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
  <button
    className="action-btn refresh-btn"
    onClick={fetchSummary}
  >
    Refresh Summary
  </button>

  <button
    className="action-btn"
    onClick={downloadPdf}
  >
    Download PDF
  </button>
</div>
      {/* Last Updated */}
      <p style={{ marginBottom: "20px" }}>
        <strong>Last Updated:</strong> {lastUpdated}
      </p>

      {/* Summary Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Member Summary</h3>
        </div>

        {summary.length === 0 ? (
          <p style={{ padding: "20px" }}>
            No data available
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Deposit</th>
                <th>Expense Share</th>
                <th>Balance</th>
              </tr>
            </thead>

            <tbody>
              {summary.map((member) => (
                <tr key={member.memberId}>
                  <td>{member.name}</td>

                  <td>
                    ₹{member.totalDeposit.toFixed(2)}
                  </td>

                  <td>
                    ₹{member.expenseShare.toFixed(2)}
                  </td>

                  <td
                    style={{
                      color:
                        member.balance >= 0
                          ? "#16a34a"
                          : "#dc2626",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{member.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Summary;