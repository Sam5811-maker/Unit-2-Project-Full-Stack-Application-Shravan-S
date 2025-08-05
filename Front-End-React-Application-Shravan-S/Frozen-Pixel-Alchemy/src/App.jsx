import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Shared/Footer';
import ChatWidget from './components/Widgets/ChatWidget';
import Home from './components/Pages/Home';
import Prints from './components/Pages/Prints';
import Photographer from './components/Pages/Photographer';
import Gear from './components/Pages/Gear';
import About from './components/Pages/About';
import Booking from './components/Pages/Booking';
import Contact from './components/Pages/Contact';

// CSS imports
import './App.css';
import './stylesheets/FooterStylingSheet.css';
import './stylesheets/HomeStyleSheet.css';
import './stylesheets/PhotographerStyleSheet.css';
import './stylesheets/BookingStylingSheet.css';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatMessage = (message) => {
    console.log('Chat message received:', message);
  
  };

  return (
    <div className="app-page">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prints" element={<Prints />} />
        <Route path="/photographer" element={<Photographer />} />
        <Route path="/gear" element={<Gear />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}>Page Not Found</div>} />
      </Routes>
      <Footer />
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onSend={handleChatMessage}
      />
    </div>
  );
};

export default App;