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
      <h1>Trip Summary</h1>

      <h3>Total Expense: ₹{totalExpense.toFixed(2)}</h3>
      <h3>Expense Share: ₹{expenseShare.toFixed(2)}</h3>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={downloadPdf}>
          Download PDF
        </button>

        <button
          onClick={fetchSummary}
          style={{ marginLeft: "10px" }}
        >
          Refresh Summary
        </button>
      </div>

      <p>
        <strong>Last Updated:</strong> {lastUpdated}
      </p>

      {summary.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table border="1" cellPadding="10">
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
                        ? "green"
                        : "red",
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
  );
}

export default Summary;