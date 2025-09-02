'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import apiClient from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  Tag,
  Info,
  Image as ImageIcon,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.shtepialodrave.com';

interface ProductImage {
  id: number;
  url: string;
  field_name: string;
}

interface ProductResponse {
  data: {
    id: number;
    name: string;
    code: string;
    description: string;
    shop: number;
    brand: number;
    categories: number[];
    gender: 'male' | 'female' | 'unisex';
    size: string | null;
    price: string;
    discount: number;
    quantity: number;
    availability: 'available' | 'unavailable';
    images: ProductImage[];
  };
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'attributes'>('general');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price: '',
    sale_price: '',
    quantity: 0,
    categories: [] as number[],
    brand: null as number | null,
    shop: null as number | null,
    gender: 'unisex' as 'male' | 'female' | 'unisex',
    size: '',
    discount: 0,
    availability: 'available' as 'available' | 'unavailable',
    sku: '',
    unit: '',
    loyalty_points: 0,
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    length: '',
    width: '',
    height: '',
    age_range: '',
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Fetch product data
  const { data: productResponse, isLoading: productLoading } = useQuery<ProductResponse>({
    queryKey: ['product', productId],
    queryFn: () => api.products.getByIdForAdmin(productId),
    enabled: !!productId,
  });

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => api.categories.getAll(),
  });

  // Fetch brands for dropdown
  const { data: brandsData } = useQuery({
    queryKey: ['brands-all'],
    queryFn: () => api.brands.getAll(),
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.products.update(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    },
    onError: (error: any) => {
      setErrorText(error.response?.data?.message || 'Ndodhi një gabim gjatë ruajtjes');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    },
  });

  // Load product data into form
  useEffect(() => {
    if (productResponse?.data) {
      const product = productResponse.data as any;
      setFormData({
        name: product.name || '',
        code: product.code || '',
        description: product.description || '',
        price: product.price || '',
        sale_price: product.sale_price || '',
        quantity: product.quantity || 0,
        categories: product.categories || [],
        brand: product.brand || null,
        shop: product.shop || null,
        gender: product.gender || 'unisex',
        size: product.size || '',
        discount: product.discount || 0,
        availability: product.availability || 'available',
        sku: product.sku || '',
        unit: product.unit || '',
        loyalty_points: product.loyalty_points || 0,
        discount_type: product.discount_type || 'percentage',
        discount_value: product.discount_value || 0,
        length: product.length || '',
        width: product.width || '',
        height: product.height || '',
        age_range: product.age_range || '',
      });

      setImages(product.images || []);
    }
  }, [productResponse]);

  const validateForm = useCallback(() => {
    // Basic validation
    if (!formData.name.trim()) {
      setErrorText('Emri i produktit është i detyrueshëm');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setErrorText('Çmimi duhet të jetë më i madh se 0');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
      return false;
    }


    if (formData.categories.length === 0) {
      setErrorText('Ju lutem zgjidhni të paktën një kategori');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity.toString()),
      discount: parseInt(formData.discount.toString()),
    };

    updateMutation.mutate(dataToSubmit);
  }, [formData, validateForm, updateMutation]);

  // Add keyboard shortcut for save (Ctrl+S or Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (isMain) {
      setUploadingMain(true);
      const file = files[0];
      const formData = new FormData();
      formData.append('image', file);
      formData.append('image_type', 'main');
      
      try {
        await api.products.uploadImage(productId, formData);
        
        // Refresh product data to get updated images
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error: any) {
        setErrorText(error.response?.data?.message || error.response?.data?.error || 'Gabim gjatë ngarkimit të imazhit');
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 5000);
      } finally {
        setUploadingMain(false);
        // Clear the input
        e.target.value = '';
      }
    } else {
      setUploadingGallery(true);
      
      try {
        // Upload each gallery image
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append('image', file);  // Changed from 'gallery' to 'image'
          formData.append('image_type', 'gallery');
          
          await api.products.uploadImage(productId, formData);
        }
        
        // Refresh product data to get updated images
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error: any) {
        setErrorText(error.response?.data?.message || error.response?.data?.error || 'Gabim gjatë ngarkimit të imazheve');
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 5000);
      } finally {
        setUploadingGallery(false);
        // Clear the input
        e.target.value = '';
      }
    }
  };

  const removeImage = async (id: number) => {
    try {
      await api.products.removeImages(productId, [id]);
      
      // Refresh product data to get updated images
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error: any) {
      setErrorText(error.response?.data?.message || 'Gabim gjatë fshirjes së imazhit');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  };

  const getMainImage = () => {
    const mainImg = images.find(img => img.field_name === 'main_image');
    return mainImg ? getImageUrl(mainImg.url) : '';
  };

  const getGalleryImages = () => {
    return images.filter(img => img.field_name.startsWith('gallery_'));
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('blob:')) return path;
    // Ensure no double slashes
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_IMAGE_URL}${cleanPath}`;
  };

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-5 sm:h-7 w-32 sm:w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 sm:h-4 w-20 sm:w-24 bg-gray-200 rounded animate-pulse mt-1 sm:mt-2"></div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial w-full sm:w-32 h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1 sm:flex-initial w-full sm:w-36 h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow">
              <div className="border-b p-3">
                <div className="flex gap-4">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="h-5 md:h-6 w-20 md:w-24 bg-gray-200 rounded animate-pulse mb-3 md:mb-4"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="h-5 md:h-6 w-16 md:w-20 bg-gray-200 rounded animate-pulse mb-3 md:mb-4"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="h-5 md:h-6 w-28 md:w-32 bg-gray-200 rounded animate-pulse mb-3 md:mb-4"></div>
              <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/admin/products"
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Ndrysho Produktin</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">ID: {productId}</p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Link
            href={`/products/${productId}`}
            target="_blank"
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1 sm:flex-initial text-sm sm:text-base"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Shiko në Faqe</span>
            <span className="xs:hidden">Shiko</span>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 relative group flex-1 sm:flex-initial text-sm sm:text-base"
            title="Ruaj Ndryshimet (Ctrl+S / ⌘+S)"
          >
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">{updateMutation.isPending ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}</span>
            <span className="xs:hidden">Ruaj</span>
            <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
              Ctrl+S / ⌘+S
            </span>
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Produkti u përditësua me sukses!
        </div>
      )}
      {showErrorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {errorText}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">

            <form onSubmit={handleSubmit} className="p-4 md:p-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emri i Produktit *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Përshkrimi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Hidden for now - SKU */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kodi i Produktit
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Çmimi Regular (LEK) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Hidden for now - Sale Price */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Çmimi i Zbritur (LEK)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div> */}
                  </div>

                  {/* Hidden for now - Unit and Loyalty Points */}
                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Njësia
                      </label>
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="p.sh. copë, pako, kg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pikët e Besnikërisë
                      </label>
                      <input
                        type="number"
                        value={formData.loyalty_points}
                        onChange={(e) => setFormData({ ...formData, loyalty_points: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div> */}

                  {/* Hidden for now - Discount Type and Value */}
                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zbritja (Tipi)
                      </label>
                      <select
                        value={formData.discount_type}
                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="percentage">Përqindje (%)</option>
                        <option value="fixed">Vlerë Fikse (LEK)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vlera e Zbritjes
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.discount_value}
                        onChange={(e) => setFormData({ ...formData, discount_value: e.target.value ? parseFloat(e.target.value) : 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder={formData.discount_type === 'percentage' ? 'p.sh. 10' : 'p.sh. 500'}
                      />
                    </div>
                  </div> */}
                </div>
              )}


              {/* Shipping Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gjatësia (cm)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.length || ''}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gjerësia (cm)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.width || ''}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lartësia (cm)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.height || ''}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Attributes Tab */}
              {activeTab === 'attributes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mosha e Rekomanduar
                      </label>
                      <input
                        type="number"
                        value={formData.age_range || ''}
                        onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="p.sh. 3 (vjeç e lart)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gjinia
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'unisex' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="unisex">Uniseks</option>
                        <option value="male">Djalë</option>
                        <option value="female">Vajzë</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Madhësia
                    </label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="p.sh. S, M, L, XL"
                    />
                  </div>

                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6 order-1 lg:order-2">
          {/* Categories */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Kategoritë</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categoriesData?.map((category: any) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, categories: [...formData.categories, category.id] });
                      } else {
                        setFormData({ ...formData, categories: formData.categories.filter(id => id !== category.id) });
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Brendi</h3>
            <select
              value={formData.brand || ''}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Zgjidh një brand</option>
              {brandsData?.map((brand: any) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Imazhet e Produktit</h3>
            <div className="space-y-4">
              {/* Main Image */}
              {getMainImage() ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Imazhi Kryesor</p>
                  <div className="relative w-full h-48">
                    <Image
                      src={getMainImage()}
                      alt="Main product"
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <button
                      onClick={() => {
                        const mainImg = images.find(img => img.field_name === 'main_image');
                        if (mainImg) removeImage(mainImg.id);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Imazhi Kryesor</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Nuk ka imazh kryesor</p>
                  </div>
                </div>
              )}
              
              {/* Upload Main Image */}
              {uploadingMain && (
                <div className="mb-2">
                  <div className="flex items-center justify-center bg-blue-50 p-2 rounded">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-blue-700">Duke ngarkuar imazhin kryesor...</span>
                  </div>
                </div>
              )}
              <label className="block">
                <span className="sr-only">Ngarko imazhin kryesor</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  disabled={uploadingMain}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
              </label>

              {/* Gallery Images */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Galeria</p>
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-2 gap-2 mb-3">
                  {getGalleryImages().map((image) => (
                    <div key={image.id} className="relative w-full h-24">
                      <Image
                        src={getImageUrl(image.url)}
                        alt="Gallery"
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Upload Gallery Images */}
                {uploadingGallery && (
                  <div className="mb-2">
                    <div className="flex items-center justify-center bg-green-50 p-2 rounded">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      <span className="text-sm text-green-700">Duke ngarkuar imazhet në galeri...</span>
                    </div>
                  </div>
                )}
                
                <label className="block">
                  <span className="sr-only">Shto në galeri</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, false)}
                    disabled={uploadingGallery}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}