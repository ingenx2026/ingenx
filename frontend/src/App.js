import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import MarketingBusiness from "@/pages/MarketingBusiness";
import Innovation from "@/pages/Innovation";
import TechHackathons from "@/pages/TechHackathons";
import Sustainability from "@/pages/Sustainability";
import Creativity from "@/pages/Creativity";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketing-business" element={<MarketingBusiness />} />
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/tech-hackathons" element={<TechHackathons />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/creativity" element={<Creativity />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
