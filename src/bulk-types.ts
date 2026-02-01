/**
 * Type definitions for Bulk API
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html
 */

import { ScriptOptions } from './types';

/**
 * Metadata for bulk index operation
 */
export type BulkIndexMeta = {
  _index?: string;
  _id?: string;
  routing?: string;
  version?: number;
  version_type?: 'internal' | 'external' | 'external_gte';
};

/**
 * Metadata for bulk create operation
 */
export type BulkCreateMeta = {
  _index?: string;
  _id?: string;
  routing?: string;
};

/**
 * Metadata for bulk update operation
 */
export type BulkUpdateMeta<T> = {
  _index?: string;
  _id: string;
  routing?: string;
  retry_on_conflict?: number;
  /** Partial document update */
  doc?: Partial<T>;
  /** Insert document if it doesn't exist */
  doc_as_upsert?: boolean;
  /** Script-based update */
  script?: ScriptOptions;
  /** Document to insert if not exists */
  upsert?: T;
};

/**
 * Metadata for bulk delete operation
 */
export type BulkDeleteMeta = {
  _index?: string;
  _id: string;
  routing?: string;
  version?: number;
};

/**
 * Bulk operations builder interface
 */
export type BulkBuilder<T> = {
  /** Index a document (create or replace) */
  index: (doc: T, meta?: BulkIndexMeta) => BulkBuilder<T>;
  /** Create a new document (fails if already exists) */
  create: (doc: T, meta?: BulkCreateMeta) => BulkBuilder<T>;
  /** Update an existing document */
  update: (meta: BulkUpdateMeta<T>) => BulkBuilder<T>;
  /** Delete a document */
  delete: (meta: BulkDeleteMeta) => BulkBuilder<T>;
  /** Build as NDJSON string format for Elasticsearch */
  build: () => string;
  /** Build as array of objects */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildArray: () => any[];
};
