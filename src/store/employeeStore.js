// src/store/employeeStore.js

import { create } from 'zustand';

/**
 * Employee Store using Zustand
 * Manages employee-related state
 */
const useEmployeeStore = create((set, get) => ({
    employees: [],
    selectedEmployee: null,
    loading: false,
    filters: {
        department: '',
        status: 'all',
        searchTerm: '',
    },

    // Set employees
    setEmployees: (employees) => set({ employees }),

    // Add employee
    addEmployee: (employee) =>
        set((state) => ({
            employees: [...state.employees, employee],
        })),

    // Update employee
    updateEmployee: (employeeId, updatedData) =>
        set((state) => ({
            employees: state.employees.map((emp) =>
                emp._id === employeeId ? { ...emp, ...updatedData } : emp
            ),
        })),

    // Delete employee
    deleteEmployee: (employeeId) =>
        set((state) => ({
            employees: state.employees.filter((emp) => emp._id !== employeeId),
        })),

    // Set selected employee
    setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),

    // Clear selected employee
    clearSelectedEmployee: () => set({ selectedEmployee: null }),

    // Set loading
    setLoading: (loading) => set({ loading }),

    // Set filters
    setFilters: (filters) =>
        set((state) => ({
            filters: { ...state.filters, ...filters },
        })),

    // Reset filters
    resetFilters: () =>
        set({
            filters: {
                department: '',
                status: 'all',
                searchTerm: '',
            },
        }),

    // Get filtered employees
    getFilteredEmployees: () => {
        const { employees, filters } = get();
        let filtered = [...employees];

        // Filter by department
        if (filters.department) {
            filtered = filtered.filter((emp) => emp.department === filters.department);
        }

        // Filter by status
        if (filters.status !== 'all') {
            filtered = filtered.filter((emp) => emp.status === filters.status);
        }

        // Filter by search term
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (emp) =>
                    emp.name.toLowerCase().includes(searchLower) ||
                    emp.employeeId.toLowerCase().includes(searchLower) ||
                    emp.email.toLowerCase().includes(searchLower)
            );
        }

        return filtered;
    },
}));

export default useEmployeeStore;