export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  banner?: string | null;
  featured_image?: string | null;
  is_featured: boolean;
  icon?: string | null;
  parent?: number | null;
  children: Category[];
  is_parent: boolean;
  is_child: boolean;
}

export interface CategoryListResponse {
  data: Category[];
  paginatorInfo?: {
    total: number;
    current_page: number;
    last_page: number;
    count: number;
    per_page: number;
  };
}

export interface CategoryFilters {
  parent_id?: number;
  is_featured?: boolean;
  limit?: number;
  page?: number;
}