import { useEffect, useState } from "react";
import api from "../services/api";
import { FaUsers } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
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
    <div className="card-icon">
      <FaUsers />
    </div>

    <div>
      <h4>Total Members</h4>
      <h2>{summary.length}</h2>
      <p>People on this trip</p>
    </div>
  </div>

  <div className="stat-card expense">
    <div className="card-icon">
      <FaIndianRupeeSign />
    </div>

    <div>
      <h4>Total Expense</h4>
      <h2>₹{totalExpense.toFixed(2)}</h2>
      <p>Total of all expenses</p>
    </div>
  </div>

  <div className="stat-card share">
    <div className="card-icon">
      <FaIndianRupeeSign />
    </div>

    <div>
      <h4>Expense Share</h4>
      <h2>₹{expenseShare.toFixed(2)}</h2>
      <p>Per member</p>
    </div>
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
         <div className="member-cards">
  {summary.map((member) => (
    <div
      key={member.memberId}
      className="member-card"
    >
      <h3>{member.name}</h3>

      <p>
        Deposit: ₹
        {member.totalDeposit.toFixed(2)}
      </p>

      <p>
        Share: ₹
        {member.expenseShare.toFixed(2)}
      </p>

      <p
        style={{
          color:
            member.balance >= 0
              ? "#16a34a"
              : "#dc2626",
          fontWeight: "bold",
        }}
      >
        Balance: ₹
        {member.balance.toFixed(2)}
      </p>
    </div>
  ))}
</div>
        )}
        
      </div>
    </div>
  );
}

export default Summary;