'use client';
import React from 'react';




export default function FinancemanagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  


 

  return (
    <div className="min-h-screen bg-transparent">
     
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */} 
       

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
} 