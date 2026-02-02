/**
 * Type definitions for Aggregations
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Options for terms aggregation
 */
export type TermsAggOptions = {
  /** Maximum number of buckets to return */
  size?: number;
  /** Minimum document count per bucket */
  min_doc_count?: number;
  /** Sort order for buckets */
  order?: { [key: string]: 'asc' | 'desc' };
  /** Default value for missing fields */
  missing?: string;
};

/**
 * Date histogram interval units
 */
export type DateHistogramInterval =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

/**
 * Options for date_histogram aggregation
 */
export type DateHistogramAggOptions = {
  /** Time interval for buckets */
  interval: string | DateHistogramInterval;
  /** Minimum document count per bucket */
  min_doc_count?: number;
  /** Sort order for buckets */
  order?: { [key: string]: 'asc' | 'desc' };
  /** Extend bucket range beyond data */
  extended_bounds?: {
    min?: number | string;
    max?: number | string;
  };
  /** Time zone for date calculations */
  time_zone?: string;
};

/**
 * Options for range aggregation
 */
export type RangeAggOptions = {
  /** Range definitions */
  ranges: Array<{
    from?: number | string;
    to?: number | string;
    key?: string;
  }>;
};

/**
 * Options for histogram aggregation
 */
export type HistogramAggOptions = {
  /** Numeric interval for buckets */
  interval: number;
  /** Minimum document count per bucket */
  min_doc_count?: number;
  /** Sort order for buckets */
  order?: { [key: string]: 'asc' | 'desc' };
  /** Extend bucket range beyond data */
  extended_bounds?: {
    min?: number;
    max?: number;
  };
};

/**
 * Options for avg aggregation
 */
export type AvgAggOptions = {
  /** Default value for missing fields */
  missing?: number;
};

/**
 * Options for sum aggregation
 */
export type SumAggOptions = {
  /** Default value for missing fields */
  missing?: number;
};

/**
 * Options for min aggregation
 */
export type MinAggOptions = {
  /** Default value for missing fields */
  missing?: number;
};

/**
 * Options for max aggregation
 */
export type MaxAggOptions = {
  /** Default value for missing fields */
  missing?: number;
};

/**
 * Options for cardinality aggregation
 */
export type CardinalityAggOptions = {
  /** Precision threshold for accuracy */
  precision_threshold?: number;
  /** Default value for missing fields */
  missing?: any;
};

/**
 * Options for percentiles aggregation
 */
export type PercentilesAggOptions = {
  /** Percentile values to calculate */
  percents?: number[];
  /** Return as object (true) or array (false) */
  keyed?: boolean;
  /** Default value for missing fields */
  missing?: number;
};

/**
 * Options for stats aggregation
 */
export type StatsAggOptions = {
  /** Default value for missing fields */
  missing?: number;
};

/**
 * Options for value_count aggregation
 */
export type ValueCountAggOptions = {
  /** Default value for missing fields */
  missing?: any;
};

/**
 * Aggregation state for build output
 */
export type AggregationState = {
  [key: string]: any;
};

/**
 * Aggregation builder interface
 */
export type AggregationBuilder<T> = {
  /** Terms aggregation - group by field values */
  terms: <K extends keyof T>(
    name: string,
    field: K,
    options?: TermsAggOptions
  ) => AggregationBuilder<T>;

  /** Date histogram aggregation - group by time intervals */
  dateHistogram: <K extends keyof T>(
    name: string,
    field: K,
    options: DateHistogramAggOptions
  ) => AggregationBuilder<T>;

  /** Range aggregation - group by numeric/date ranges */
  range: <K extends keyof T>(
    name: string,
    field: K,
    options: RangeAggOptions
  ) => AggregationBuilder<T>;

  /** Histogram aggregation - group by numeric intervals */
  histogram: <K extends keyof T>(
    name: string,
    field: K,
    options: HistogramAggOptions
  ) => AggregationBuilder<T>;

  /** Average aggregation */
  avg: <K extends keyof T>(
    name: string,
    field: K,
    options?: AvgAggOptions
  ) => AggregationBuilder<T>;

  /** Sum aggregation */
  sum: <K extends keyof T>(
    name: string,
    field: K,
    options?: SumAggOptions
  ) => AggregationBuilder<T>;

  /** Minimum value aggregation */
  min: <K extends keyof T>(
    name: string,
    field: K,
    options?: MinAggOptions
  ) => AggregationBuilder<T>;

  /** Maximum value aggregation */
  max: <K extends keyof T>(
    name: string,
    field: K,
    options?: MaxAggOptions
  ) => AggregationBuilder<T>;

  /** Cardinality aggregation - count unique values */
  cardinality: <K extends keyof T>(
    name: string,
    field: K,
    options?: CardinalityAggOptions
  ) => AggregationBuilder<T>;

  /** Percentiles aggregation */
  percentiles: <K extends keyof T>(
    name: string,
    field: K,
    options?: PercentilesAggOptions
  ) => AggregationBuilder<T>;

  /** Statistics aggregation (count, min, max, avg, sum) */
  stats: <K extends keyof T>(
    name: string,
    field: K,
    options?: StatsAggOptions
  ) => AggregationBuilder<T>;

  /** Value count aggregation */
  valueCount: <K extends keyof T>(
    name: string,
    field: K,
    options?: ValueCountAggOptions
  ) => AggregationBuilder<T>;

  /** Add sub-aggregation to parent bucket aggregation */
  subAgg: (
    fn: (agg: AggregationBuilder<T>) => AggregationBuilder<T>
  ) => AggregationBuilder<T>;

  /** Build aggregation DSL */
  build: () => AggregationState;
};

/**
 * Geo distance options
 */
export type GeoDistance = {
  /** Distance from center point */
  distance: string | number;
  /** Distance unit */
  unit?: 'mi' | 'km' | 'mm' | 'cm' | 'm' | 'yd' | 'ft' | 'in' | 'nmi';
};

/**
 * Geo bounding box coordinates
 */
export type GeoBoundingBox = {
  /** Top-left corner */
  top_left?: { lat: number; lon: number };
  /** Bottom-right corner */
  bottom_right?: { lat: number; lon: number };
  /** Top latitude */
  top?: number;
  /** Left longitude */
  left?: number;
  /** Bottom latitude */
  bottom?: number;
  /** Right longitude */
  right?: number;
};

/**
 * Geo polygon vertices
 */
export type GeoPolygon = {
  /** Polygon points */
  points: Array<{ lat: number; lon: number }>;
};

/**
 * Regular expression query options
 */
export type RegexpOptions = {
  /** Regexp flags */
  flags?: string;
  /** Maximum automaton states */
  max_determinized_states?: number;
  /** Score multiplier */
  boost?: number;
};

/**
 * Constant score query options
 */
export type ConstantScoreOptions = {
  /** Constant score value */
  boost?: number;
};
