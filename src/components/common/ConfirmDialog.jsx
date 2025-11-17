// src/components/common/ConfirmDialog.jsx

import { FiAlertTriangle, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Modal from './Modal';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning', // 'warning', 'danger', 'info', 'success'
    loading = false,
}) => {
    const typeConfig = {
        warning: {
            icon: FiAlertTriangle,
            iconColor: 'text-yellow-600',
            iconBg: 'bg-yellow-100',
            buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        },
        danger: {
            icon: FiXCircle,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
        },
        info: {
            icon: FiInfo,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
        success: {
            icon: FiCheckCircle,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
            buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
        },
    };

    const config = typeConfig[type] || typeConfig.warning;
    const Icon = config.icon;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
        >
            <div className="text-center">
                {/* Icon */}
                <div className={`mx-auto w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${config.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 btn-secondary"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${config.buttonClass}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="spinner mr-2"></div>
                                Processing...
                            </span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;