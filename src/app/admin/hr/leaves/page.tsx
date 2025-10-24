'use client';

import { APIURL } from '@/constants/api';
import React, { useState, useEffect } from 'react';
import {
	// FIX: Removed unused imports: Users, TrendingUp, Building, Briefcase, Search, Mail, Award, CheckCircle, UserPlus, GraduationCap, Calendar
} from 'lucide-react'; 

interface Leave {
	id: string;
	employeeId?: string;
	name: string;
	type: string;
	startDate: string;
	endDate: string;
	days: number;
	status: 'approved' | 'pending' | 'rejected';
	reason: string;
	rejectionReason?: string;
}

interface Holiday {
	name: string;
	date: string;
	day: string;
	type: string;
	coverage: string;
	id?: string;
}

interface LeaveData {
	approved: Leave[];
	pending: Leave[];
	rejected: Leave[];
	holidays: Holiday[];
}

interface StatusBadgeProps {
	status: 'approved' | 'pending' | 'rejected' | 'holiday';
}

interface ActionButtonProps {
	variant: 'approve' | 'reject' | 'view';
	onClick: () => void;
	children: React.ReactNode;
}

interface LeaveTableProps {
	leaves: Leave[] | Holiday[];
	isHoliday?: boolean;
}

// Add raw types for API mapping
type RawLeave = {
	id: string;
	employeeId?: string;
	employeeName?: string;
	leaveType: string;
	startDate: string;
	endDate: string;
	numberOfDays: number;
	status: string;
	reason: string;
	hrComments?: string;
};

type RawHoliday = {
	holidayName: string;
	startDate: string;
	day: string;
	type: string;
	coverage: string;
	id: string;
};

const LeaveManagementSystem = () => {
	const [leaveData, setLeaveData] = useState<LeaveData>({
		approved: [],
		pending: [],
		rejected: [],
		holidays: [
			{
				name: 'Independence Day',
				date: '2025-07-04',
				day: 'Friday',
				type: 'National Holiday',
				coverage: 'All Employees',
			},
			{
				name: 'Labor Day',
				date: '2025-09-01',
				day: 'Monday',
				type: 'National Holiday',
				coverage: 'All Employees',
			},
			{
				name: 'Thanksgiving',
				date: '2025-11-27',
				day: 'Thursday',
				type: 'National Holiday',
				coverage: 'All Employees',
			},
			{
				name: 'Christmas Day',
				date: '2025-12-25',
				day: 'Thursday',
				type: 'National Holiday',
				coverage: 'All Employees',
			},
		],
	});

	const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
	const [showDetailsModal, setShowDetailsModal] = useState(false);

	// Fetch leave requests from API and update non-approved leaves
	useEffect(() => {
		const fetchLeaves = async () => {
			try {
				const res = await fetch(APIURL + '/api/leave-requests/hr/all');
				if (!res.ok) throw new Error('Failed to fetch leave requests');
				const apiLeaves = await res.json();
				// Map API data to Leave interface
				const mappedLeaves = apiLeaves.map((item: RawLeave) => ({
					id: item.id,
					employeeId: item.employeeId,
					name: item.employeeName || '',
					type: item.leaveType,
					startDate: item.startDate,
					endDate: item.endDate,
					days: item.numberOfDays,
					status: (item.status ? item.status.toLowerCase() : 'pending') as
						| 'approved'
						| 'pending'
						| 'rejected',
					reason: item.reason,
					rejectionReason: item.status === 'REJECTED' ? item.hrComments : undefined,
				}));
				// Separate into approved, pending and rejected
				const approved = mappedLeaves.filter((l: Leave) => l.status === 'approved');
				const pending = mappedLeaves.filter((l: Leave) => l.status === 'pending');
				const rejected = mappedLeaves.filter((l: Leave) => l.status === 'rejected');
				setLeaveData((prev) => ({
					...prev,
					approved,
					pending,
					rejected,
				}));
			} catch (error) {
				// Optionally handle error
				console.error(error);
			}
		};
		fetchLeaves();
	}, []);

	const viewDetails = (empId: string) => {
		const leave = [...leaveData.approved, ...leaveData.pending, ...leaveData.rejected].find(
			(l) => l.id === empId
		);
		if (leave) {
			setSelectedLeave(leave);
			setShowDetailsModal(true);
		}
	};

	// Fetch holidays from API
	useEffect(() => {
		const fetchHolidays = async () => {
			try {
				const res = await fetch(APIURL + '/api/holidays');
				if (!res.ok) throw new Error('Failed to fetch holidays');
				const apiHolidays = await res.json();
				// Map API data to Holiday interface
				const mappedHolidays = apiHolidays.map((item: RawHoliday) => ({
					name: item.holidayName,
					date: item.startDate,
					day: item.day,
					type: item.type,
					coverage: item.coverage,
					id: item.id, // for actions
				}));
				setLeaveData((prev) => ({
					...prev,
					holidays: mappedHolidays,
				}));
			} catch (error) {
				console.error(error);
			}
		};
		fetchHolidays();
	}, []);

	const StatusBadge = ({ status }: StatusBadgeProps) => {
		const statusClasses = {
			approved: 'bg-green-100 text-green-800 border-green-200',
			rejected: 'bg-red-100 text-red-800 border-red-200',
			pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
			holiday: 'bg-orange-100 text-orange-800 border-orange-200',
		};

		return (
			<span
				className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${statusClasses[status]}`}
			>
				{status}
			</span>
		);
	};

	const ActionButton = ({ variant, onClick, children }: ActionButtonProps) => {
		const variants = {
			approve: 'bg-green-500 hover:bg-green-600 text-white',
			reject: 'bg-red-500 hover:bg-red-600 text-white',
			view: 'bg-blue-500 hover:bg-blue-600 text-white',
		};

		return (
			<button
				onClick={onClick}
				className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 ${variants[variant]}`}
			>
				{children}
			</button>
		);
	};

	const LeaveTable = ({ leaves, isHoliday = false }: LeaveTableProps) => (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden">
			{/* Desktop Table View */}
			<div className="hidden sm:block overflow-x-auto">
				<table className="w-full min-w-[700px]">
					<thead className="bg-gray-200 text-gray-700">
						<tr>
							{isHoliday ? (
								<>
									<th className="px-4 py-3 text-left font-semibold">Holiday Name</th>
									<th className="px-4 py-3 text-left font-semibold">Date</th>
									<th className="px-4 py-3 text-left font-semibold">Day</th>
									<th className="px-4 py-3 text-left font-semibold">Type</th>
									<th className="px-4 py-3 text-left font-semibold">Status</th>
									<th className="px-4 py-3 text-left font-semibold">Coverage</th>
								</>
							) : (
								<>
									<th className="px-4 py-3 text-left font-semibold">Employee ID</th>
									<th className="px-4 py-3 text-left font-semibold">Employee Name</th>
									<th className="px-4 py-3 text-left font-semibold">Leave Type</th>
									<th className="px-4 py-3 text-left font-semibold">Start Date</th>
									<th className="px-4 py-3 text-left font-semibold">End Date</th>
									<th className="px-4 py-3 text-left font-semibold">Days</th>
									<th className="px-4 py-3 text-left font-semibold">Status</th>
									<th className="px-4 py-3 text-left font-semibold">Actions</th>
								</>
							)}
						</tr>
					</thead>
					<tbody>
						{isHoliday
							? (leaves as Holiday[]).map((holiday, index) => (
								<tr
									key={holiday.id || index}
									className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
								>
									<td className="px-4 py-3">{holiday.name}</td>
									<td className="px-4 py-3">{holiday.date}</td>
									<td className="px-4 py-3">{holiday.day}</td>
									<td className="px-4 py-3">{holiday.type}</td>
									<td className="px-4 py-3">
										<StatusBadge status="holiday" />
									</td>
									<td className="px-4 py-3">{holiday.coverage}</td>
								</tr>
							))
							: (leaves as Leave[]).map((leave) => (
								<tr
									key={leave.id}
									className="hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
								>
									<td className="px-4 py-3 font-medium">{leave.employeeId || leave.id}</td>
									<td className="px-4 py-3">{leave.name}</td>
									<td className="px-4 py-3">{leave.type}</td>
									<td className="px-4 py-3">{leave.startDate}</td>
									<td className="px-4 py-3">{leave.endDate}</td>
									<td className="px-4 py-3">{leave.days}</td>
									<td className="px-4 py-3">
										<StatusBadge status={leave.status} />
									</td>
									<td className="px-4 py-3">
										<div className="flex gap-2">
											<ActionButton variant="view" onClick={() => viewDetails(leave.id)}>
												View
											</ActionButton>
										</div>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			{/* Mobile Card View */}
			<div className="sm:hidden space-y-4 p-4">
				{isHoliday
					? (leaves as Holiday[]).map((holiday, index) => (
						<div
							key={holiday.id || index}
							className="bg-white rounded-lg shadow p-4 border border-gray-200"
						>
							<div className="flex justify-between items-center mb-2">
								<h4 className="font-semibold text-gray-900">{holiday.name}</h4>
								<StatusBadge status="holiday" />
							</div>
							<div className="space-y-1 text-sm text-gray-600">
								<p>
									<span className="font-medium">Date:</span> {holiday.date}
								</p>
								<p>
									<span className="font-medium">Day:</span> {holiday.day}
								</p>
								<p>
									<span className="font-medium">Type:</span> {holiday.type}
								</p>
								<p>
									<span className="font-medium">Coverage:</span> {holiday.coverage}
								</p>
							</div>
						</div>
					))
					: (leaves as Leave[]).map((leave) => (
						<div
							key={leave.id}
							className="bg-white rounded-lg shadow p-4 border border-gray-200"
						>
							<div className="flex justify-between items-center mb-2">
								<h4 className="font-semibold text-gray-900">{leave.name}</h4>
								<StatusBadge status={leave.status} />
							</div>
							<div className="space-y-1 text-sm text-gray-600">
								<p>
									<span className="font-medium">ID:</span> {leave.employeeId || leave.id}
								</p>
								<p>
									<span className="font-medium">Type:</span> {leave.type}
								</p>
								<p>
									<span className="font-medium">Dates:</span> {leave.startDate} to {leave.endDate}
								</p>
								<p>
									<span className="font-medium">Days:</span> {leave.days}
								</p>
							</div>
							<div className="mt-3 flex gap-2">
								<ActionButton variant="view" onClick={() => viewDetails(leave.id)}>
									View Details
								</ActionButton>
							</div>
						</div>
					))}
			</div>
		</div>
	);

	const totalLeaves = leaveData.approved.length + leaveData.pending.length + leaveData.rejected.length;
	const approvedCount = leaveData.approved.length;
	const pendingCount = leaveData.pending.length;

	return (
		<div className="min-h-screen p-4 sm:p-6 bg-transparent">
			<div className="max-w-7xl mx-auto bg-white/80 rounded-3xl shadow-2xl p-4 sm:p-8">
				{/* Header */}
				<div className="text-center mb-6 sm:mb-10 pb-4 sm:pb-6 border-b-4 border-gray-200">
					<h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4 drop-shadow-lg">
						HR Leave Management System
					</h1>
					<p className="text-sm sm:text-xl text-gray-600">
						Manage employee leave requests efficiently and transparently
					</p>
				</div>

				{/* Layout Container */}
				<div className="flex flex-col gap-6 sm:gap-8">
					{/* Main Content */}
					<div className="flex-1">
						{/* Stats Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
							<div className="bg-white text-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-all duration-300">
								<h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{totalLeaves}</h3>
								<p className="text-base sm:text-lg opacity-90">Total Leave Requests</p>
							</div>
							<div className="bg-white text-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-all duration-300">
								<h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{approvedCount}</h3>
								<p className="text-base sm:text-lg opacity-90">Approved Leaves</p>
							</div>
							<div className="bg-white text-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border-t-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
								<h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{pendingCount}</h3>
								<p className="text-base sm:text-lg opacity-90">Pending Requests</p>
							</div>
						</div>

						{/* Approved Leaves Section */}
						<div className="mb-6 sm:mb-10 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-8 border-green-500">
							<div className="flex items-center mb-4 sm:mb-6">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4">
									✓
								</div>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-800">Approved Leaves</h2>
							</div>
							<LeaveTable leaves={leaveData.approved} />
						</div>

						{/* Non-Approved Leaves Section */}
						<div className="mb-6 sm:mb-10 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-8 border-red-500">
							<div className="flex items-center mb-4 sm:mb-6">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4">
									✗
								</div>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-800">Non-Approved Leaves</h2>
							</div>
							<LeaveTable leaves={[...leaveData.pending, ...leaveData.rejected]} />
						</div>

						{/* Holiday Leaves Section */}
						<div className="mb-6 sm:mb-10 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-l-8 border-orange-500">
							<div className="flex items-center justify-between mb-4 sm:mb-6">
								<div className="flex items-center">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4">
										🎉
									</div>
									<h2 className="text-xl sm:text-2xl font-bold text-gray-800">Holiday Leaves</h2>
								</div>
							</div>
							<LeaveTable leaves={leaveData.holidays} isHoliday={true} />
						</div>
					</div>
				</div>

				{/* Details Modal */}
				{showDetailsModal && selectedLeave && (
					<div className="fixed inset-0 bg-gray-200/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-xl p-6 sm:p-8 max-w-2xl w-full mx-auto shadow-2xl transform transition-all">
							<div className="flex justify-between items-center mb-4 sm:mb-6">
								<h3 className="text-xl sm:text-2xl font-bold text-gray-800">Leave Details</h3>
								<button
									onClick={() => setShowDetailsModal(false)}
									className="text-gray-500 hover:text-gray-700 transition-colors text-xl"
								>
									✕
								</button>
							</div>
							<div className="space-y-3 sm:space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
									<div>
										<p className="text-xs sm:text-sm text-gray-500">Employee ID</p>
										<p className="font-medium text-sm sm:text-base">{selectedLeave.id}</p>
									</div>
									<div>
										<p className="text-xs sm:text-sm text-gray-500">Employee Name</p>
										<p className="font-medium text-sm sm:text-base">{selectedLeave.name}</p>
									</div>
									<div>
										<p className="text-xs sm:text-sm text-gray-500">Leave Type</p>
										<p className="font-medium text-sm sm:text-base">{selectedLeave.type}</p>
									</div>
									<div>
										<p className="text-xs sm:text-sm text-gray-500">Status</p>
										<p className="font-medium text-sm sm:text-base">
											<StatusBadge status={selectedLeave.status} />
										</p>
									</div>
									<div>
										<p className="text-xs sm:text-sm text-gray-500">Start Date</p>
										<p className="font-medium text-sm sm:text-base">{selectedLeave.startDate}</p>
									</div>
									<div>
										<p className="text-xs sm:text-sm text-gray-500">End Date</p>
										<p className="font-medium text-sm sm:text-base">{selectedLeave.endDate}</p>
									</div>
									<div>
										<p className="text-xs sm:text-sm text-gray-500">Duration</p>
										<p className="font-medium text-sm sm:text-base">{selectedLeave.days} days</p>
									</div>
									<div className="col-span-1 sm:col-span-2">
										<p className="text-xs sm:text-sm text-gray-500">Reason for Leave</p>
										<p className="font-medium text-sm sm:text-base">{selectedLeave.reason}</p>
									</div>
									{selectedLeave.status === 'rejected' && selectedLeave.rejectionReason && (
										<div className="col-span-1 sm:col-span-2">
											<p className="text-xs sm:text-sm text-gray-500">Rejection Reason</p>
											<p className="font-medium text-sm sm:text-base text-red-600">
												{selectedLeave.rejectionReason}
											</p>
										</div>
									)}
								</div>
							</div>
							<div className="mt-4 sm:mt-6 flex justify-end">
								<button
									onClick={() => setShowDetailsModal(false)}
									className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default LeaveManagementSystem;