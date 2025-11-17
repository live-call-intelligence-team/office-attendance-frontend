// src/utils/salaryCalculator.js

import { getWorkingDaysInMonth, isWeekOff } from './dateUtils';

/**
 * Calculate per day salary
 */
export const calculatePerDaySalary = (monthlySalary, year, month) => {
    const workingDays = getWorkingDaysInMonth(year, month);
    return monthlySalary / workingDays.length;
};

/**
 * Calculate salary deduction for absent days
 */
export const calculateAbsentDeduction = (monthlySalary, absentDays, year, month) => {
    const perDaySalary = calculatePerDaySalary(monthlySalary, year, month);
    return perDaySalary * absentDays;
};

/**
 * Calculate salary deduction for half days
 */
export const calculateHalfDayDeduction = (monthlySalary, halfDays, year, month) => {
    const perDaySalary = calculatePerDaySalary(monthlySalary, year, month);
    return (perDaySalary * halfDays) / 2;
};

/**
 * Calculate salary deduction for unpaid leaves
 */
export const calculateUnpaidLeaveDeduction = (monthlySalary, unpaidLeaveDays, year, month) => {
    const perDaySalary = calculatePerDaySalary(monthlySalary, year, month);
    return perDaySalary * unpaidLeaveDays;
};

/**
 * Calculate total salary deductions
 */
export const calculateTotalDeductions = (
    monthlySalary,
    absentDays = 0,
    halfDays = 0,
    unpaidLeaveDays = 0,
    year,
    month
) => {
    const absentDeduction = calculateAbsentDeduction(monthlySalary, absentDays, year, month);
    const halfDayDeduction = calculateHalfDayDeduction(monthlySalary, halfDays, year, month);
    const unpaidLeaveDeduction = calculateUnpaidLeaveDeduction(monthlySalary, unpaidLeaveDays, year, month);

    return {
        absentDeduction,
        halfDayDeduction,
        unpaidLeaveDeduction,
        totalDeduction: absentDeduction + halfDayDeduction + unpaidLeaveDeduction,
    };
};

/**
 * Calculate net salary
 */
export const calculateNetSalary = (
    monthlySalary,
    absentDays = 0,
    halfDays = 0,
    unpaidLeaveDays = 0,
    year,
    month,
    additionalDeductions = 0,
    bonuses = 0
) => {
    const deductions = calculateTotalDeductions(
        monthlySalary,
        absentDays,
        halfDays,
        unpaidLeaveDays,
        year,
        month
    );

    const netSalary = monthlySalary - deductions.totalDeduction - additionalDeductions + bonuses;

    return {
        monthlySalary,
        deductions: {
            ...deductions,
            additionalDeductions,
        },
        bonuses,
        netSalary: Math.max(netSalary, 0), // Ensure salary doesn't go negative
    };
};

/**
 * Calculate attendance percentage
 */
export const calculateAttendancePercentage = (presentDays, totalWorkingDays) => {
    if (totalWorkingDays === 0) return 0;
    return Math.round((presentDays / totalWorkingDays) * 100);
};

/**
 * Count attendance by status
 */
export const countAttendanceByStatus = (attendanceRecords) => {
    const counts = {
        present: 0,
        absent: 0,
        halfDay: 0,
        leave: 0,
        wfh: 0,
        holiday: 0,
        weekOff: 0,
    };

    attendanceRecords.forEach((record) => {
        switch (record.status) {
            case 'PRESENT':
                counts.present++;
                break;
            case 'ABSENT':
                counts.absent++;
                break;
            case 'HALF_DAY':
                counts.halfDay++;
                break;
            case 'LEAVE':
                counts.leave++;
                break;
            case 'WFH':
                counts.wfh++;
                break;
            case 'HOLIDAY':
                counts.holiday++;
                break;
            case 'WEEK_OFF':
                counts.weekOff++;
                break;
            default:
                break;
        }
    });

    return counts;
};

/**
 * Calculate leave balance
 */
export const calculateLeaveBalance = (totalLeaves, usedLeaves) => {
    return {
        total: totalLeaves,
        used: usedLeaves,
        remaining: Math.max(totalLeaves - usedLeaves, 0),
    };
};

/**
 * Calculate overtime pay (if applicable)
 */
export const calculateOvertimePay = (
    monthlySalary,
    overtimeHours,
    year,
    month,
    overtimeRate = 1.5
) => {
    const workingDays = getWorkingDaysInMonth(year, month);
    const standardHoursPerDay = 9; // 9 hours per day
    const totalStandardHours = workingDays.length * standardHoursPerDay;

    const hourlyRate = monthlySalary / totalStandardHours;
    const overtimePay = hourlyRate * overtimeHours * overtimeRate;

    return overtimePay;
};

/**
 * Calculate bonus based on performance
 */
export const calculatePerformanceBonus = (
    monthlySalary,
    attendancePercentage,
    taskCompletionRate,
    punctualityScore
) => {
    let bonusPercentage = 0;

    // Excellent performance (>95% attendance, >90% tasks, >90% punctuality)
    if (attendancePercentage >= 95 && taskCompletionRate >= 90 && punctualityScore >= 90) {
        bonusPercentage = 10; // 10% bonus
    }
    // Good performance (>90% attendance, >80% tasks, >80% punctuality)
    else if (attendancePercentage >= 90 && taskCompletionRate >= 80 && punctualityScore >= 80) {
        bonusPercentage = 5; // 5% bonus
    }
    // Average performance (>85% attendance, >70% tasks, >70% punctuality)
    else if (attendancePercentage >= 85 && taskCompletionRate >= 70 && punctualityScore >= 70) {
        bonusPercentage = 2; // 2% bonus
    }

    return (monthlySalary * bonusPercentage) / 100;
};

/**
 * Generate salary slip data
 */
export const generateSalarySlip = (
    employee,
    attendanceData,
    year,
    month
) => {
    const {
        monthlySalary,
        name,
        employeeId,
        department,
    } = employee;

    const {
        presentDays = 0,
        absentDays = 0,
        halfDays = 0,
        unpaidLeaveDays = 0,
        paidLeaveDays = 0,
        wfhDays = 0,
        totalWorkingDays = 0,
        overtimeHours = 0,
    } = attendanceData;

    // Calculate deductions
    const deductions = calculateTotalDeductions(
        monthlySalary,
        absentDays,
        halfDays,
        unpaidLeaveDays,
        year,
        month
    );

    // Calculate overtime
    const overtimePay = calculateOvertimePay(monthlySalary, overtimeHours, year, month);

    // Calculate attendance percentage
    const attendancePercentage = calculateAttendancePercentage(
        presentDays + paidLeaveDays + wfhDays,
        totalWorkingDays
    );

    // Calculate net salary
    const grossSalary = monthlySalary;
    const totalDeductions = deductions.totalDeduction;
    const netSalary = grossSalary - totalDeductions + overtimePay;

    return {
        employee: {
            name,
            employeeId,
            department,
        },
        period: {
            month,
            year,
        },
        attendance: {
            totalWorkingDays,
            presentDays,
            absentDays,
            halfDays,
            paidLeaveDays,
            unpaidLeaveDays,
            wfhDays,
            attendancePercentage,
        },
        salary: {
            grossSalary,
            deductions: {
                absentDeduction: deductions.absentDeduction,
                halfDayDeduction: deductions.halfDayDeduction,
                unpaidLeaveDeduction: deductions.unpaidLeaveDeduction,
                totalDeductions,
            },
            additions: {
                overtimePay,
            },
            netSalary: Math.round(netSalary),
        },
        generatedDate: new Date().toISOString(),
    };
};

/**
 * Calculate prorated salary for mid-month joiners
 */
export const calculateProratedSalary = (
    monthlySalary,
    joiningDate,
    year,
    month
) => {
    const workingDays = getWorkingDaysInMonth(year, month);
    const perDaySalary = monthlySalary / workingDays.length;

    // Count working days from joining date to end of month
    const joining = new Date(joiningDate);
    let workingDaysFromJoining = 0;

    workingDays.forEach((day) => {
        if (day >= joining) {
            workingDaysFromJoining++;
        }
    });

    return perDaySalary * workingDaysFromJoining;
};

