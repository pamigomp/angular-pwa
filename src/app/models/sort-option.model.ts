export interface SortOptionModel {
  sortBy: string;
  sortDir: 'asc' | 'desc' | 'ascending' | 'descending' | '-1' | '1';
  title: string;
  disabled?: boolean;
}
