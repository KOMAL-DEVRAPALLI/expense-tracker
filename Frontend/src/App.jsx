import { BrowserRouter, Routes, Route } from "react-router-dom";
import MembersDeposits from "./pages/MembersDeposits";
import Expenses from "./pages/Expenses";
import Summary from "./pages/Summary";
import Layout from "./components/Layouts";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/membersdeposits" element={<MembersDeposits />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;