// src/pages/employee/Announcements.jsx

import { useState, useEffect } from 'react';
import { FiMessageSquare, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import announcementService from '../../services/announcementService';
import { formatDateTime } from '../../utils/dateUtils';
import { useAuth } from '../../hooks/useAuth';

const AnnouncementsEmployee = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('announcements');
    const [announcements, setAnnouncements] = useState([]);
    const [polls, setPolls] = useState([]);
    const [votedPolls, setVotedPolls] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // Fetch announcements
    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await announcementService.getEmployeeAnnouncements();
            if (response.success) {
                setAnnouncements(response.data || []);
            } else {
                // Mock data
                setAnnouncements([
                    {
                        _id: '1',
                        title: 'Welcome to the new system!',
                        message: 'We are excited to announce the launch of our new Office Attendance System.',
                        priority: 'high',
                        createdBy: { name: 'Admin' },
                        createdAt: new Date().toISOString(),
                    },
                    {
                        _id: '2',
                        title: 'Holiday Notice',
                        message: 'Office will be closed on December 25th for Christmas.',
                        priority: 'normal',
                        createdBy: { name: 'Admin' },
                        createdAt: new Date().toISOString(),
                    },
                    {
                        _id: '3',
                        title: 'Team Building Event',
                        message: 'Join us for a fun team building event this Friday at 3 PM!',
                        priority: 'normal',
                        createdBy: { name: 'HR Team' },
                        createdAt: new Date().toISOString(),
                    },
                ]);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch polls
    const fetchPolls = async () => {
        try {
            setLoading(true);
            const response = await announcementService.getEmployeePolls();
            if (response.success) {
                setPolls(response.data || []);
            } else {
                // Mock data
                setPolls([
                    {
                        _id: '1',
                        question: 'What time should we have team lunch?',
                        options: [
                            { _id: 'opt1', text: '12:00 PM', votes: 12 },
                            { _id: 'opt2', text: '12:30 PM', votes: 18 },
                            { _id: 'opt3', text: '1:00 PM', votes: 8 },
                        ],
                        allowMultiple: false,
                        anonymous: true,
                        totalVotes: 38,
                        hasVoted: false,
                        createdAt: new Date().toISOString(),
                    },
                    {
                        _id: '2',
                        question: 'Which team building activities would you prefer?',
                        options: [
                            { _id: 'opt4', text: 'Outdoor Sports', votes: 15 },
                            { _id: 'opt5', text: 'Escape Room', votes: 20 },
                            { _id: 'opt6', text: 'Cooking Class', votes: 10 },
                            { _id: 'opt7', text: 'Game Night', votes: 18 },
                        ],
                        allowMultiple: true,
                        anonymous: false,
                        totalVotes: 63,
                        hasVoted: false,
                        createdAt: new Date().toISOString(),
                    },
                ]);
            }
        } catch (error) {
            console.error('Error fetching polls:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'announcements') {
            fetchAnnouncements();
        } else {
            fetchPolls();
        }
    }, [activeTab]);

    // Handle vote
    const handleVote = async (pollId, optionIds) => {
        try {
            const response = await announcementService.votePoll(pollId, optionIds);

            if (response.success) {
                toast.success('Vote submitted successfully');
                setVotedPolls(prev => new Set([...prev, pollId]));
                fetchPolls();
            }
        } catch (error) {
            console.error('Error voting:', error);
            toast.error('Failed to submit vote');
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-700 border-gray-300',
            normal: 'bg-blue-100 text-blue-700 border-blue-300',
            high: 'bg-orange-100 text-orange-700 border-orange-300',
            urgent: 'bg-red-100 text-red-700 border-red-300',
        };
        return colors[priority] || colors.normal;
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Announcements & Polls</h1>
                <p className="text-gray-600 mt-2">Stay updated with company news and participate in polls</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveTab('announcements')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center ${activeTab === 'announcements'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <FiMessageSquare className="w-4 h-4 mr-2" />
                        Announcements ({announcements.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('polls')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center ${activeTab === 'polls'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <FiBarChart2 className="w-4 h-4 mr-2" />
                        Polls ({polls.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-md p-8 flex justify-center items-center">
                    <div className="spinner mr-3"></div>
                    <span className="text-gray-600">Loading...</span>
                </div>
            ) : activeTab === 'announcements' ? (
                /* Announcements List */
                <div className="space-y-4">
                    {announcements.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <FiMessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Announcements</h3>
                            <p className="text-gray-600">There are no announcements at the moment</p>
                        </div>
                    ) : (
                        announcements.map((announcement) => (
                            <div
                                key={announcement._id}
                                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {announcement.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(announcement.priority)}`}>
                                                {announcement.priority?.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                            {announcement.message}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-200">
                                    <span className="flex items-center">
                                        📢 <span className="ml-2">Posted by {announcement.createdBy?.name || 'Admin'}</span>
                                    </span>
                                    <span>{formatDateTime(announcement.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Polls List */
                <div className="space-y-4">
                    {polls.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <FiBarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Polls</h3>
                            <p className="text-gray-600">There are no polls available at the moment</p>
                        </div>
                    ) : (
                        polls.map((poll) => {
                            const hasVoted = poll.hasVoted || votedPolls.has(poll._id);

                            return (
                                <PollCard
                                    key={poll._id}
                                    poll={poll}
                                    hasVoted={hasVoted}
                                    onVote={handleVote}
                                />
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

// Poll Card Component
const PollCard = ({ poll, hasVoted, onVote }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleOptionSelect = (optionId) => {
        if (hasVoted) return;

        if (poll.allowMultiple) {
            setSelectedOptions(prev =>
                prev.includes(optionId)
                    ? prev.filter(id => id !== optionId)
                    : [...prev, optionId]
            );
        } else {
            setSelectedOptions([optionId]);
        }
    };

    const handleSubmitVote = () => {
        if (selectedOptions.length === 0) {
            toast.error('Please select at least one option');
            return;
        }
        onVote(poll._id, selectedOptions);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {poll.question}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>Total Votes: {poll.totalVotes}</span>
                    {poll.allowMultiple && <span className="text-blue-600">• Multiple Choice</span>}
                    {poll.anonymous && <span className="text-purple-600">• Anonymous</span>}
                </div>
            </div>

            {/* Poll Options */}
            <div className="space-y-3 mb-4">
                {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0
                        ? Math.round((option.votes / poll.totalVotes) * 100)
                        : 0;
                    const isSelected = selectedOptions.includes(option._id);

                    return (
                        <div key={option._id}>
                            {hasVoted ? (
                                /* Show Results */
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            {option.text}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {option.votes} votes ({percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-600 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                /* Vote Button */
                                <button
                                    onClick={() => handleOptionSelect(option._id)}
                                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${isSelected
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{option.text}</span>
                                        {isSelected && (
                                            <FiCheckCircle className="w-5 h-5 text-primary-600" />
                                        )}
                                    </div>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Submit Vote Button */}
            {!hasVoted && (
                <button
                    onClick={handleSubmitVote}
                    disabled={selectedOptions.length === 0}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Vote
                </button>
            )}

            {hasVoted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <p className="text-green-700 font-medium flex items-center justify-center">
                        <FiCheckCircle className="w-5 h-5 mr-2" />
                        You have voted in this poll
                    </p>
                </div>
            )}

            {/* Poll Info */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-3 mt-3 border-t border-gray-200">
                <span>Posted {formatDateTime(poll.createdAt)}</span>
            </div>
        </div>
    );
};

export default AnnouncementsEmployee;