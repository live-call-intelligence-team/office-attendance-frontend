// src/components/common/LoadingSpinner.jsx

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
    const sizeClasses = {
        small: 'w-5 h-5',
        medium: 'w-10 h-10',
        large: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className={`spinner ${sizeClasses[size]}`}></div>
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;