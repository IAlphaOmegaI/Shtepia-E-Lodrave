import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar placeholder */}
        <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-8">
            <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            <Link href="/admin/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Products
            </Link>
            <Link href="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Orders
            </Link>
            <Link href="/admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Users
            </Link>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}