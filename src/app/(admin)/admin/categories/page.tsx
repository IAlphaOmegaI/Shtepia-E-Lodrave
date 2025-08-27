'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import Image from 'next/image';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FolderTree,
  Tag,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Upload,
  X,
  Star
} from 'lucide-react';

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.shtepialodrave.com';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | null;
  parent_name?: string;
  banner?: string;
  featured_image?: string;
  is_featured?: boolean;
  is_active?: boolean;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
}

interface CategoriesResponse {
  data: Category[];
  paginatorInfo: {
    total: number;
    current_page: number;
    count: number;
    last_page: number;
    firstItem: number;
    lastItem: number;
    per_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState<string>('name');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  
  const pageSize = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: null as number | null,
    is_active: true,
    is_featured: false,
  });

  // Fetch categories with params
  const { data: categoriesData, isLoading, error } = useQuery<CategoriesResponse>({
    queryKey: ['admin-categories', currentPage, ordering],
    queryFn: () => api.categories.getForAdmin({
      page: currentPage,
      page_size: pageSize,
      ordering: ordering,
    }),
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => api.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setShowModal(false);
      resetForm();
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      api.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setShowDeleteConfirm(null);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent: null,
      is_active: true,
      is_featured: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'banner' | 'featured_image', categoryId?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Only allow upload if we have a category ID (editing existing category)
    if (!categoryId) {
      alert('Ju lutem ruani kategorinë së pari para se të ngarkoni imazhet');
      e.target.value = '';
      return;
    }
    
    const file = files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('image_type', imageType);
    
    if (imageType === 'banner') {
      setUploadingBanner(true);
    } else {
      setUploadingFeatured(true);
    }
    
    try {
      const response = await api.categories.uploadImage(categoryId, formData);
      
      // Update the editing category with fresh data (handle data wrapper)
      if (editingCategory && response) {
        const categoryData = response.data || response;
        setEditingCategory(categoryData);
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      
      // Clear the input
      e.target.value = '';
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.response?.data?.message || error.response?.data?.error || 'Gabim gjatë ngarkimit të imazhit');
    } finally {
      if (imageType === 'banner') {
        setUploadingBanner(false);
      } else {
        setUploadingFeatured(false);
      }
    }
  };

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_IMAGE_URL}${cleanPath}`;
  };

  const handleEdit = async (category: Category) => {
    // Fetch fresh data for the category to get latest images
    try {
      const response = await api.categories.getByIdForAdmin(category.id);
      // Extract data from the wrapper
      const freshData = response.data || response;
      
      setEditingCategory(freshData);
      setFormData({
        name: freshData.name,
        slug: freshData.slug,
        description: freshData.description || '',
        parent: freshData.parent || null,
        is_active: freshData.is_active !== false,
        is_featured: freshData.is_featured || false,
      });
    } catch (error) {
      // Fallback to existing data if fetch fails
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parent: category.parent || null,
        is_active: category.is_active !== false,
        is_featured: category.is_featured || false,
      });
    }
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const toggleSorting = (field: string) => {
    if (ordering === field) {
      setOrdering(`-${field}`);
    } else if (ordering === `-${field}`) {
      setOrdering(field);
    } else {
      setOrdering(field);
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (ordering === field) {
      return <ArrowUp className="w-4 h-4 inline ml-1" />;
    } else if (ordering === `-${field}`) {
      return <ArrowDown className="w-4 h-4 inline ml-1" />;
    }
    return <ArrowUpDown className="w-4 h-4 inline ml-1 opacity-50" />;
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (!editingCategory && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, editingCategory]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">Gabim në ngarkim të kategorive</div>
      </div>
    );
  }

  // Handle both wrapped and unwrapped responses
  const categories = categoriesData?.data || [];
  const totalCount = categoriesData?.paginatorInfo?.total || 0;
  const totalPages = categoriesData?.paginatorInfo?.last_page || 1;

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Menaxhimi i Kategorive</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Shto Kategori të Re
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="text-sm text-gray-600">
          {categoriesData && (
            <span>
              Duke shfaqur {categories.length} nga {totalCount} kategori
            </span>
          )}
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSorting('name')}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Emri
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSorting('slug')}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Slug
                    {getSortIcon('slug')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoria Prind
                  </span>
                </th>
                <th className="px-6 py-3 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imazhet
                  </span>
                </th>
                <th className="px-6 py-3 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veprime
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nuk u gjetën kategori
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(category.banner || category.featured_image) ? (
                          <div className="relative w-10 h-10 mr-3">
                            <Image 
                              src={getImageUrl(category.banner || category.featured_image)} 
                              alt={category.name}
                              fill
                              className="rounded-lg object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                            <Tag className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.parent_name ? (
                        <span className="text-sm text-gray-600 flex items-center">
                          <FolderTree className="w-4 h-4 mr-1" />
                          {category.parent_name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        {category.banner && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded" title="Has banner image">
                            Banner
                          </span>
                        )}
                        {category.featured_image && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded" title="Has featured image">
                            Featured
                          </span>
                        )}
                        {!category.banner && !category.featured_image && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {category.is_featured ? (
                        <span className="px-2 inline-flex text-xs  items-center leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Po
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">
                          Jo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mbrapa
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Para
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Duke shfaqur{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{' '}
                  deri{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalCount)}
                  </span>{' '}
                  nga{' '}
                  <span className="font-medium">{totalCount}</span>{' '}
                  rezultate
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {editingCategory ? 'Ndrysho Kategorinë' : 'Shto Kategori të Re'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emri i Kategorisë *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="auto-gjenerohet-nga-emri"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Përshkrimi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategoria Prind
                    </label>
                    <select
                      value={formData.parent || ''}
                      onChange={(e) => setFormData({ ...formData, parent: e.target.value ? Number(e.target.value) : null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">— Asnjë (Kategori kryesore) —</option>
                      {categories
                        .filter(cat => cat.id !== editingCategory?.id)
                        .map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {editingCategory && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Banner Image
                        </label>
                        {editingCategory.banner && (
                          <div className="mb-2 relative w-full h-32">
                            <Image 
                              src={getImageUrl(editingCategory.banner)} 
                              alt="Banner"
                              fill
                              className="object-cover rounded"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                        {uploadingBanner ? (
                          <div className="flex items-center justify-center bg-blue-50 p-2 rounded">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            <span className="text-sm text-blue-700">Duke ngarkuar banner image...</span>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'banner', editingCategory.id)}
                            disabled={uploadingBanner}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Featured Image
                        </label>
                        {editingCategory.featured_image && (
                          <div className="mb-2 relative w-full h-32">
                            <Image 
                              src={getImageUrl(editingCategory.featured_image)} 
                              alt="Featured"
                              fill
                              className="object-cover rounded"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                        {uploadingFeatured ? (
                          <div className="flex items-center justify-center bg-green-50 p-2 rounded">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                            <span className="text-sm text-green-700">Duke ngarkuar featured image...</span>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'featured_image', editingCategory.id)}
                            disabled={uploadingFeatured}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                          />
                        )}
                      </div>
                    </>
                  )}

                  {!editingCategory && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>Shënim:</strong> Imazhet mund të ngarkohen vetëm pasi kategoria të jetë krijuar. Ju lutem krijoni kategorinë së pari, pastaj editoni për të shtuar imazhet.
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Kategoria është aktive
                        </span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="mr-2 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Shfaq në faqen kryesore (Featured)
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 ml-6 mt-1">
                        Kategoritë e zgjedhura shfaqen në faqen kryesore
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Anulo
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending 
                      ? 'Duke ruajtur...' 
                      : editingCategory ? 'Përditëso' : 'Krijo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Fshi Kategorinë
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Jeni të sigurt që dëshironi të fshini këtë kategori? Ky veprim nuk mund të zhbëhet.
                </p>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Anulo
                </button>
                <button
                  onClick={() => {
                    handleDelete(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Duke fshirë...' : 'Fshi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}