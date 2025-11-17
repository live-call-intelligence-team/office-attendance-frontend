// src/pages/employee/CalendarSync.jsx

import { useState } from 'react';
import { FiCalendar, FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CalendarSync = () => {
    const [syncStatus, setSyncStatus] = useState({
        google: false,
        outlook: false,
    });

    const [syncing, setSyncing] = useState({
        google: false,
        outlook: false,
    });

    const handleGoogleSync = async () => {
        try {
            setSyncing(prev => ({ ...prev, google: true }));

            // In production, this would redirect to Google OAuth
            toast.info('Google Calendar integration coming soon!');

            // Simulate sync
            setTimeout(() => {
                setSyncStatus(prev => ({ ...prev, google: true }));
                toast.success('Google Calendar synced successfully');
                setSyncing(prev => ({ ...prev, google: false }));
            }, 2000);
        } catch (error) {
            console.error('Error syncing Google Calendar:', error);
            toast.error('Failed to sync Google Calendar');
            setSyncing(prev => ({ ...prev, google: false }));
        }
    };

    const handleOutlookSync = async () => {
        try {
            setSyncing(prev => ({ ...prev, outlook: true }));

            // In production, this would redirect to Microsoft OAuth
            toast.info('Outlook Calendar integration coming soon!');

            // Simulate sync
            setTimeout(() => {
                setSyncStatus(prev => ({ ...prev, outlook: true }));
                toast.success('Outlook Calendar synced successfully');
                setSyncing(prev => ({ ...prev, outlook: false }));
            }, 2000);
        } catch (error) {
            console.error('Error syncing Outlook Calendar:', error);
            toast.error('Failed to sync Outlook Calendar');
            setSyncing(prev => ({ ...prev, outlook: false }));
        }
    };

    const handleDisconnect = (provider) => {
        setSyncStatus(prev => ({ ...prev, [provider]: false }));
        toast.success(`${provider === 'google' ? 'Google' : 'Outlook'} Calendar disconnected`);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Calendar Sync</h1>
                <p className="text-gray-600 mt-2">Sync your work calendar with Google Calendar or Outlook</p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                    <FiCalendar className="w-5 h-5 mr-2" />
                    What gets synced?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li>✓ Your attendance check-in/check-out times</li>
                    <li>✓ Approved leave dates</li>
                    <li>✓ Task deadlines and assignments</li>
                    <li>✓ Company announcements and events</li>
                    <li>✓ Team meetings and schedules</li>
                </ul>
            </div>

            {/* Google Calendar */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M6,1v7H1v7h5v7l11-10.5L6,1z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Sync your work events with Google Calendar
                            </p>
                            {syncStatus.google && (
                                <div className="flex items-center mt-2">
                                    <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                    <span className="text-sm text-green-600 font-medium">Connected</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {syncStatus.google ? (
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleGoogleSync()}
                                    disabled={syncing.google}
                                    className="btn-secondary w-full flex items-center justify-center"
                                >
                                    {syncing.google ? (
                                        <>
                                            <div className="spinner mr-2"></div>
                                            Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <FiRefreshCw className="w-4 h-4 mr-2" />
                                            Refresh Sync
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDisconnect('google')}
                                    className="btn-danger w-full"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleGoogleSync}
                                disabled={syncing.google}
                                className="btn-primary flex items-center"
                            >
                                {syncing.google ? (
                                    <>
                                        <div className="spinner mr-2"></div>
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        Connect
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Outlook Calendar */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#0078D4" d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,4V8H17V4H7M7,10V14H17V10H7M7,16V20H17V16H7Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Outlook Calendar</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Sync your work events with Microsoft Outlook
                            </p>
                            {syncStatus.outlook && (
                                <div className="flex items-center mt-2">
                                    <FiCheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                    <span className="text-sm text-green-600 font-medium">Connected</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {syncStatus.outlook ? (
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleOutlookSync()}
                                    disabled={syncing.outlook}
                                    className="btn-secondary w-full flex items-center justify-center"
                                >
                                    {syncing.outlook ? (
                                        <>
                                            <div className="spinner mr-2"></div>
                                            Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <FiRefreshCw className="w-4 h-4 mr-2" />
                                            Refresh Sync
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDisconnect('outlook')}
                                    className="btn-danger w-full"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleOutlookSync}
                                disabled={syncing.outlook}
                                className="btn-primary flex items-center"
                            >
                                {syncing.outlook ? (
                                    <>
                                        <div className="spinner mr-2"></div>
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        Connect
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center">
                    <FiAlertCircle className="w-5 h-5 mr-2" />
                    Privacy & Permissions
                </h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                    <li>• We only read and write calendar events related to your work</li>
                    <li>• Your personal calendar events remain private</li>
                    <li>• You can disconnect at any time</li>
                    <li>• Calendar sync is optional and not required</li>
                </ul>
            </div>

            {/* Implementation Note */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">🔧 Implementation Note</h3>
                <p className="text-sm text-gray-600">
                    Calendar sync integration requires OAuth configuration with Google and Microsoft APIs.
                    Contact your system administrator for setup assistance.
                </p>
            </div>
        </div>
    );
};

export default CalendarSync;