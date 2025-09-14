import Link from 'next/link';
import { Plus, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Buyer Leads
            <span className="text-blue-600"> Manager</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your property buyer lead management with our professional CRM system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Qualified</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Converted</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/buyers"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              View All Buyers
            </Link>
            <Link
              href="/buyers/new"
              className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Buyer
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Get started by adding your first buyer lead
          </p>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lead Management</h3>
            <p className="text-gray-600">
              Capture and organize buyer leads with detailed property requirements and contact information
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Track lead status from initial contact through to successful conversion
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Filtering</h3>
            <p className="text-gray-600">
              Advanced search and filtering by location, property type, budget, and timeline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}