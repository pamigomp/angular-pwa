export interface ProductQueryParamsModel {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc' | 'ascending' | 'descending' | '-1' | '1';
  page?: number;
  limit?: number;
  select?: string[];
}
