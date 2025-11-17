import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiPaperclip,
  FiImage,
  FiFile,
  FiDownload,
  FiCopy,
  FiCornerUpRight,
  FiBold,
  FiItalic,
  FiCode,
  FiBookmark, // Using FiBookmark instead of FiPin
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
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '✅', '👏', '🚀', '💯', '⭐', '🙌', '💪', '👀'];

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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
    }));
    setUploadedFiles([...uploadedFiles, ...fileData]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageInput.trim() && uploadedFiles.length === 0) return;

    try {
      setSending(true);

      const messageData = {
        channel: activeChannel,
        content: messageInput.trim() || '📎 File attachment',
        messageType: uploadedFiles.length > 0 ? 'file' : 'text',
      };

      if (replyTo) {
        messageData.replyTo = replyTo._id;
      }

      if (uploadedFiles.length > 0) {
        messageData.attachments = uploadedFiles;
      }

      if (editingMessage) {
        await api.put(`/messages/${editingMessage._id}`, {
          content: messageInput,
        });
        setEditingMessage(null);
        toast.success('Message updated');
      } else {
        await api.post('/messages', messageData);
      }

      setMessageInput('');
      setReplyTo(null);
      setUploadedFiles([]);
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

  const handlePinMessage = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/pin`);
      toast.success('Message pinned');
      fetchMessages();
    } catch (error) {
      console.error('Error pinning message:', error);
      toast.error(error.response?.data?.message || 'Failed to pin message');
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

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
    inputRef.current?.focus();
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
  const pinnedMessages = messages.filter(m => m.isPinned);

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
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-background-card"></div>
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

            <div className="flex items-center gap-3">
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
        </div>

        {/* Pinned Messages Bar */}
        {pinnedMessages.length > 0 && (
          <div className="px-6 py-3 bg-primary-50 border-b border-primary-200">
            <div className="flex items-center gap-3">
              <FiBookmark className="text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary-700">
                  {pinnedMessages.length} Pinned Message{pinnedMessages.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-primary-600 line-clamp-1">
                  {pinnedMessages[0].content}
                </p>
              </div>
            </div>
          </div>
        )}

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
                          {message.isPinned && (
                            <FiBookmark className="text-primary-500 text-xs" title="Pinned" />
                          )}
                        </div>
                      )}

                      {/* Reply Preview */}
                      {message.replyTo && (
                        <div className="mb-2 p-2 bg-background-secondary border-l-2 border-primary-500 rounded text-sm">
                          <p className="text-xs text-text-muted mb-1">
                            <FiCornerUpRight className="inline mr-1" />
                            Replying to message
                          </p>
                          <p className="text-text-secondary line-clamp-1">{message.replyTo.content}</p>
                        </div>
                      )}

                      <div className="group relative">
                        <div className={`px-4 py-3 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white'
                            : 'bg-background-secondary text-text-primary'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          
                          {/* File Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((file, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-3 p-3 rounded-lg ${
                                    isOwnMessage ? 'bg-white/20' : 'bg-background-primary'
                                  }`}
                                >
                                  {file.fileType?.startsWith('image/') ? (
                                    <FiImage className="text-2xl" />
                                  ) : (
                                    <FiFile className="text-2xl" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{file.fileName}</p>
                                    <p className="text-xs opacity-70">{formatFileSize(file.fileSize)}</p>
                                  </div>
                                  <button className="p-2 hover:bg-black/10 rounded-lg transition-colors">
                                    <FiDownload />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Thread Count */}
                          {message.threadReplies && message.threadReplies.length > 0 && (
                            <button
                              className={`mt-2 text-xs flex items-center gap-1 ${
                                isOwnMessage ? 'text-white/80 hover:text-white' : 'text-primary-600 hover:text-primary-700'
                              }`}
                            >
                              <FiMessageSquare />
                              {message.threadReplies.length} {message.threadReplies.length === 1 ? 'reply' : 'replies'}
                            </button>
                          )}

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
                                title="React"
                              >
                                {emoji}
                              </button>
                            ))}
                            <div className="w-px h-6 bg-border mx-1"></div>
                            <button
                              onClick={() => setReplyTo(message)}
                              className="p-1.5 hover:bg-background-secondary rounded transition-colors"
                              title="Reply in thread"
                            >
                              <FiCornerUpRight className="text-text-secondary" />
                            </button>
                            {user?.role === 'admin' && (
                              <button
                                onClick={() => handlePinMessage(message._id)}
                                className="p-1.5 hover:bg-background-secondary rounded transition-colors"
                                title="Pin message"
                              >
                                <FiBookmark className={message.isPinned ? 'text-primary-500' : 'text-text-secondary'} />
                              </button>
                            )}
                            {isOwnMessage && (
                              <>
                                <button
                                  onClick={() => handleEditMessage(message)}
                                  className="p-1.5 hover:bg-background-secondary rounded transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit2 className="text-text-secondary" />
                                </button>
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

        {/* Reply Preview */}
        <AnimatePresence>
          {replyTo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-6 py-3 bg-primary-50 border-t border-primary-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiCornerUpRight className="text-primary-500" />
                  <div>
                    <p className="text-xs text-primary-600">Replying to {replyTo.sender?.name}</p>
                    <p className="text-sm text-text-primary line-clamp-1">{replyTo.content}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="p-1 hover:bg-primary-100 rounded transition-colors"
                >
                  <FiX className="text-primary-600" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Preview */}
        <AnimatePresence>
          {editingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-6 py-3 bg-warning-50 border-t border-warning-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiEdit2 className="text-warning-600" />
                  <p className="text-sm text-warning-700 font-semibold">Editing message</p>
                </div>
                <button
                  onClick={() => {
                    setEditingMessage(null);
                    setMessageInput('');
                  }}
                  className="p-1 hover:bg-warning-100 rounded transition-colors"
                >
                  <FiX className="text-warning-600" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File Upload Preview */}
        {uploadedFiles.length > 0 && (
          <div className="px-6 py-3 bg-background-secondary border-t border-border">
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-background-card rounded-lg border border-border">
                  <FiFile className="text-primary-500" />
                  <span className="text-sm text-text-primary truncate max-w-[150px]">{file.fileName}</span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 hover:bg-error-50 rounded transition-colors"
                  >
                    <FiX className="text-error-500 text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-6 border-t border-border">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex items-center gap-2 text-text-muted">
              <button type="button" className="p-2 hover:bg-background-secondary rounded-lg transition-colors" title="Bold">
                <FiBold />
              </button>
              <button type="button" className="p-2 hover:bg-background-secondary rounded-lg transition-colors" title="Italic">
                <FiItalic />
              </button>
              <button type="button" className="p-2 hover:bg-background-secondary rounded-lg transition-colors" title="Code">
                <FiCode />
              </button>
              <div className="w-px h-6 bg-border"></div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                title="Attach file"
              >
                <FiPaperclip />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                title="Add emoji"
              >
                <FiSmile />
              </button>
            </div>

            <div className="flex items-end gap-3">
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
                disabled={(!messageInput.trim() && uploadedFiles.length === 0) || sending}
                className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend className="text-xl" />
              </motion.button>
            </div>
          </form>

          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-24 right-6 bg-background-card shadow-2xl rounded-xl p-4 border border-border z-50"
              >
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setMessageInput(messageInput + emoji);
                        setShowEmojiPicker(false);
                        inputRef.current?.focus();
                      }}
                      className="text-2xl p-2 hover:bg-background-secondary rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
