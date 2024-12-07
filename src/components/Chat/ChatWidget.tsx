import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import Widget from '../Widget/Widget';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to COVE Chat! How can I help you today?',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team will respond shortly.',
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <Widget
      id="chat"
      title="COVE Chat"
      icon={MessageCircle}
      defaultPosition={{ x: window.innerWidth - 340, y: 100 }}
      defaultSize={{ width: 320, height: 400 }}
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 widget-content">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2">
                {msg.sender === 'system' && (
                  <div className="w-8 h-8 rounded-full bg-nautical-gold/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-nautical-gold" />
                  </div>
                )}
                <div
                  className={`
                    max-w-[80%] p-3 rounded-lg
                    ${msg.sender === 'user' 
                      ? 'bg-nautical-gold/20 text-nautical-gold' 
                      : 'bg-nautical-wave/20 text-nautical-silver'}
                  `}
                >
                  <div className="text-sm">{msg.text}</div>
                  <div className="text-xs opacity-50 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-nautical-gold/20 flex items-center justify-center">
                    <img
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=cove"
                      alt="User"
                      className="w-5 h-5"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-nautical-wave/20 border border-nautical-gold/30 rounded-lg px-4 py-2 text-nautical-silver focus:outline-none focus:border-nautical-gold"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="p-2 bg-nautical-gold/20 hover:bg-nautical-gold/30 rounded-lg transition-colors group"
          >
            <Send className="w-5 h-5 text-nautical-gold" />
            <div className="absolute inset-0 opacity-0 group-active:opacity-100 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-nautical-gold/20 via-transparent to-transparent animate-flame" />
            </div>
          </motion.button>
        </div>
      </div>
    </Widget>
  );
};

export default ChatWidget;