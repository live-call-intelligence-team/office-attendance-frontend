// src/services/exportService.js

import { apiHelper } from './api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export Service
 * Handles data export functionality (CSV, PDF, Excel)
 */

const exportService = {
    /**
     * Export data to CSV
     */
    exportToCSV: (data, filename = 'export.csv') => {
        try {
            if (!data || data.length === 0) {
                throw new Error('No data to export');
            }

            // Get headers from first object
            const headers = Object.keys(data[0]);

            // Create CSV content
            let csvContent = headers.join(',') + '\n';

            data.forEach((row) => {
                const values = headers.map((header) => {
                    const value = row[header];
                    // Handle values with commas or quotes
                    if (value && (value.toString().includes(',') || value.toString().includes('"'))) {
                        return `"${value.toString().replace(/"/g, '""')}"`;
                    }
                    return value || '';
                });
                csvContent += values.join(',') + '\n';
            });

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return { success: true, message: 'CSV exported successfully' };
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            throw error;
        }
    },

    /**
     * Export data to PDF
     */
    exportToPDF: (data, filename = 'export.pdf', title = 'Report') => {
        try {
            if (!data || data.length === 0) {
                throw new Error('No data to export');
            }

            const doc = new jsPDF();

            // Add title
            doc.setFontSize(16);
            doc.text(title, 14, 20);

            // Add date
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            // Get headers and rows
            const headers = Object.keys(data[0]);
            const rows = data.map((row) => headers.map((header) => row[header] || ''));

            // Add table
            doc.autoTable({
                head: [headers],
                body: rows,
                startY: 40,
                theme: 'grid',
                headStyles: {
                    fillColor: [59, 130, 246], // Blue color
                    textColor: 255,
                    fontStyle: 'bold',
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250],
                },
            });

            // Save PDF
            doc.save(filename);

            return { success: true, message: 'PDF exported successfully' };
        } catch (error) {
            console.error('Error exporting to PDF:', error);
            throw error;
        }
    },

    /**
     * Export attendance report
     */
    exportAttendanceReport: async (startDate, endDate, format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/export/attendance?startDate=${startDate}&endDate=${endDate}&format=${format}`,
                `attendance_report_${startDate}_to_${endDate}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export employee list
     */
    exportEmployeeList: async (format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/export/employees?format=${format}`,
                `employee_list.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export leave report
     */
    exportLeaveReport: async (startDate, endDate, format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/export/leaves?startDate=${startDate}&endDate=${endDate}&format=${format}`,
                `leave_report_${startDate}_to_${endDate}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export task report
     */
    exportTaskReport: async (startDate, endDate, format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/export/tasks?startDate=${startDate}&endDate=${endDate}&format=${format}`,
                `task_report_${startDate}_to_${endDate}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export salary slip
     */
    exportSalarySlip: async (employeeId, month, year, format = 'pdf') => {
        try {
            const response = await apiHelper.download(
                `/export/salary-slip?employeeId=${employeeId}&month=${month}&year=${year}&format=${format}`,
                `salary_slip_${month}_${year}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Generate and export custom report
     */
    exportCustomReport: async (reportConfig, format = 'pdf') => {
        try {
            const response = await apiHelper.post(
                `/export/custom-report?format=${format}`,
                reportConfig,
                { responseType: 'blob' }
            );

            // Create download
            const blob = new Blob([response.data]);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `custom_report.${format}`;
            link.click();

            return { success: true, message: 'Report exported successfully' };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export analytics dashboard
     */
    exportAnalyticsDashboard: async (filters = {}, format = 'pdf') => {
        try {
            const queryParams = new URLSearchParams({ ...filters, format }).toString();
            const response = await apiHelper.download(
                `/export/analytics-dashboard?${queryParams}`,
                `analytics_dashboard.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Export working hours report
     */
    exportWorkingHoursReport: async (employeeId, startDate, endDate, format = 'csv') => {
        try {
            const response = await apiHelper.download(
                `/export/working-hours?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}&format=${format}`,
                `working_hours_${startDate}_to_${endDate}.${format}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default exportService;