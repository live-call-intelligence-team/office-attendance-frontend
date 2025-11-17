// src/components/common/DateRangePicker.jsx

import { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { formatDate } from '../../utils/dateUtils';

const DateRangePicker = ({ onDateChange, startDate, endDate }) => {
    const [localStartDate, setLocalStartDate] = useState(
        startDate ? new Date(startDate).toISOString().split('T')[0] : ''
    );
    const [localEndDate, setLocalEndDate] = useState(
        endDate ? new Date(endDate).toISOString().split('T')[0] : ''
    );

    const handleStartDateChange = (e) => {
        const date = e.target.value;
        setLocalStartDate(date);
        if (date && localEndDate) {
            onDateChange(date, localEndDate);
        }
    };

    const handleEndDateChange = (e) => {
        const date = e.target.value;
        setLocalEndDate(date);
        if (localStartDate && date) {
            onDateChange(localStartDate, date);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Start Date */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        value={localStartDate}
                        onChange={handleStartDateChange}
                        max={localEndDate || undefined}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {/* End Date */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        value={localEndDate}
                        onChange={handleEndDateChange}
                        min={localStartDate || undefined}
                        className="input-field pl-10"
                    />
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;