
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, Eye, Edit2, MapPin, Phone, Mail, Calendar, Building, Home, User, Tag, Clock, CheckCircle, XCircle } from 'lucide-react';

// Types
interface Buyer {
  id: number;
  fullName: string;
  email?: string;
  phone: string;
  city: string;
  propertyType: string;
  bhk?: string;
  purpose: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  source: string;
  status: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Utility functions
const formatCurrency = (amount: number): string => {
  if (!amount) return '';
  const crores = amount / 10000000;
  const lakhs = amount / 100000;
  
  if (crores >= 1) {
    return `₹${crores.toFixed(1)}Cr`;
  } else if (lakhs >= 1) {
    return `₹${lakhs.toFixed(1)}L`;
  } else {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
};

const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    'New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Qualified': 'bg-green-100 text-green-800 border-green-200',
    'Contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Visited': 'bg-purple-100 text-purple-800 border-purple-200',
    'Negotiation': 'bg-orange-100 text-orange-800 border-orange-200',
    'Converted': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Dropped': 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || colors['New'];
};

const getStatusIcon = (status: string) => {
  const icons: { [key: string]: any } = {
    'New': User,
    'Qualified': CheckCircle,
    'Contacted': Phone,
    'Visited': Eye,
    'Negotiation': Clock,
    'Converted': CheckCircle,
    'Dropped': XCircle,
  };
  const Icon = icons[status] || User;
  return <Icon className="w-3 h-3" />;
};

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    status: '',
    timeline: ''
  });

  const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'];
  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'];
  const statuses = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'];
  const timelines = ['0-3m', '3-6m', '>6m', 'Exploring'];

  // Fetch data from API
  useEffect(() => {
    async function fetchBuyers() {
      try {
        const response = await fetch('/api/buyers');
        const data = await response.json();
        console.log('API Response:', data);
        
        // The API returns data in data.data, not data.buyers
        const buyersArray = data.data || data.buyers || [];
        
        // Add default status and format data
        const buyersWithStatus = buyersArray.map((buyer: any) => ({
          ...buyer,
          id: buyer.id.toString(),
          status: 'New', // Default status
          updatedAt: buyer.createdAt
        }));
        
        setBuyers(buyersWithStatus);
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    }
    fetchBuyers();
  }, []);

  const filteredBuyers = buyers.filter(buyer => {
    const matchesSearch = !searchTerm || 
      buyer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.phone.includes(searchTerm) ||
      buyer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = !filters.city || buyer.city === filters.city;
    const matchesPropertyType = !filters.propertyType || buyer.propertyType === filters.propertyType;
    const matchesStatus = !filters.status || buyer.status === filters.status;
    const matchesTimeline = !filters.timeline || buyer.timeline === filters.timeline;

    return matchesSearch && matchesCity && matchesPropertyType && matchesStatus && matchesTimeline;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buyer Leads</h1>
            <p className="text-gray-600">Manage and track your property buyer leads</p>
          </div>
          <Link
            href="/buyers/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Buyer
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={filters.timeline}
                onChange={(e) => setFilters(prev => ({ ...prev, timeline: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Timelines</option>
                {timelines.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBuyers.length} of {buyers.length} buyers
          </div>
        </div>

        {/* Buyers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer Details
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBuyers.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{buyer.fullName}</div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {buyer.phone}
                          </span>
                          {buyer.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {buyer.email}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {buyer.city}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {buyer.propertyType === 'Apartment' ? <Building className="w-4 h-4 text-blue-500" /> : 
                         buyer.propertyType === 'Villa' ? <Home className="w-4 h-4 text-green-500" /> : 
                         <Building className="w-4 h-4 text-gray-500" />}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {buyer.bhk && `${buyer.bhk} BHK `}{buyer.propertyType}
                          </div>
                          <div className="text-xs text-gray-500">{buyer.purpose}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {buyer.budgetMin && buyer.budgetMax ? 
                        `${formatCurrency(buyer.budgetMin)} - ${formatCurrency(buyer.budgetMax)}` :
                        buyer.budgetMin ? `${formatCurrency(buyer.budgetMin)}+` :
                        buyer.budgetMax ? `Up to ${formatCurrency(buyer.budgetMax)}` :
                        'Not specified'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {buyer.timeline}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(buyer.status)}`}>
                        {getStatusIcon(buyer.status)}
                        <span className="ml-1">{buyer.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(buyer.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/buyers/${buyer.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/buyers/${buyer.id}/edit`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBuyers.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No buyers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filters, or add a new buyer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}