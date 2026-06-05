import { useEffect, useState } from "react";
import api from "../services/api";

function MembersDeposits() {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
const [message, setMessage] = useState("");
  const fetchMembers = async () => {
    const res = await api.get("/members");
    setMembers(res.data.data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/members", { name });

    setName("");
    setMessage("Member added successfully!");

    fetchMembers();

    setTimeout(() => {
      setMessage("");
    }, 3000);
  } catch (error) {
    console.log(error);
    setMessage("Failed to add member");
  }
};

  return (
    <div>
      <h1>Members</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter member name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">
          Add Member
        </button>
      </form>
{message && (
  <p className="success-message">
    {message}
  </p>
)}
      <hr />

      {members.map((member) => (
        <p key={member._id}>
          {member.name}
        </p>
      ))}
    </div>
  );
}

export default MembersDeposits;