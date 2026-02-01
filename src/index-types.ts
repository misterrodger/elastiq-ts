/**
 * Type definitions for Index Management
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/indices.html
 */

/**
 * Field mapping definition
 */
export type FieldMapping = {
  type:
    | 'text'
    | 'keyword'
    | 'long'
    | 'integer'
    | 'short'
    | 'byte'
    | 'double'
    | 'float'
    | 'half_float'
    | 'scaled_float'
    | 'date'
    | 'boolean'
    | 'binary'
    | 'integer_range'
    | 'float_range'
    | 'long_range'
    | 'double_range'
    | 'date_range'
    | 'ip'
    | 'alias'
    | 'object'
    | 'nested'
    | 'geo_point'
    | 'geo_shape'
    | 'completion'
    | 'dense_vector'
    | 'percolator';
  /** Multi-fields for different analyzers */
  fields?: Record<string, FieldMapping>;
  /** Text analyzer */
  analyzer?: string;
  /** Search-time analyzer */
  search_analyzer?: string;
  /** Field boost */
  boost?: number;
  /** Whether to index this field */
  index?: boolean;
  /** Whether to store this field */
  store?: boolean;
  /** Whether to use doc values */
  doc_values?: boolean;
  /** Similarity algorithm */
  similarity?: string;
  /** Dense vector dimensions */
  dims?: number;
  /** Dense vector index options */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  index_options?: any;
  /** Scaling factor for scaled_float type */
  scaling_factor?: number;
  /** Nested properties */
  properties?: Record<string, FieldMapping>;
};

/**
 * Index mappings configuration
 */
export type IndexMappings<T> = {
  /** Field mappings */
  properties: {
    [K in keyof T]?: FieldMapping;
  };
  /** Dynamic mapping behavior */
  dynamic?: boolean | 'strict' | 'runtime';
  /** Dynamic templates */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dynamic_templates?: any[];
};

/**
 * Index settings configuration
 */
export type IndexSettings = {
  /** Number of primary shards */
  number_of_shards?: number;
  /** Number of replica shards */
  number_of_replicas?: number;
  /** Refresh interval */
  refresh_interval?: string;
  /** Maximum result window */
  max_result_window?: number;
  /** Analysis settings */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analysis?: any;
};

/**
 * Create index options
 */
export type CreateIndexOptions<T> = {
  /** Index mappings */
  mappings?: IndexMappings<T>;
  /** Index settings */
  settings?: IndexSettings;
  /** Index aliases */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aliases?: Record<string, any>;
};

/**
 * Index builder interface
 */
export type IndexBuilder<T> = {
  /** Configure index mappings */
  mappings: (mappings: IndexMappings<T>) => IndexBuilder<T>;
  /** Configure index settings */
  settings: (settings: IndexSettings) => IndexBuilder<T>;
  /** Add an alias */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  alias: (name: string, options?: any) => IndexBuilder<T>;
  /** Build the index configuration */
  build: () => CreateIndexOptions<T>;
};
