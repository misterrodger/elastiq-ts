/**
 * Type definitions for Multi-Search API
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multi-search.html
 */

import { QueryState } from './types';

/**
 * Header options for each search in a multi-search request
 */
export type MSearchHeader = {
  /** Index name(s) to search */
  index?: string | string[];
  /** Search preference (e.g., '_local', '_primary') */
  preference?: string;
  /** Routing value */
  routing?: string;
  /** Search type */
  search_type?: 'query_then_fetch' | 'dfs_query_then_fetch';
};

/**
 * A single search request in a multi-search operation
 */
export type MSearchRequest<T> = {
  /** Optional header for this search */
  header?: MSearchHeader;
  /** The query body */
  body: QueryState<T>;
};

/**
 * Multi-search builder interface
 */
export type MSearchBuilder<T> = {
  /** Add a search request with header and body */
  add: (request: MSearchRequest<T>) => MSearchBuilder<T>;
  /** Add a search using a query builder */
  addQuery: (body: QueryState<T>, header?: MSearchHeader) => MSearchBuilder<T>;
  /** Build as NDJSON string format for Elasticsearch */
  build: () => string;
  /** Build as array of objects (header, body pairs) */
  buildArray: () => Array<MSearchHeader | QueryState<T>>;
};
