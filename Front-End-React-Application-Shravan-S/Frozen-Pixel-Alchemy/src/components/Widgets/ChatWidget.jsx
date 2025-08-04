import React, { useState, useRef, useEffect } from "react";
import "../../stylesheets/ChatWidget.css";

function ChatWidget({ onSend = () => {}, isOpen = false, onToggle = () => {} }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Call Spring Boot backend which calls Gemini API
  const getGeminiResponse = async (userMessage) => {
    try {
      const contextualPrompt = `
You are a helpful assistant for Frozen Pixel Alchemy, a professional photography business. 
Our services include:
- Portrait photography sessions
- Event and wedding photography
- Commercial photography shoots
- High-quality print services
- Professional photography gear

Business Information:
- Website: www.frozenpixelalchemy.com (use this for booking references)
- Location: Professional photography studio
- Specialties: Creative, artistic photography with a focus on capturing authentic moments
- Booking: Available through our website's booking page or contact form

Please provide helpful, friendly responses about our photography services. Keep responses concise and relevant.

User question: ${userMessage}
`;

    //   console.log('Sending request to backend...'); // Debug log

      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: contextualPrompt }),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(`Server returned ${response.status}: ${errorData.error || response.statusText}`);
      }

      // Parse JSON response instead of text
      const data = await response.json();
      console.log('Success response:', data); // Debug log
      
      // Extract the response from the JSON structure
      return data.response || "I received your message but couldn't generate a proper response.";
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // More specific error handling
      if (error.name === 'SyntaxError') {
        return "I received a malformed response from the server. Please try again.";
      } else if (error.message.includes('Failed to fetch')) {
        return "I can't connect to the server right now. Please check if the backend is running.";
      } else {
        return "I'm sorry, I'm having trouble responding right now. Please try again later, or contact us directly for immediate assistance.";
      }
    }
  };

  const handleSend = async () => {
    if (message.trim() && typeof onSend === 'function') {
      const userMessage = { 
        text: message, 
        timestamp: new Date(), 
        sender: 'user',
        id: Date.now()
      };
      
      // Add user message
      setMessages(prev => [...prev, userMessage]);
      const currentMessage = message;
      setMessage("");
      
      // Call parent onSend (for logging)
      onSend(currentMessage);
      
      // Show typing indicator
      setIsTyping(true);
      
      try {
        // Get response from Gemini API via Spring Boot backend
        const botResponse = await getGeminiResponse(currentMessage);
        
        const botMessage = {
          text: botResponse,
          timestamp: new Date(),
          sender: 'bot',
          id: Date.now() + 1
        };
        
        // Add bot response
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = {
          text: "Sorry, I'm experiencing technical difficulties. Please try again or contact us directly.",
          timestamp: new Date(),
          sender: 'bot',
          id: Date.now() + 1
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  if (!isOpen) {
    return (
      <div className="chat-toggle" onClick={onToggle}>
        💬
      </div>
    );
  }

  return (
    <div className="chat-widget">
      {/* Header */}
      <div className="chat-header">
        <h3>Chat with us!</h3>
        <button onClick={onToggle}>✕</button>
      </div>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
            Hi! I'm your AI assistant for Frozen Pixel Alchemy. Ask me about our photography services, booking, prints, or anything else!
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`chat-message ${msg.sender}`}
            >
              {msg.text}
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="chat-message bot">
            <span className="typing-indicator">
              Typing<span className="dots">...</span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about our photography services..."
          disabled={isTyping}
        />
        <button 
          onClick={handleSend} 
          disabled={!message.trim() || isTyping}
        >
          {isTyping ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatWidget;