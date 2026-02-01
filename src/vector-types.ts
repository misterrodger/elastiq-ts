/**
 * Type definitions for Elasticsearch vector search and KNN queries
 * Requires Elasticsearch 8.0+
 */

/**
 * Options for KNN (k-nearest neighbors) query
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-knn-query.html
 */
export type KnnOptions = {
  /** Number of nearest neighbors to return */
  k: number;
  /** Number of candidate documents to consider per shard */
  num_candidates: number;
  /** Optional filter to apply before KNN search */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: any;
  /** Boost value to apply to the KNN query */
  boost?: number;
  /** Minimum similarity score threshold */
  similarity?: number;
};

/**
 * Options for dense_vector field mapping
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html
 */
export type DenseVectorOptions = {
  /** Number of dimensions in the vector */
  dims: number;
  /** Whether to index the vector for fast search (default: true) */
  index?: boolean;
  /** Similarity metric for vector comparison */
  similarity?: 'l2_norm' | 'dot_product' | 'cosine';
  /** Index-specific options for vector search optimization */
  index_options?: {
    /** Type of vector index algorithm */
    type: 'hnsw' | 'int8_hnsw' | 'flat' | 'int8_flat';
    /** HNSW parameter: number of connections per node */
    m?: number;
    /** HNSW parameter: size of candidate list during index construction */
    ef_construction?: number;
  };
};
