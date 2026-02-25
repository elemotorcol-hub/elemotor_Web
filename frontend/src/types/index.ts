// ─── Common Shared Types ─────────────────────────────────────────────────────

/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/**
 * Generic paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Base entity with common fields.
 */
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}
