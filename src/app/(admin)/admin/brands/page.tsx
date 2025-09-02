'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { 
  Plus,
  Edit,
  Trash,
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  Upload,
  X
} from 'lucide-react';
import Image from 'next/image';

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'https://api.shtepialodrave.com';

interface Brand {
  id: number;
  name: string;
  slug: string;
  parent?: number | null;
  parent_name?: string | null;
  logo_url?: string | null;
  products_count?: number;
}

interface BrandsResponse {
  data: Brand[];
  paginatorInfo: {
    total: number;
    current_page: number;
    count: number;
    last_page: number;
    per_page: number;
  };
}

export default function BrandsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState<string>('-id');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent: null as number | null,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [modalImageError, setModalImageError] = useState(false);
  
  const pageSize = 20;
  const queryClient = useQueryClient();

  // Fetch brands
  const { data: brandsData, isLoading, error } = useQuery<BrandsResponse>({
    queryKey: ['admin-brands', currentPage, ordering],
    queryFn: () => api.brands.getForAdmin({
      page: currentPage,
      limit: pageSize,
      ordering: ordering,
    }),
  });

  // Create brand mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => api.brands.create(data),
    onSuccess: async (newBrand) => {
      // Upload logo if provided
      if (logoFile && newBrand.id) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        await api.brands.uploadLogo(newBrand.id, formData);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      closeModal();
    },
  });

  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      api.brands.partialUpdate(id, data),
    onSuccess: async (updatedBrand) => {
      // Upload logo if changed
      if (logoFile && editingBrand?.id) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        await api.brands.uploadLogo(editingBrand.id, formData);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      closeModal();
    },
  });

  // Delete brand mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.brands.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
    },
  });

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

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        slug: brand.slug,
        parent: brand.parent ?? null,
      });
      const logoUrl = brand.logo_url ? 
        (brand.logo_url.startsWith('http') ? brand.logo_url : `${BASE_IMAGE_URL}${brand.logo_url}`) 
        : '';
      console.log('Logo URL for modal:', logoUrl);
      setLogoPreview(logoUrl);
      setModalImageError(false);
    } else {
      setEditingBrand(null);
      setFormData({
        name: '',
        slug: '',
        parent: null,
      });
      setLogoPreview('');
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      parent: null,
    });
    setLogoFile(null);
    setLogoPreview('');
    setModalImageError(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (brand: Brand) => {
    if (window.confirm(`A jeni të sigurt që doni të fshini brendin "${brand.name}"?`)) {
      deleteMutation.mutate(brand.id);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">Gabim në ngarkim të brendeve</div>
      </div>
    );
  }

  const brands = brandsData?.data || [];
  const totalCount = brandsData?.paginatorInfo?.total || 0;
  const totalPages = brandsData?.paginatorInfo?.last_page || 1;

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Brendet</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">
            Total: {totalCount} brende
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" />
          Shto Brend
        </button>
      </div>

      {/* Brands Table - Desktop */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => toggleSorting("name")}
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Brendi
                    {getSortIcon("name")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </span>
                </th>
                <th className="px-6 py-3 text-left">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prindi
                  </span>
                </th>
                <th className="px-6 py-3 text-center">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkte
                  </span>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veprimet
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
              ) : brands.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nuk u gjetën brende
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {brand.logo_url && !imageErrors[brand.id] ? (
                          <div className="w-10 h-10 relative mr-3">
                            <Image
                              src={
                                brand.logo_url.startsWith("http")
                                  ? brand.logo_url
                                  : `${BASE_IMAGE_URL}${brand.logo_url}`
                              }
                              alt={brand.name}
                              fill
                              className="object-contain rounded"
                              onError={() => {
                                console.log('Image load error for brand:', brand.id, brand.logo_url);
                                setImageErrors(prev => ({ ...prev, [brand.id]: true }));
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {brand.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: #{brand.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {brand.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {brand.parent_name || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {brand.products_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(brand)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Brands Cards - Mobile */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : brands.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nuk u gjetën brende
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {brands.map((brand) => (
                <div key={brand.id} className="p-4 hover:bg-gray-50">
                  {/* Brand Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      {brand.logo_url && !imageErrors[brand.id] ? (
                        <div className="w-12 h-12 relative mr-3 flex-shrink-0">
                          <Image
                            src={
                              brand.logo_url.startsWith("http")
                                ? brand.logo_url
                                : `${BASE_IMAGE_URL}${brand.logo_url}`
                            }
                            alt={brand.name}
                            fill
                            className="object-contain rounded"
                            onError={() => {
                              setImageErrors(prev => ({ ...prev, [brand.id]: true }));
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                          <Package className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {brand.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: #{brand.id}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => openModal(brand)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Brand Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block mb-0.5">Slug</span>
                      <span className="text-gray-600">{brand.slug}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-0.5">Prindi</span>
                      <span className="text-gray-900">{brand.parent_name || "—"}</span>
                    </div>
                  </div>

                  {/* Products Count */}
                  <div className="mt-3">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {brand.products_count || 0} produkte
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-3 md:px-4 py-3 border-t flex items-center justify-between">
            <div className="flex-1 flex justify-between md:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mbrapa
              </button>
              <span className="text-xs text-gray-700 self-center">
                Faqe {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Para
              </button>
            </div>
            <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Duke shfaqur{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  deri{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalCount)}
                  </span>{" "}
                  nga <span className="font-medium">{totalCount}</span> brende
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
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
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingBrand ? "Edito Brendin" : "Shto Brend të Ri"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emri i Brendit
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brendi Prind (opsional)
                  </label>
                  <input
                    type="number"
                    value={formData.parent || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parent: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ID e brendit prind"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                  
                    {logoPreview && !modalImageError && (
                      <div className="w-20 h-20 relative">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="object-contain rounded border"
                          onError={() => {
                            console.log('Modal image load error:', logoPreview);
                            setModalImageError(true);
                          }}
                        />
                      </div>
                    )}
                    {modalImageError && (
                      <div className="w-20 h-20 rounded border bg-gray-200 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Upload className="w-4 h-4 inline mr-2" />
                      {logoPreview ? "Ndrysho Logo" : "Ngarko Logo"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Duke ruajtur..."
                    : "Ruaj"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}