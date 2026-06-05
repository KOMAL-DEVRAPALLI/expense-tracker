import { useEffect, useState } from "react";
import api from "../services/api";

function Expenses() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
const [message, setMessage] = useState("");
const [expenses, setExpenses] = useState([]);
const fetchExpenses = async () => {
  try {
    const res = await api.get("/expenses");
    setExpenses(res.data.data);
  } catch (error) {
    console.log(error);
  }
};
useEffect(()=>{
  fetchExpenses()
},[])
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/expenses", {
        title,
        amount: Number(amount),
      });

      setTitle("");
setAmount("");

setMessage("Expense added successfully!");

setTimeout(() => {
  setMessage("");
}, 3000);
fetchExpenses()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Expenses</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="submit">Add Expense</button>
      </form>
      {message && (
  <p className="success-message">
    {message}
  </p>
)}
    </div>
    
  );
  <div className="table-card">
  <div className="table-header">
    <h3>Expense History</h3>
  </div>

  {expenses.length === 0 ? (
    <p style={{ padding: "20px" }}>
      No expenses found
    </p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {expenses.map((expense) => (
          <tr key={expense._id}>
            <td>{expense.title}</td>

            <td>
              ₹{expense.amount}
            </td>

            <td>
              {new Date(
                expense.createdAt
              ).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
}

export default Expenses;