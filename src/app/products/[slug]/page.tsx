'use client';

import { notFound } from 'next/navigation';
import { Database, Users, DollarSign, Store, Target, BarChart3, FileText, Shield, Settings } from 'lucide-react';

const productMeta: Record<string, { title: string; description: string; icon: any; }> = {
  'data-management': { title: 'Data Management', description: 'Centralize and organize all your business data in one secure platform.', icon: Database },
  'hr-management': { title: 'HR Management', description: 'Complete human resource management from hiring to retirement.', icon: Users },
  'finance-accounting': { title: 'Finance & Accounting', description: 'Streamlined financial management and accounting solutions.', icon: DollarSign },
  'inventory-management': { title: 'Inventory Management', description: 'Track and manage your inventory with real-time insights.', icon: Store },
  'project-management': { title: 'Project Management', description: 'Plan, execute, and track projects with advanced tools.', icon: Target },
  'analytics-reporting': { title: 'Analytics & Reporting', description: 'Powerful analytics and reporting for data-driven decisions.', icon: BarChart3 },
  'document-management': { title: 'Document Management', description: 'Secure document storage and management system.', icon: FileText },
  'compliance-security': { title: 'Compliance & Security', description: 'Ensure data security and regulatory compliance.', icon: Shield },
  'integration-tools': { title: 'Integration Tools', description: 'Seamlessly integrate with your existing business tools.', icon: Settings },
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const meta = productMeta[params.slug];
  if (!meta) return notFound();
  const Icon = meta.icon;
  return (
    <main className="min-h-screen bg-gray-50 pt-28">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Icon className="w-10 h-10 text-blue-600 mr-3" />
          <h1 className="text-4xl font-extrabold text-gray-900">{meta.title}</h1>
        </div>
        <p className="text-lg text-gray-700 max-w-3xl mb-10">{meta.description}</p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key capability #{i + 1}</h3>
              <p className="text-gray-600">Concise explanation of how {meta.title} helps your team deliver better outcomes.</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}


