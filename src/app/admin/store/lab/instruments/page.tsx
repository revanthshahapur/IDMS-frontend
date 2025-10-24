'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminStore from '@/app/components/AdminStore';
import { ArrowLeftIcon, BeakerIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { APIURL } from '@/constants/api';
import { Toaster } from 'react-hot-toast'; // FIX: Removed 'toast' as it was unused

interface LabInstrument {
	id: string;
	name: string;
	productNumber?: string;
	quantity: number;
	category: string;
	location: string;
	lastUpdated: Date | number[];
	condition?: 'new' | 'good' | 'fair' | 'poor';
	itemCondition?: string;
	calibrationDate?: Date;
	status?: 'operational' | 'maintenance' | 'out_of_order';
}

// API response interface to match backend structure
interface ApiLabInstrument {
	id: string;
	name: string;
	productNumber?: string;
	quantity: number;
	category: string;
	location: string;
	lastUpdated: string | number[];
	itemCondition: string;
	calibrationDate?: string;
	status?: string;
}

const API_BASE_URL = APIURL +'/store/lab/instruments';

export default function LabInstrumentsPage() {
	const [items, setItems] = useState<LabInstrument[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isInitialLoad, setIsInitialLoad] = useState(true);


	const categories = ['Optical', 'Separation', 'Measurement', 'Analysis', 'Electronics', 'Other'];

	// Map condition values between API and internal formats
	const mapCondition = (apiCondition: string): LabInstrument['condition'] => {
		const conditionMap: Record<string, LabInstrument['condition']> = {
			'New': 'new',
			'Good': 'good',
			'Fair': 'fair',
			'Poor': 'poor',
			'new': 'new',
			'good': 'good',
			'fair': 'fair',
			'poor': 'poor',
		};
		return conditionMap[apiCondition] || 'good';
	};

	// Fetch all items from API
	const fetchItems = useCallback(async () => {
		// Transform API response to internal format
		const transformApiToInternal = (apiItem: ApiLabInstrument): LabInstrument => ({
			id: apiItem.id || `instrument-${Math.random().toString(36).substr(2, 9)}`,
			name: apiItem.name,
			productNumber: apiItem.productNumber,
			quantity: apiItem.quantity,
			category: apiItem.category,
			location: apiItem.location,
			lastUpdated: Array.isArray(apiItem.lastUpdated) ? apiItem.lastUpdated : new Date(apiItem.lastUpdated),
			condition: mapCondition(apiItem.itemCondition),
			itemCondition: apiItem.itemCondition,
			calibrationDate: apiItem.calibrationDate ? new Date(apiItem.calibrationDate) : undefined,
			status: apiItem.status as LabInstrument['status'] || 'operational',
		});

		try {
			if (isInitialLoad) {
				setLoading(true);
			}
			setError(null);
			
			const response = await fetch(API_BASE_URL);
			if (!response.ok) {
				throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
			}
			
			const data: ApiLabInstrument[] = await response.json();
			const transformedItems = data.map(transformApiToInternal);
			setItems(transformedItems);
		} catch (err) {
			console.error('Error fetching items:', err);
			setError(err instanceof Error ? err.message : 'Failed to fetch items');
			setItems([]); // Ensure items are cleared on error
		} finally {
			setLoading(false);
			setIsInitialLoad(false);
		}
	}, [isInitialLoad]);

	// Load items on component mount
	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const handleRetry = () => {
		setIsInitialLoad(true);
		fetchItems();
	};

	if (isInitialLoad && loading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Link href="/admin/store" className="flex items-center text-gray-600 hover:text-gray-900">
					<ArrowLeftIcon className="w-5 h-5 mr-2" />
					Back to Dashboard
				</Link>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<span className="ml-3 text-lg text-gray-600">Loading lab instruments...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-transparent">
			<Toaster position="top-right" />
			
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header Section */}
				<div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-slate-800 dark:to-indigo-900 shadow-xl border-b border-blue-200 dark:border-indigo-700 rounded-2xl p-6 mb-8">
					<Link href="/admin/store" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
						<ArrowLeftIcon className="w-5 h-5 mr-2" />
						Back to Dashboard
					</Link>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-lg">
								<BeakerIcon className="h-10 w-10 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Lab Instruments </h1>
								<p className="text-base text-gray-600 dark:text-gray-300 mt-1">View and manage all lab instruments</p>
							</div>
						</div>
						<div className="hidden md:flex items-center space-x-4">
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600 dark:text-green-400">{items.length}</div>
								<div className="text-xs text-gray-500 dark:text-gray-400">Total Items</div>
							</div>
						</div>
					</div>
				</div>

				{/* Content Section */}
				{error ? (
					<div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-2xl p-6 mb-8">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800 dark:text-red-200">API Error</h3>
								<div className="mt-2 text-sm text-red-700 dark:text-red-300">
									<p>{error}</p>
								</div>
								<div className="mt-4">
									<button
										type="button"
										onClick={handleRetry}
										className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
									>
										Retry Connection
									</button>
								</div>
							</div>
						</div>
					</div>
				) : (
					<AdminStore
						title="Lab Instruments"
						items={items}
						categories={categories}
					/>
				)}
			</div>
		</div>
	);
}