'use client';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-28">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-700 max-w-3xl mb-6">Have questions? We'd love to hear from you. Reach out and our team will get back to you shortly.</p>
        <div className="p-6 bg-white rounded-xl shadow border border-gray-100 max-w-xl">
          <div className="space-y-2 text-gray-700">
            <div><span className="font-semibold">Email:</span> info@idms.com</div>
            <div><span className="font-semibold">Phone:</span> +1 (555) 123-4567</div>
            <div><span className="font-semibold">Address:</span> 123 Data Street, Tech City, CA 94000</div>
          </div>
        </div>
      </div>
    </main>
  );
}


