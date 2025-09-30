import "./App.css";
import Home from "../components/Home";
import CardData from "../components/CardData";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Archetype from "../components/Archetype";
import Contact from "../components/Contact";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen mt-60 md:mt-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/card/:card_id" element={<CardData />} />
            <Route path="/archetype/:archetype_name" element={<Archetype />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
