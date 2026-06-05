import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Members from "./pages/Members";
import Deposits from "./pages/Deposits";
import Expenses from "./pages/Expenses";
import Summary from "./pages/Summary";
import Layout from "./components/Layouts";
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Summary</Link> |{" "}
        <Link to="/deposits">Deposits</Link> |{" "}
        <Link to="/expenses">Expenses</Link> |{" "}
        <Link to="/members">Members</Link>
      </nav>
    <Layout>
      <Routes>
        <Route path="/" element={<Summary />} />
        <Route path="/deposits" element={<Deposits />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/members" element={<Members />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;