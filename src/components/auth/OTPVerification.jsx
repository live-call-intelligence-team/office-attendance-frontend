// src/components/auth/OTPVerification.jsx

import { useState, useRef, useEffect } from 'react';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const OTPVerification = ({ email, onVerify, onResend, onBack, loading }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle OTP input change
    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);

        // Focus last filled input or next empty
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length === 6) {
            onVerify({ email, otp: otpString });
        }
    };

    // Handle resend
    const handleResend = () => {
        if (canResend) {
            onResend(email);
            setTimer(300);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    // Check if OTP is complete
    const isOtpComplete = otp.every((digit) => digit !== '');

    return (
        <div className="w-full max-w-md">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <FiArrowLeft className="mr-2" />
                Back to login
            </button>

            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                        className="w-8 h-8 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Verify OTP
                </h1>
                <p className="text-gray-600">
                    Enter the 6-digit code sent to
                </p>
                <p className="text-gray-900 font-medium mt-1">{email}</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* OTP Input Fields */}
                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                {/* Timer */}
                <div className="text-center mb-6">
                    {timer > 0 ? (
                        <p className="text-sm text-gray-600">
                            Code expires in{' '}
                            <span className="font-semibold text-primary-600">
                                {formatTime(timer)}
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm text-red-600 font-medium">
                            OTP expired! Please request a new one.
                        </p>
                    )}
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={!isOtpComplete || loading || timer === 0}
                    className="w-full btn-primary flex items-center justify-center mb-4"
                >
                    {loading ? (
                        <>
                            <div className="spinner mr-2"></div>
                            Verifying...
                        </>
                    ) : (
                        'Verify OTP'
                    )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={!canResend || loading}
                            className={`font-medium ${canResend && !loading
                                    ? 'text-primary-600 hover:text-primary-700'
                                    : 'text-gray-400 cursor-not-allowed'
                                } inline-flex items-center`}
                        >
                            <FiRefreshCw className="mr-1" />
                            Resend OTP
                        </button>
                    </p>
                </div>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 text-center">
                    For security reasons, OTP is valid for 5 minutes only.
                    Please check your spam folder if you don't see the email.
                </p>
            </div>
        </div>
    );
};

export default OTPVerification;