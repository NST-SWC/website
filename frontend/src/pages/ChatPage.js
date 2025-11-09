import React, { useEffect, useState, useRef } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ChatPage = () => {
  const { userData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollInterval = useRef(null);

  useEffect(() => {
    loadMessages();
    
    // Poll for new messages every 3 seconds
    pollInterval.current = setInterval(() => {
      loadMessages(true);
    }, 3000);

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (silent = false) => {
    try {
      const response = await api.getMessages();
      setMessages(response.data);
    } catch (error) {
      if (!silent) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.sendMessage(newMessage);
      setNewMessage('');
      loadMessages(true);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return <div className="text-center text-cyan-400 text-xl">Loading chat...</div>;
  }

  return (
    <div className="space-y-6" data-testid="chat-page">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <MessageSquare size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold gradient-text">Club Chat</h1>
          <p className="text-gray-400">Connect with the community</p>
        </div>
      </div>

      <div className="glass-card neon-border h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === userData?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                data-testid={`message-${message.id}`}
              >
                <div className={`max-w-[70%] ${
                  isOwnMessage ? 'order-2' : 'order-1'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isOwnMessage 
                        ? 'bg-gradient-to-br from-cyan-400 to-green-400 text-black'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    }`}>
                      {message.sender_name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-300">{message.sender_name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`p-4 rounded-lg ${
                    isOwnMessage
                      ? 'bg-gradient-to-br from-cyan-500/20 to-green-500/20 ml-10'
                      : 'bg-white/5 ml-10'
                  }`}>
                    <p className="text-white">{message.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2" data-testid="chat-form">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border-white/10 text-white"
              data-testid="chat-input"
            />
            <Button type="submit" className="glow-button" data-testid="send-message-btn">
              <Send size={20} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;