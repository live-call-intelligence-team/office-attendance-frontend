import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FiSend,
  FiSmile,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMessageSquare,
  FiX,
} from 'react-icons/fi';

const TeamChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '✅', '👏', '🚀'];

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      const allTeams = response.data.data || [];
      setTeams(allTeams);
      
      // Set default channel to general if it exists
      if (allTeams.length > 0 && !activeChannel) {
        const generalTeam = allTeams.find(t => t.name === 'general');
        if (generalTeam) {
          setActiveChannel(generalTeam.name);
        } else {
          setActiveChannel(allTeams[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/messages/${activeChannel}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    try {
      setSending(true);
      await api.post('/messages', {
        channel: activeChannel,
        content: messageInput,
      });

      setMessageInput('');
      fetchMessages();
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      await api.post(`/messages/${messageId}/react`, { emoji });
      fetchMessages();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/messages/${messageId}`);
      toast.success('Message deleted');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const isToday = messageDate.toDateString() === today.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const currentChannel = teams.find(c => c.name === activeChannel);

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-4">
      {/* Channels Sidebar */}
      <div className="w-72 bg-background-card rounded-2xl shadow-custom border border-border overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary mb-2">Team Chat 💬</h2>
          <p className="text-xs text-text-secondary">Communicate with your team</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {teams.map((team) => (
              <button
                key={team._id}
                onClick={() => setActiveChannel(team.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeChannel === team.name
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white shadow-lg'
                    : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'
                }`}
              >
                <span className="text-2xl">{team.icon}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{team.displayName}</p>
                  <p className={`text-xs ${activeChannel === team.name ? 'text-white/80' : 'text-text-muted'}`}>
                    {team.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-border bg-background-secondary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary text-sm truncate">{user?.name}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                <p className="text-xs text-text-secondary">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-background-card rounded-2xl shadow-custom border border-border overflow-hidden flex flex-col">
        {/* Channel Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentChannel?.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-text-primary">{currentChannel?.displayName}</h3>
                <p className="text-sm text-text-secondary">{currentChannel?.description}</p>
              </div>
            </div>

            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FiMessageSquare className="text-6xl text-text-muted mb-4" />
              <p className="text-text-muted text-lg font-semibold">No messages yet</p>
              <p className="text-text-secondary text-sm mt-2">Start the conversation!</p>
            </div>
          ) : (
            messages
              .filter(msg => 
                !searchQuery || 
                msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                msg.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((message, index) => {
                const isOwnMessage = message.sender?._id === user?._id;
                const showAvatar = index === 0 || messages[index - 1]?.sender?._id !== message.sender?._id;

                return (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-text-white font-bold text-sm ${
                          message.sender?.role === 'admin'
                            ? 'bg-gradient-to-br from-error-500 to-warning-500'
                            : 'bg-gradient-to-br from-primary-500 to-secondary-500'
                        }`}>
                          {message.sender?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      ) : (
                        <div className="w-10"></div>
                      )}
                    </div>

                    <div className={`flex-1 max-w-2xl ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                          <p className="text-sm font-semibold text-text-primary">{message.sender?.name || 'Unknown'}</p>
                          {message.sender?.role === 'admin' && (
                            <span className="px-2 py-0.5 bg-error-100 text-error-700 text-xs font-semibold rounded">
                              Admin
                            </span>
                          )}
                          <p className="text-xs text-text-muted">{formatTime(message.createdAt)}</p>
                        </div>
                      )}

                      <div className="group relative">
                        <div className={`px-4 py-3 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white'
                            : 'bg-background-secondary text-text-primary'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          {message.isEdited && (
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white/70' : 'text-text-muted'}`}>
                              (edited)
                            </p>
                          )}
                        </div>

                        {/* Message Actions */}
                        <div className={`absolute top-0 ${isOwnMessage ? 'left-0' : 'right-0'} -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                          <div className="flex items-center gap-1 bg-background-card shadow-lg rounded-lg p-1 border border-border mb-1">
                            {emojis.slice(0, 5).map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(message._id, emoji)}
                                className="p-1 hover:bg-background-secondary rounded transition-colors text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                            {isOwnMessage && (
                              <>
                                <div className="w-px h-6 bg-border mx-1"></div>
                                <button
                                  onClick={() => handleDeleteMessage(message._id)}
                                  className="p-1.5 hover:bg-background-secondary rounded transition-colors"
                                  title="Delete"
                                >
                                  <FiTrash2 className="text-error-500" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleReaction(message._id, reaction.emoji)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                                reaction.users?.includes(user?._id)
                                  ? 'bg-primary-100 border border-primary-300'
                                  : 'bg-background-secondary border border-border hover:bg-background-primary'
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-text-secondary font-semibold">{reaction.users?.length || 0}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder={`Message #${currentChannel?.displayName?.toLowerCase() || 'channel'}...`}
                rows={1}
                className="w-full px-4 py-3 bg-background-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-text-primary resize-none"
                style={{ maxHeight: '120px', minHeight: '48px' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!messageInput.trim() || sending}
              className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend className="text-xl" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
