/* eslint-disable @typescript-eslint/no-explicit-any */
export type MatchOptions = {
  operator?: 'and' | 'or';
  fuzziness?: string | number;
  boost?: number;
  analyzer?: string;
  zero_terms_query?: 'none' | 'all';
};

export type MultiMatchOptions = {
  type?:
    | 'best_fields'
    | 'most_fields'
    | 'cross_fields'
    | 'phrase'
    | 'phrase_prefix'
    | 'bool_prefix';
  operator?: 'and' | 'or';
  tie_breaker?: number;
  boost?: number;
};

export type FuzzyOptions = {
  fuzziness?: string | number;
  boost?: number;
};

export type QueryState<T> = {
  query?: any;
  from?: number;
  to?: number;
  size?: number;
  sort?: Array<{ [K in keyof T]: 'asc' | 'desc' }>;
  _source?: Array<keyof T>;
  timeout?: string;
  track_scores?: boolean;
  explain?: boolean;
  min_score?: number;
  version?: boolean;
  seq_no_primary_term?: boolean;
};

export type ClauseBuilder<T> = {
  matchAll: () => any;
  match: <K extends keyof T>(field: K, value: T[K], options?: MatchOptions) => any;
  multiMatch: <K extends keyof T>(
    fields: K[],
    value: string,
    options?: MultiMatchOptions
  ) => any;
  matchPhrase: <K extends keyof T>(field: K, value: T[K]) => any;
  term: <K extends keyof T>(field: K, value: T[K]) => any;
  terms: <K extends keyof T>(field: K, value: T[K]) => any;
  range: <K extends keyof T>(
    field: K,
    conditions: { gte?: T[K]; lte?: T[K]; gt?: T[K]; lt?: T[K] }
  ) => any;
  exists: <K extends keyof T>(field: K) => any;
  prefix: <K extends keyof T>(field: K, value: string) => any;
  wildcard: <K extends keyof T>(field: K, value: string) => any;
  fuzzy: <K extends keyof T>(field: K, value: string, options?: FuzzyOptions) => any;
};

export type QueryBuilder<T> = {
  bool: () => QueryBuilder<T>;
  must: (fn: (q: ClauseBuilder<T>) => any) => QueryBuilder<T>;
  mustNot: (fn: (q: ClauseBuilder<T>) => any) => QueryBuilder<T>;
  should: (fn: (q: ClauseBuilder<T>) => any) => QueryBuilder<T>;
  filter: (fn: (q: ClauseBuilder<T>) => any) => QueryBuilder<T>;
  minimumShouldMatch: (n: number) => QueryBuilder<T>;
  // Full-text queries
  matchAll: () => QueryBuilder<T>;
  match: <K extends keyof T>(
    field: K,
    value: T[K],
    options?: MatchOptions
  ) => QueryBuilder<T>;
  multiMatch: <K extends keyof T>(
    fields: K[],
    value: string,
    options?: MultiMatchOptions
  ) => QueryBuilder<T>;
  matchPhrase: <K extends keyof T>(field: K, value: T[K]) => QueryBuilder<T>;
  // queryString TBD
  // Term-level queries
  term: <K extends keyof T>(field: K, value: T[K]) => QueryBuilder<T>;
  terms: <K extends keyof T>(field: K, values: T[K][]) => QueryBuilder<T>;
  range: <K extends keyof T>(
    field: K,
    conditions: { gte?: T[K]; lte?: T[K]; gt?: T[K]; lt?: T[K] }
  ) => QueryBuilder<T>;
  exists: (field: keyof T) => QueryBuilder<T>;
  prefix: <K extends keyof T>(field: K, value: string) => QueryBuilder<T>;
  wildcard: <K extends keyof T>(field: K, value: string) => QueryBuilder<T>;
  fuzzy: <K extends keyof T>(
    field: K,
    value: string,
    options?: FuzzyOptions
  ) => QueryBuilder<T>;
  // Conditionals
  // when: (condition: any, builder: QueryBuilder<T>) => QueryBuilder<T>;
  // agg: TBD
  // Meta
  sort: <K extends keyof T>(
    field: K,
    direction: 'asc' | 'desc'
  ) => QueryBuilder<T>;
  from: (from: number) => QueryBuilder<T>;
  to: (to: number) => QueryBuilder<T>;
  size: (size: number) => QueryBuilder<T>;
  _source: (fields: Array<keyof T>) => QueryBuilder<T>;
  timeout: (timeout: string) => QueryBuilder<T>;
  trackScores: (track: boolean) => QueryBuilder<T>;
  explain: (explain: boolean) => QueryBuilder<T>;
  minScore: (score: number) => QueryBuilder<T>;
  version: (version: boolean) => QueryBuilder<T>;
  seqNoPrimaryTerm: (enabled: boolean) => QueryBuilder<T>;
  build: () => QueryState<T>;
};
