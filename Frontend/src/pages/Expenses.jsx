import { useState } from "react";
import api from "../services/api";

function Expenses() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
const [message, setMessage] = useState("");

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
}

export default Expenses;