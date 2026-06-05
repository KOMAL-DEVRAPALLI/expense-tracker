import { useEffect, useState } from "react";
import api from "../services/api";

function MembersDeposits() {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
const [deposits, setDeposits] = useState([]);
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
const fetchDeposits = async () => {
  try {
    const res = await api.get("/deposits");
    setDeposits(res.data.data);
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    fetchMembers();
    fetchDeposits()
  }, []);

  const handleMemberSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/members", { name });

      setName("");
      fetchMembers();

      setMessage("Member added successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDepositSubmit = async (e) => {
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
      fetchDeposits();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Members & Deposits</h1>

      {/* Add Member */}

      <div className="table-card">
        <div className="table-header">
          <h3>Add Member</h3>
        </div>

        <div style={{ padding: "20px" }}>
          <form onSubmit={handleMemberSubmit}>
            <input
              type="text"
              placeholder="Enter member name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <button
              type="submit"
              className="action-btn"
            >
              Add Member
            </button>
          </form>
        </div>
      </div>

      <br />

      {/* Add Deposit */}

      <div className="table-card">
        <div className="table-header">
          <h3>Add Deposit</h3>
        </div>

        <div style={{ padding: "20px" }}>
          <form onSubmit={handleDepositSubmit}>
            <select
              value={memberId}
              onChange={(e) =>
                setMemberId(e.target.value)
              }
            >
              {members.map((member) => (
                <option
                  key={member._id}
                  value={member._id}
                >
                  {member.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <button
              type="submit"
              className="action-btn"
            >
              Add Deposit
            </button>
          </form>
        </div>
      </div>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      <br />

      {/* Member List */}

      <div className="table-card">
        <div className="table-header">
          <h3>Members</h3>
        </div>

        <div style={{ padding: "20px" }}>
          {members.map((member) => (
            <p key={member._id}>
              {member.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
  <div className="table-card">
  <div className="table-header">
    <h3>Deposit History</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Amount</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>
      {deposits.map((deposit) => (
        <tr key={deposit._id}>
          <td>{deposit.memberId?.name}</td>

          <td>
            ₹{deposit.amount}
          </td>

          <td>
            {new Date(
              deposit.createdAt
            ).toLocaleDateString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
}

export default MembersDeposits;