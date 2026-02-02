import { createQueryBuilder } from './query-builder';
import { createAggregationBuilder } from './aggregation-builder';

export const query = <T>(includeQuery: boolean = true) =>
  createQueryBuilder<T>({ _includeQuery: includeQuery });
export const aggregations = <T>() => createAggregationBuilder<T>();

// Multi-search API
export { msearch, createMSearchBuilder } from './multi-search';
export type {
  MSearchBuilder,
  MSearchRequest,
  MSearchHeader
} from './multi-search-types';

// Bulk API
export { bulk, createBulkBuilder } from './bulk';
export type {
  BulkBuilder,
  BulkIndexMeta,
  BulkCreateMeta,
  BulkUpdateMeta,
  BulkDeleteMeta
} from './bulk-types';

// Index Management
export { indexBuilder, createIndexBuilder } from './index-management';
export type {
  IndexBuilder,
  IndexMappings,
  IndexSettings,
  CreateIndexOptions,
  FieldMapping
} from './index-types';

// Suggester API
export { suggest, createSuggesterBuilder } from './suggester';
export type {
  SuggesterBuilder,
  SuggesterState,
  TermSuggesterOptions,
  PhraseSuggesterOptions,
  CompletionSuggesterOptions
} from './suggester-types';

// Export types
export type { KnnOptions, DenseVectorOptions } from './vector-types';
