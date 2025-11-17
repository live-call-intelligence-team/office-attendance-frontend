// src/components/common/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiX, FiUsers, FiUser } from 'react-icons/fi';
import { formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../hooks/useAuth';

const ChatWindow = ({
    chatType = 'group', // 'group' or 'private'
    recipientUser = null, // for private chat
    messages = [],
    onSendMessage,
    onClose,
    onUploadFile,
}) => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!message.trim() && !selectedFile) return;

        const messageData = {
            text: message,
            file: selectedFile,
            chatType,
            recipientId: recipientUser?._id,
        };

        onSendMessage(messageData);
        setMessage('');
        setSelectedFile(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-600 text-white rounded-t-xl">
                <div className="flex items-center">
                    {chatType === 'group' ? (
                        <>
                            <FiUsers className="w-5 h-5 mr-3" />
                            <div>
                                <h3 className="font-semibold">Team Chat</h3>
                                <p className="text-xs text-primary-100">All employees</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">
                                {recipientUser?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <h3 className="font-semibold">{recipientUser?.name || 'Admin'}</h3>
                                <p className="text-xs text-primary-100">
                                    {recipientUser?.designation || 'Administrator'}
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
                >
                    <FiX className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                            <p className="mb-2">No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwnMessage = msg.sender?._id === user._id;
                        return (
                            <div
                                key={index}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                    {/* Sender Name */}
                                    {!isOwnMessage && (
                                        <p className="text-xs text-gray-600 mb-1 ml-2">
                                            {msg.sender?.name || 'Unknown'}
                                        </p>
                                    )}

                                    {/* Message Bubble */}
                                    <div
                                        className={`rounded-lg p-3 ${isOwnMessage
                                                ? 'bg-primary-600 text-white rounded-br-none'
                                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                            }`}
                                    >
                                        {/* Text */}
                                        {msg.text && (
                                            <p className="text-sm whitespace-pre-wrap break-words">
                                                {msg.text}
                                            </p>
                                        )}

                                        {/* File Attachment */}
                                        {msg.file && (
                                            <div className="mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center">
                                                <FiPaperclip className="w-4 h-4 mr-2" />
                                                <a
                                                    href={msg.file.url}
                                                    download
                                                    className="text-sm underline"
                                                >
                                                    {msg.file.name}
                                                </a>
                                            </div>
                                        )}

                                        {/* Timestamp */}
                                        <p
                                            className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                                                }`}
                                        >
                                            {formatDateTime(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
                {/* Selected File Preview */}
                {selectedFile && (
                    <div className="mb-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                        <div className="flex items-center">
                            <FiPaperclip className="w-4 h-4 mr-2 text-gray-600" />
                            <span className="text-sm text-gray-700">{selectedFile.name}</span>
                        </div>
                        <button
                            onClick={() => setSelectedFile(null)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Input */}
                <div className="flex items-end space-x-2">
                    {/* File Upload */}
                    <input
                        type="file"
                        id="chat-file-upload"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="chat-file-upload"
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                    >
                        <FiPaperclip className="w-5 h-5 text-gray-600" />
                    </label>

                    {/* Text Input */}
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="1"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() && !selectedFile}
                        className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSend className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;