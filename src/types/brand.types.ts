export interface Brand {
  id: number;
  name: string;
  logo?: string | null;
  slug: string;
  parent?: number | null;
  products_count?: number;
  children: Brand[];
  is_parent: boolean;
  is_child: boolean;
}

export interface BrandListResponse {
  data: Brand[];
  paginatorInfo?: {
    total: number;
    current_page: number;
    last_page: number;
    count: number;
    per_page: number;
  };
}

export interface BrandFilters {
  is_parent?: boolean;
  is_child?: boolean;
  parent_id?: number;
  limit?: number;
  page?: number;
}