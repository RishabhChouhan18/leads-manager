

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowLeft, CheckCircle, Tag } from 'lucide-react';

// interface BuyerFormData {
//   fullName: string;
//   email: string;
//   phone: string;
//   city: string;
//   propertyType: string;
//   bhk: string;
//   purpose: string;
//   budgetMin: string;
//   budgetMax: string;
//   timeline: string;
//   source: string;
//   notes: string;
//   tags: string[];
// }

// export default function NewBuyerPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<BuyerFormData>({
//     fullName: '',
//     email: '',
//     phone: '',
//     city: 'Chandigarh',
//     propertyType: 'Apartment',
//     bhk: '2',
//     purpose: 'Buy',
//     budgetMin: '',
//     budgetMax: '',
//     timeline: '0-3m',
//     source: 'Website',
//     notes: '',
//     tags: [],
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [newTag, setNewTag] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'];
//   const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'];
//   const bhkOptions = ['1', '2', '3', '4', 'Studio'];
//   const purposes = ['Buy', 'Rent'];
//   const timelines = ['0-3m', '3-6m', '>6m', 'Exploring'];
//   const sources = ['Website', 'Referral', 'Walk-in', 'Call', 'Other'];

//   const requiresBhk = ['Apartment', 'Villa'].includes(formData.propertyType);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const newErrors: { [key: string]: string } = {};

//     // Validation
//     if (formData.fullName.length < 2) newErrors.fullName = 'Name must be at least 2 characters';
//     if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10-15 digits';
//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (requiresBhk && !formData.bhk) newErrors.bhk = 'BHK is required for this property type';
//     if (formData.budgetMin && formData.budgetMax && parseInt(formData.budgetMax) < parseInt(formData.budgetMin)) {
//       newErrors.budgetMax = 'Maximum budget must be greater than minimum';
//     }

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       try {
//         // Prepare data for API call - convert budget strings to integers
//         const apiData = {
//           fullName: formData.fullName,
//           email: formData.email || undefined, // Send undefined instead of empty string
//           phone: formData.phone,
//           city: formData.city,
//           propertyType: formData.propertyType,
//           bhk: requiresBhk ? formData.bhk : undefined,
//           purpose: formData.purpose,
//           budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
//           budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
//           timeline: formData.timeline,
//           source: formData.source,
//           notes: formData.notes || undefined,
//           tags: formData.tags,
//         };

//         // Make API call to create buyer
//         const response = await fetch('/api/buyers', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(apiData),
//         });

//         const data = await response.json();
//         console.log("data=========>",data)

//         if (!response.ok) {
//           throw new Error(data.error || 'Failed to create buyer');
//         }

//         // Success - show success message and redirect
//         alert('Buyer created successfully!');
//         router.push('/buyers');
        
//       } catch (error) {
//         console.error('Error creating buyer:', error);
//         alert(error instanceof Error ? error.message : 'Failed to create buyer');
//       }
//     }
    
//     setIsSubmitting(false);
//   };

//   const addTag = () => {
//     if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
//       setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
//       setNewTag('');
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     setFormData(prev => ({ 
//       ...prev, 
//       tags: prev.tags.filter(tag => tag !== tagToRemove) 
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <Link
//             href="/buyers"
//             className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Buyers
//           </Link>
//           <h1 className="text-2xl font-bold text-gray-900">Add New Buyer</h1>
//           <p className="text-gray-600">Fill in the buyer details below</p>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200">
//           <div className="border-b border-gray-200 px-6 py-4">
//             <h2 className="text-xl font-semibold text-gray-900">Buyer Information</h2>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.fullName}
//                   onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     errors.fullName ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter full name"
//                 />
//                 {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number *
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     errors.phone ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="10-15 digits"
//                 />
//                 {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email (Optional)
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     errors.email ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter email address"
//                 />
//                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   City *
//                 </label>
//                 <select
//                   value={formData.city}
//                   onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {cities.map(city => (
//                     <option key={city} value={city}>{city}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Property Details */}
//             <div className="border-t pt-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Property Requirements</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Property Type *
//                   </label>
//                   <select
//                     value={formData.propertyType}
//                     onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {propertyTypes.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {requiresBhk && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       BHK *
//                     </label>
//                     <select
//                       value={formData.bhk}
//                       onChange={(e) => setFormData(prev => ({ ...prev, bhk: e.target.value }))}
//                       className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                         errors.bhk ? 'border-red-300' : 'border-gray-300'
//                       }`}
//                     >
//                       <option value="">Select BHK</option>
//                       {bhkOptions.map(bhk => (
//                         <option key={bhk} value={bhk}>{bhk} BHK</option>
//                       ))}
//                     </select>
//                     {errors.bhk && <p className="text-red-500 text-xs mt-1">{errors.bhk}</p>}
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Purpose *
//                   </label>
//                   <select
//                     value={formData.purpose}
//                     onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {purposes.map(purpose => (
//                       <option key={purpose} value={purpose}>{purpose}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Budget */}
//             <div className="border-t pt-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Range</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Minimum Budget (₹)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.budgetMin}
//                     onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="e.g., 5000000"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Maximum Budget (₹)
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.budgetMax}
//                     onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.budgetMax ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="e.g., 7000000"
//                   />
//                   {errors.budgetMax && <p className="text-red-500 text-xs mt-1">{errors.budgetMax}</p>}
//                 </div>
//               </div>
//             </div>

//             {/* Timeline and Source */}
//             <div className="border-t pt-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Timeline *
//                   </label>
//                   <select
//                     value={formData.timeline}
//                     onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {timelines.map(timeline => (
//                       <option key={timeline} value={timeline}>{timeline}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Source *
//                   </label>
//                   <select
//                     value={formData.source}
//                     onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {sources.map(source => (
//                       <option key={source} value={source}>{source}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Notes */}
//             <div className="border-t pt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Notes (Optional)
//               </label>
//               <textarea
//                 value={formData.notes}
//                 onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
//                 rows={3}
//                 maxLength={1000}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Any additional notes..."
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 {formData.notes.length}/1000 characters
//               </p>
//             </div>

//             {/* Tags */}
//             <div className="border-t pt-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Tags (Optional)
//               </label>
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {formData.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
//                   >
//                     <Tag className="w-3 h-3 mr-1" />
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={() => removeTag(tag)}
//                       className="ml-2 text-blue-600 hover:text-blue-800"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={newTag}
//                   onChange={(e) => setNewTag(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Add a tag..."
//                 />
//                 <button
//                   type="button"
//                   onClick={addTag}
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="border-t pt-6 flex justify-end gap-4">
//               <Link
//                 href="/buyers"
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </Link>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-4 h-4" />
//                     Create Buyer
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Tag, Loader } from 'lucide-react';

interface BuyerFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  propertyType: string;
  bhk: string;
  purpose: string;
  budgetMin: string;
  budgetMax: string;
  timeline: string;
  source: string;
  notes: string;
  tags: string[];
}

export default function BuyerFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEditing = Boolean(params?.id);
  const buyerId = params?.id as string;

  const [formData, setFormData] = useState<BuyerFormData>({
    fullName: '',
    email: '',
    phone: '',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '2',
    purpose: 'Buy',
    budgetMin: '',
    budgetMax: '',
    timeline: '0-3m',
    source: 'Website',
    notes: '',
    tags: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'];
  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'];
  const bhkOptions = ['1', '2', '3', '4', 'Studio'];
  const purposes = ['Buy', 'Rent'];
  const timelines = ['0-3m', '3-6m', '>6m', 'Exploring'];
  const sources = ['Website', 'Referral', 'Walk-in', 'Call', 'Other'];

  const requiresBhk = ['Apartment', 'Villa'].includes(formData.propertyType);

  // Fetch buyer data if editing
  useEffect(() => {
    if (isEditing && buyerId) {
      fetchBuyerData();
    }
  }, [isEditing, buyerId]);

  const fetchBuyerData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/buyers/${buyerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch buyer data');
      }

      const data = await response.json();
      const buyer = data.buyer;

      // Convert buyer data to form format
      setFormData({
        fullName: buyer.fullName || '',
        email: buyer.email || '',
        phone: buyer.phone || '',
        city: buyer.city || 'Chandigarh',
        propertyType: buyer.propertyType || 'Apartment',
        bhk: buyer.bhk || '2',
        purpose: buyer.purpose || 'Buy',
        budgetMin: buyer.budgetMin ? buyer.budgetMin.toString() : '',
        budgetMax: buyer.budgetMax ? buyer.budgetMax.toString() : '',
        timeline: buyer.timeline || '0-3m',
        source: buyer.source || 'Website',
        notes: buyer.notes || '',
        tags: buyer.tags || [],
      });
    } catch (error) {
      console.error('Error fetching buyer:', error);
      alert('Failed to load buyer data');
      router.push('/buyers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: { [key: string]: string } = {};

    // Validation
    if (formData.fullName.length < 2) newErrors.fullName = 'Name must be at least 2 characters';
    if (!/^\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10-15 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (requiresBhk && !formData.bhk) newErrors.bhk = 'BHK is required for this property type';
    if (formData.budgetMin && formData.budgetMax && parseInt(formData.budgetMax) < parseInt(formData.budgetMin)) {
      newErrors.budgetMax = 'Maximum budget must be greater than minimum';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // Prepare data for API call
        const apiData = {
          fullName: formData.fullName,
          email: formData.email || undefined,
          phone: formData.phone,
          city: formData.city,
          propertyType: formData.propertyType,
          bhk: requiresBhk ? formData.bhk : undefined,
          purpose: formData.purpose,
          budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
          budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
          timeline: formData.timeline,
          source: formData.source,
          notes: formData.notes || undefined,
          tags: formData.tags,
        };

        // Make API call
        const url = isEditing ? `/api/buyers/${buyerId}` : '/api/buyers';
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} buyer`);
        }

        // Success
        alert(`Buyer ${isEditing ? 'updated' : 'created'} successfully!`);
        router.push('/buyers');
        
      } catch (error) {
        console.error(`Error ${isEditing ? 'updating' : 'creating'} buyer:`, error);
        alert(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} buyer`);
      }
    }
    
    setIsSubmitting(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  // Loading state for edit mode
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading buyer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/buyers"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Buyers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Buyer' : 'Add New Buyer'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update the buyer details below' : 'Fill in the buyer details below'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Buyer Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="10-15 digits"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {requiresBhk && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      BHK *
                    </label>
                    <select
                      value={formData.bhk}
                      onChange={(e) => setFormData(prev => ({ ...prev, bhk: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.bhk ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select BHK</option>
                      {bhkOptions.map(bhk => (
                        <option key={bhk} value={bhk}>{bhk} BHK</option>
                      ))}
                    </select>
                    {errors.bhk && <p className="text-red-500 text-xs mt-1">{errors.bhk}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {purposes.map(purpose => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetMin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData(prev => ({ ...prev, budgetMax: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.budgetMax ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 7000000"
                  />
                  {errors.budgetMax && <p className="text-red-500 text-xs mt-1">{errors.budgetMax}</p>}
                </div>
              </div>
            </div>

            {/* Timeline and Source */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline *
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timelines.map(timeline => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source *
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional notes..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.notes.length}/1000 characters
              </p>
            </div>

            {/* Tags */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex justify-end gap-4">
              <Link
                href="/buyers"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {isEditing ? 'Update Buyer' : 'Create Buyer'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}