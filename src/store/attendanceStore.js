// src/store/attendanceStore.js

import { create } from 'zustand';

/**
 * Attendance Store using Zustand
 * Manages attendance-related state
 */
const useAttendanceStore = create((set, get) => ({
    attendanceRecords: [],
    selectedDate: new Date(),
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    loading: false,
    stats: null,

    // Set attendance records
    setAttendanceRecords: (records) => set({ attendanceRecords: records }),

    // Add attendance record
    addAttendanceRecord: (record) =>
        set((state) => ({
            attendanceRecords: [...state.attendanceRecords, record],
        })),

    // Update attendance record
    updateAttendanceRecord: (recordId, updatedData) =>
        set((state) => ({
            attendanceRecords: state.attendanceRecords.map((record) =>
                record._id === recordId ? { ...record, ...updatedData } : record
            ),
        })),

    // Delete attendance record
    deleteAttendanceRecord: (recordId) =>
        set((state) => ({
            attendanceRecords: state.attendanceRecords.filter(
                (record) => record._id !== recordId
            ),
        })),

    // Set selected date
    setSelectedDate: (date) => set({ selectedDate: date }),

    // Set selected month and year
    setSelectedMonth: (month) => set({ selectedMonth: month }),
    setSelectedYear: (year) => set({ selectedYear: year }),

    // Set loading
    setLoading: (loading) => set({ loading }),

    // Set stats
    setStats: (stats) => set({ stats }),

    // Get attendance for specific date
    getAttendanceByDate: (date) => {
        const { attendanceRecords } = get();
        const dateString = date.toISOString().split('T')[0];
        return attendanceRecords.filter((record) => {
            const recordDate = new Date(record.date).toISOString().split('T')[0];
            return recordDate === dateString;
        });
    },

    // Get attendance for specific employee
    getEmployeeAttendance: (employeeId) => {
        const { attendanceRecords } = get();
        return attendanceRecords.filter((record) => record.employeeId === employeeId);
    },

    // Clear attendance records
    clearAttendanceRecords: () => set({ attendanceRecords: [] }),
}));

export default useAttendanceStore;