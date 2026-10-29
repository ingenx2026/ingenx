import Admin from './pages/Admin';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import MarketingBusiness from "@/pages/MarketingBusiness";
import Innovation from "@/pages/Innovation";
import TechHackathons from "@/pages/TechHackathons";
import Sustainability from "@/pages/Sustainability";
import Creativity from "@/pages/Creativity";
import OpportunityDetails from './pages/OpportunityDetails';
import ScrollToTop from './components/ScrollToTop';
import Register from './pages/Register';
import PostChallenge from './pages/PostChallenge';
import Login from './pages/Login';
import About from './pages/About'; 
import Contact from './pages/Contact'; 

import RoomExplore from './pages/RoomExplore';
import CtaAnalytics from './components/CtaAnalytics';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <CtaAnalytics />
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomExplore />} />
          <Route path="/rooms/:roomSlug" element={<RoomExplore />} />
          <Route path="/marketing-business" element={<MarketingBusiness />} />
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/tech-hackathons" element={<TechHackathons />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/creativity" element={<Creativity />} />
          <Route path="/opportunity/:id" element={<OpportunityDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-a-challenge" element={<PostChallenge />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* 👇 ADD THIS EXACT ROUTE 👇 */}
          <Route path="/for-brands" element={<Contact />} />
          
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;