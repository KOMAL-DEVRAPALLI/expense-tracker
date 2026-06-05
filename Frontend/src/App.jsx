import { BrowserRouter, Routes, Route } from "react-router-dom";

import Members from "./pages/Members";
import Deposits from "./pages/Deposits";
import Expenses from "./pages/Expenses";
import Summary from "./pages/Summary";
import Layout from "./components/Layouts";

function App() {
  return (
    <BrowserRouter>
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