'use client';

import Link from 'next/link';
import { Database, Users, DollarSign, Store, Target, BarChart3, FileText, Shield, Settings, ArrowRight } from 'lucide-react';

const products = [
  { id: 'data-management', title: 'Data Management', icon: Database, href: '/products/data-management', description: 'Centralize and organize business data securely.' },
  { id: 'hr-management', title: 'HR Management', icon: Users, href: '/products/hr-management', description: 'Manage complete employee lifecycle end-to-end.' },
  { id: 'finance-accounting', title: 'Finance & Accounting', icon: DollarSign, href: '/products/finance-accounting', description: 'Automate finance, compliance and reporting.' },
  { id: 'inventory-management', title: 'Inventory Management', icon: Store, href: '/products/inventory-management', description: 'Real-time inventory tracking and control.' },
  { id: 'project-management', title: 'Project Management', icon: Target, href: '/products/project-management', description: 'Plan and deliver projects effectively.' },
  { id: 'analytics-reporting', title: 'Analytics & Reporting', icon: BarChart3, href: '/products/analytics-reporting', description: 'Insights and dashboards for smarter decisions.' },
  { id: 'document-management', title: 'Document Management', icon: FileText, href: '/products/document-management', description: 'Secure document storage and workflows.' },
  { id: 'compliance-security', title: 'Compliance & Security', icon: Shield, href: '/products/compliance-security', description: 'Security, governance and compliance tools.' },
  { id: 'integration-tools', title: 'Integration Tools', icon: Settings, href: '/products/integration-tools', description: 'APIs and connectors for your stack.' },
];

export default function ProductsIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">All Products</h1>
        <p className="text-gray-600 mb-10">Explore IDMS modules. Pick a product to learn more.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={p.href} className="group p-6 bg-white rounded-xl shadow hover:shadow-lg border border-gray-100 transition-all">
              <div className="flex items-start">
                <p.icon className="w-8 h-8 text-blue-600 mt-1 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700">{p.title}</h3>
                  <p className="text-gray-600 mt-1">{p.description}</p>
                  <span className="inline-flex items-center text-blue-600 mt-3 font-medium">Learn more <ArrowRight className="w-4 h-4 ml-1" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


