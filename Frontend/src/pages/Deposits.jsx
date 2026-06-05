import { useEffect, useState } from "react";
import api from "../services/api";

function Deposits() {
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
const [message, setMessage] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data.data);

      if (res.data.data.length > 0) {
        setMemberId(res.data.data[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/deposits", {
        memberId,
        amount: Number(amount),
      });

     setAmount("");
setMessage("Deposit added successfully!");

setTimeout(() => {
  setMessage("");
}, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Deposits</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button type="submit">Add Deposit</button>
      </form>
      {message && (
  <p className="success-message">
    {message}
  </p>
)}
    </div>
  );
}

export default Deposits;