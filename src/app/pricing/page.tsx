'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Database, Users, DollarSign, Store, Target, BarChart3, FileText, Shield, Settings,
  ArrowRight, Menu, X, Phone, Mail, MapPin, Check, Star, Globe, Zap, Heart,
  ChevronRight, CheckCircle, Award, TrendingUp, Building, Clock, CalendarCheck,
  Handshake, BookOpen, LayoutGrid, CheckSquare, ShieldCheck, BarChart, RefreshCw
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  subItems?: NavItem[];
}

// --- Products data and dropdown components (same as landing) ---
interface ProductItemData {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  colorClass: string;
}

const detailedProducts: ProductItemData[] = [
  { id: 'data-management', icon: Database, title: 'Data Management', description: 'Centralize and organize all your business data in one secure platform', href: '/products/data-management', colorClass: 'text-blue-500 bg-blue-500/10' },
  { id: 'hr-management', icon: Users, title: 'HR Management', description: 'Complete human resource management from hiring to retirement', href: '/products/hr-management', colorClass: 'text-green-500 bg-green-500/10' },
  { id: 'finance-accounting', icon: DollarSign, title: 'Finance & Accounting', description: 'Streamlined financial management and accounting solutions', href: '/products/finance-accounting', colorClass: 'text-emerald-500 bg-emerald-500/10' },
  { id: 'inventory-management', icon: Store, title: 'Inventory Management', description: 'Track and manage your inventory with real-time insights', href: '/products/inventory-management', colorClass: 'text-orange-500 bg-orange-500/10' },
  { id: 'project-management', icon: Target, title: 'Project Management', description: 'Plan, execute, and track projects with advanced tools', href: '/products/project-management', colorClass: 'text-purple-500 bg-purple-500/10' },
  { id: 'analytics-reporting', icon: BarChart3, title: 'Analytics & Reporting', description: 'Powerful analytics and reporting for data-driven decisions', href: '/products/analytics-reporting', colorClass: 'text-cyan-500 bg-cyan-500/10' },
  { id: 'document-management', icon: FileText, title: 'Document Management', description: 'Secure document storage and management system', href: '/products/document-management', colorClass: 'text-indigo-500 bg-indigo-500/10' },
  { id: 'compliance-security', icon: Shield, title: 'Compliance & Security', description: 'Ensure data security and regulatory compliance', href: '/products/compliance-security', colorClass: 'text-red-500 bg-red-500/10' },
  { id: 'integration-tools', icon: Settings, title: 'Integration Tools', description: 'Seamlessly integrate with your existing business tools', href: '/products/integration-tools', colorClass: 'text-teal-500 bg-teal-500/10' },
];

interface DropdownProductItemProps extends ProductItemData {
  onClick: (id: string) => void;
}

const DropdownProductItem = ({ icon: Icon, title, description, href, colorClass, onClick, id }: DropdownProductItemProps) => {
  const [iconColor, bgColor] = colorClass.split(' ');
  return (
    <Link
      href={href}
      onClick={() => onClick(id)}
      className="flex p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
    >
      <div className={`mr-4 p-2 rounded-full flex-shrink-0 ${bgColor}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <h5 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h5>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
};

const MegaDropdown = ({ items, onLinkClick, onClose }: { items: ProductItemData[]; onLinkClick: (id: string) => void; onClose: () => void; }) => {
  const col1Count = Math.ceil(items.length / 2);
  const col1 = items.slice(0, col1Count);
  const col2 = items.slice(col1Count);
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 mt-0 w-[650px] rounded-2xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 overflow-hidden" style={{ pointerEvents: 'auto', opacity: 1 }}>
      <div className="grid grid-cols-2 p-5 gap-y-6 gap-x-8">
        <div className="space-y-6 border-r pr-4">
          {col1.map(item => (
            <DropdownProductItem key={item.id} {...item} onClick={(id) => { onLinkClick(id); onClose(); }} />
          ))}
        </div>
        <div className="space-y-6 pl-4">
          {col2.map(item => (
            <DropdownProductItem key={item.id} {...item} onClick={(id) => { onLinkClick(id); onClose(); }} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  additionalPrice?: string;
  features: string[];
  highlighted?: boolean;
  color: string;
  icon: React.ElementType;
}

// Hook for scroll-triggered animations
const useScrollAnimation = (threshold: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element); 
      }
    }, { threshold });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
};

const AnimatedOnScroll = ({ 
    children, 
    animationClass, 
    delayClass = 'delay-0',
    threshold = 0.1,
    className = ''
}: { 
    children: React.ReactNode, 
    animationClass: string, 
    delayClass?: string,
    threshold?: number,
    className?: string
}) => {
    const { ref, isVisible } = useScrollAnimation(threshold);
    
    return (
        <div 
            ref={ref} 
            className={`${className} ${animationClass} ${delayClass} ${isVisible ? 'is-visible' : ''}`}
        >
            {children}
        </div>
    );
};

const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '/', icon: Building },
    { id: 'products', label: 'Products', href: '/products', icon: Database },
    { id: 'solutions', label: 'Solutions', href: '#solutions', icon: Star },
    { id: 'pricing', label: 'Pricing', href: '/pricing', icon: DollarSign },
    { id: 'about', label: 'About', href: '/about', icon: Globe },
    { id: 'contact', label: 'Contact', href: '#contact', icon: Phone },
];

const pricingPlans: PricingPlan[] = [
    {
        id: 'foundation',
        name: 'FOUNDATION',
        description: 'Best for startups getting started with HR digitalization',
        price: 'Custom',
        period: 'pricing',
        additionalPrice: 'Tailored to your needs',
        features: [
            'Employee Data Management',
            'Basic HR Reports',
            'Employee Self-Service Portal',
            'Document Management',
            'Basic Access Control',
            'Email Support',
            'Mobile App Access',
            'Standard Integrations',
            'Data Backup & Recovery',
            'Basic Compliance Tools'
        ],
        color: 'border-blue-500',
        icon: Database
    },
    {
        id: 'professional',
        name: 'PROFESSIONAL',
        description: 'Designed for growing companies needing automation & team management',
        price: 'Custom',
        period: 'pricing',
        additionalPrice: 'Tailored to your needs',
        features: [
            'All Foundation Features+',
            'Advanced HR Analytics',
            'Custom Dashboards',
            'Advanced Access Control',
            'API Access & Webhooks',
            'Priority Support',
            'Advanced Integrations',
            'Custom Reports Builder',
            'Advanced User Roles',
            'Audit Logs & Monitoring',
            'Workflow Automation',
            'Team Management Tools'
        ],
        highlighted: true,
        color: 'border-green-500',
        icon: BarChart3
    },
    {
        id: 'enterprise',
        name: 'ENTERPRISE',
        description: 'Tailored HR suite for large teams with compliance and reporting needs',
        price: 'Custom',
        period: 'pricing',
        additionalPrice: 'Tailored to your needs',
        features: [
            'All Professional Features+',
            'Advanced Compliance Management',
            'Custom Workflows',
            'Advanced Data Processing',
            'Real-time Collaboration',
            'White-label Solutions',
            'Dedicated Account Manager',
            'Custom Training',
            'SLA Guarantee',
            'Advanced Security Controls',
            'Multi-tenant Architecture',
            'Training & Consulting'
        ],
        color: 'border-purple-500',
        icon: Building
    }
];

const faqs = [
    {
        question: "Why don't you show prices publicly?",
        answer: "Because each company has unique needs. We believe in offering the best value through personalized pricing based on your size, features, and support requirements. This ensures you only pay for what you actually need and use."
    },
    {
        question: "Who has access to data and other sensitive information?",
        answer: "IDMS provides robust privacy controls to ensure your data remains secure. Access is restricted to authorized personnel within your organization, and our support team can only view data if explicitly granted permission by you. This level of privacy control is unique to IDMS, setting us apart in the industry."
    },
    {
        question: "Is there a setup or implementation fee?",
        answer: "Yes, a nominal setup fee applies to cover IDMS's comprehensive onboarding process. This includes guided configuration of data management, importing existing data, validating data integrity, and customizing features to suit your needs. Our expert-led onboarding ensures a seamless transition and helps you maximize the platform's potential from day one."
    },
    {
        question: "Can IDMS assist with best practices for data management and compliance?",
        answer: "IDMS provides pre-configured, industry-standard data management structures and can assist with setting up compliance frameworks as part of the onboarding process—at no additional cost. We also offer recommendations for data policies, security management, and other data operations. While we provide guidance, we encourage you to customize these policies to align with your organization's unique needs."
    },
    {
        question: "What kind of support do you provide?",
        answer: "We offer comprehensive support including email support for Foundation plans, priority support for Professional plans, and dedicated 24/7 support for Enterprise customers. Our support team includes data management experts who can help with implementation, troubleshooting, and best practices."
    },
    {
        question: "Do you offer custom integrations?",
        answer: "Yes, we offer a wide range of pre-built integrations with popular business tools. For custom integrations, our Enterprise plan includes custom development services. We also provide API access and webhooks for advanced integration needs."
    }
];

export default function PricingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('pricing');
    const [scrollY, setScrollY] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState('strength');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

    const handleScroll = useCallback(() => {
        setScrollY(window.scrollY);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleFaqToggle = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />

            {/* Header */}
            <header
                className={`fixed top-0 z-50 w-full transition-shadow duration-300 ${
                    scrollY > 50 ? 'bg-white shadow-lg' : 'bg-transparent'
                }`}
            >
                <div className="container mx-auto flex items-center justify-between p-4">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center cursor-pointer group">
                        {/* INCREASED SIZE HERE: w-44 h-16 */}
                        <div className="relative w-44 h-16"> 
                            <Image
                                src="/hrlogo.png" 
                                alt="IDMS Intelligent Data Management System Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                                className="w-full h-full"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden space-x-8 md:flex">
                        {navItems.map((item) => (
                          <div key={item.id} className="relative">
                            {item.id === 'products' ? (
                              <div
                                className="group relative inline-block cursor-pointer"
                                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                                onMouseLeave={() => setIsProductsDropdownOpen(false)}
                              >
                                <Link
                                  href={item.href}
                                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                >
                                  {item.label} <ChevronRight className={`w-4 h-4 ml-1 transform transition-transform ${isProductsDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                                </Link>
                                {isProductsDropdownOpen && (
                                  <MegaDropdown
                                    items={detailedProducts}
                                    onLinkClick={setActiveSection}
                                    onClose={() => setIsProductsDropdownOpen(false)}
                                  />
                                )}
                              </div>
                            ) : item.id === 'about' ? (
                              <div
                                className="group relative inline-block cursor-pointer"
                                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                                onMouseLeave={() => setIsAboutDropdownOpen(false)}
                              >
                                <Link
                                  href={item.href}
                                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                >
                                  {item.label} <ChevronRight className={`w-4 h-4 ml-1 transform transition-transform ${isAboutDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                                </Link>
                                {isAboutDropdownOpen && (
                                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-0 w-56 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 p-2">
                                    <Link href="/about" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg">About</Link>
                                    <Link href="/about/team" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg">Team</Link>
                                    <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg">Contact Us</Link>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                                  activeSection === item.id ? 'text-blue-600 border-b-2 border-blue-600' : ''
                                }`}
                              >
                                {item.label}
                              </Link>
                            )}
                          </div>
                        ))}
                    </nav>

                    {/* Login/Signup Buttons (Desktop) */}
                    <div className="hidden md:flex space-x-4">
                        <a
                            href="#"
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium"
                        >
                            Log In
                        </a>
                        <a
                            href="#"
                            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
                        >
                            Start Free Trial
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    } bg-white shadow-xl`}
                >
                    <div className="flex justify-end p-4">
                        <button className="p-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-2 p-4">
                        {navItems.map((item) => (
                          <div key={item.id} className="w-full">
                            {item.id === 'products' ? (
                              <div className="w-full">
                                <button
                                  className="flex justify-between items-center w-full p-3 text-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                                >
                                  <span className="flex items-center">
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                  </span>
                                  <ChevronRight className={`w-5 h-5 transition-transform ${isProductsDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>
                                {isProductsDropdownOpen && (
                                  <div className="ml-4 border-l pl-4 my-2 space-y-1">
                                    {detailedProducts.slice(0, 3).map((subItem) => (
                                      <Link
                                        key={subItem.id}
                                        href={subItem.href}
                                        onClick={() => {
                                          setActiveSection(subItem.id);
                                          setIsMenuOpen(false);
                                          setIsProductsDropdownOpen(false);
                                        }}
                                        className="flex items-center p-2 text-base text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                                      >
                                        <subItem.icon className="w-4 h-4 mr-2" />
                                        {subItem.title}
                                      </Link>
                                    ))}
                                    <Link
                                      href="/products"
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsProductsDropdownOpen(false);
                                      }}
                                      className="flex items-center p-2 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                                    >
                                      <ArrowRight className="w-4 h-4 mr-2" />
                                      View All Solutions (9)
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ) : item.id === 'about' ? (
                              <div className="w-full">
                                <button
                                  className="flex justify-between items-center w-full p-3 text-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                                  onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                                >
                                  <span className="flex items-center">
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                  </span>
                                  <ChevronRight className={`w-5 h-5 transition-transform ${isAboutDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>
                                {isAboutDropdownOpen && (
                                  <div className="ml-4 border-l pl-4 my-2 space-y-1">
                                    <Link href="/about" onClick={() => { setActiveSection('about'); setIsMenuOpen(false); setIsAboutDropdownOpen(false); }} className="block p-2 text-base text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">About</Link>
                                    <Link href="/about/team" onClick={() => { setActiveSection('about'); setIsMenuOpen(false); setIsAboutDropdownOpen(false); }} className="block p-2 text-base text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Team</Link>
                                    <Link href="/contact" onClick={() => { setActiveSection('contact'); setIsMenuOpen(false); setIsAboutDropdownOpen(false); }} className="block p-2 text-base text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Contact Us</Link>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setActiveSection(item.id);
                                  setIsMenuOpen(false);
                                }}
                                className={`flex items-center p-3 text-lg hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg ${
                                  activeSection === item.id ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700'
                                }`}
                              >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                              </Link>
                            )}
                          </div>
                        ))}
                    </nav>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-cyan-100">
                    <div className="container mx-auto px-4 text-center">
                        <AnimatedOnScroll animationClass="animate-fade-in-down">
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Flexible Pricing for Every <span className="text-blue-600">Business Stage</span>
                            </h1>
                        </AnimatedOnScroll>
                        <AnimatedOnScroll animationClass="animate-fade-in-up" delayClass="delay-200">
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                We're currently offering custom pricing tailored to your business needs. Whether you're a startup or an established company, we'll design the right plan for you.
                            </p>
                        </AnimatedOnScroll>
                        <AnimatedOnScroll animationClass="animate-fade-in-up" delayClass="delay-400">
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
                                    Request Custom Pricing
                                </button>
                                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105">
                                    Schedule a Free Demo
                                </button>
                            </div>
                        </AnimatedOnScroll>
                    </div>
                </section>

                {/* Single Pricing Plan */}
                <section id="pricing" className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <AnimatedOnScroll animationClass="animate-slide-up">
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Custom Pricing — Tailored to Your Needs
                                    </h2>
                                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                        Every organization is unique. That's why we offer flexible pricing based on your team size, features, and goals.
                                    </p>
                                </div>
                            </AnimatedOnScroll>

                            <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-200">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 max-w-2xl mx-auto">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Settings className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom HR Solution</h3>
                                        <p className="text-gray-600 mb-6">
                                            Get a personalized HR management system designed specifically for your business needs.
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">No unnecessary tiers</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">Pay only for what you need</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">Personalized onboarding and support</span>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
                                        Request a Quote
                                    </button>
                                </div>
                            </AnimatedOnScroll>
                                                </div>
                                            </div>
                </section>

                {/* How Pricing Works Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <AnimatedOnScroll animationClass="animate-slide-up">
                                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                                    How Our Pricing Works
                                </h2>
                            </AnimatedOnScroll>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-200">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Tell us about your team</h3>
                                        <p className="text-gray-600">
                                            Share details about your team size, business goals, and specific HR requirements.
                                        </p>
                                    </div>
                                </AnimatedOnScroll>
                                
                                <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-400">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Settings className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">2. We'll recommend the right setup</h3>
                                        <p className="text-gray-600">
                                            Based on your needs, we'll suggest the most relevant features and modules for your organization.
                                        </p>
                                    </div>
                                </AnimatedOnScroll>
                                
                                <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-600">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <DollarSign className="w-8 h-8 text-purple-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">3. You'll receive a personalized quote</h3>
                                        <p className="text-gray-600">
                                            Get a custom quote that includes only what you need — no hidden fees or unnecessary features.
                                        </p>
                                    </div>
                                </AnimatedOnScroll>
                            </div>
                            
                            <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-800">
                                <div className="text-center">
                                    <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
                                        Talk to an Expert
                                    </button>
                                </div>
                            </AnimatedOnScroll>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto">
                            <AnimatedOnScroll animationClass="animate-slide-up">
                                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                                    Frequently asked questions
                                </h2>
                            </AnimatedOnScroll>

                            <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-200">
                                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                                    <button
                                        className="w-full text-left flex justify-between items-center hover:bg-gray-50 transition-colors rounded-lg p-4"
                                        onClick={() => handleFaqToggle(0)}
                                    >
                                        <span className="text-lg font-semibold text-gray-900">Why don't you show prices publicly?</span>
                                        <ChevronRight 
                                            className={`w-5 h-5 text-gray-500 transition-transform ${
                                                openFaq === 0 ? 'rotate-90' : ''
                                            }`} 
                                        />
                                    </button>
                                    {openFaq === 0 && (
                                        <div className="px-4 pb-4">
                                            <p className="text-gray-600 leading-relaxed">
                                                Because every company is different — we customize pricing to deliver the best value based on your needs.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </AnimatedOnScroll>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-blue-600">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <AnimatedOnScroll animationClass="animate-slide-up" threshold={0.3}>
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    Ready to get started?
                                </h2>
                            </AnimatedOnScroll>
                            <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-200" threshold={0.3}>
                                <p className="text-lg text-blue-100 mb-8">
                                    Tell us a few details, and we'll prepare your personalized pricing plan.
                                </p>
                            </AnimatedOnScroll>
                            <AnimatedOnScroll animationClass="animate-slide-up" delayClass="delay-400" threshold={0.3}>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <button className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                                        Request a Custom Quote
                                    </button>
                                    <a
                                        href="tel:+91-89292-08062"
                                        className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        Call Us Now
                                    </a>
                                </div>
                            </AnimatedOnScroll>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand and Social */}
                    <div>
                        <Link href="/">
                            <div className="relative w-48 h-16 mb-4 cursor-pointer">
                                <Image
                                    src="/hrlogo.png" 
                                    alt="IDMS Logo and Brand Statement"
                                    fill 
                                    style={{ objectFit: 'contain' }}
                                    className="w-full h-full"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="#careers" className="hover:text-blue-400 transition-colors">Careers</a></li>
                            <li><a href="#blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
                            <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Products</h4>
                        <ul className="space-y-2 text-gray-400">
                            {/* Using a selection of the detailed products for the footer list */}
                            {detailedProducts.slice(0, 4).map(item => (
                                <li key={item.id}><a href={item.href} className="hover:text-blue-400 transition-colors">{item.title}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#help" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                            <li><a href="#status" className="hover:text-blue-400 transition-colors">Status</a></li>
                            <li><a href="#privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    
                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
                        <div className="space-y-2 text-gray-400">
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                                <a href="mailto:info@idms.com" className="hover:text-blue-400 transition-colors">info@idms.com</a>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-4 h-4 mt-1 mr-2 text-blue-400 flex-shrink-0" />
                                <span>123 Data Street, Tech City, CA 94000</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 container mx-auto px-4 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} IDMS Technologies Private Limited. All rights reserved.
                </div>
            </footer>

            {/* Custom CSS */}
            <style jsx global>{`
                html {
                    scroll-behavior: smooth;
                }

                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-down,
                .animate-fade-in-up,
                .animate-slide-up {
                    opacity: 0;
                }

                .animate-fade-in-down.is-visible {
                    animation: fade-in-down 0.8s ease-out forwards;
                }

                .animate-fade-in-up.is-visible {
                    animation: fade-in-up 0.8s ease-out 0.4s forwards;
                }

                .animate-slide-up.is-visible {
                    animation: slide-up 0.8s ease-out forwards;
                }

                .animate-slide-up.is-visible.delay-200 {
                    animation: slide-up 0.8s ease-out 0.2s forwards;
                }
                .animate-slide-up.is-visible.delay-400 {
                    animation: slide-up 0.8s ease-out 0.4s forwards;
                }
                .animate-slide-up.is-visible.delay-600 {
                    animation: slide-up 0.8s ease-out 0.6s forwards;
                }
                .animate-slide-up.is-visible.delay-800 {
                    animation: slide-up 0.8s ease-out 0.8s forwards;
                }
                .animate-slide-up.is-visible.delay-1000 {
                    animation: slide-up 0.8s ease-out 1s forwards;
                }
            `}</style>
        </div>
    );
}
