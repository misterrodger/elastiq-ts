export type QueryState = {
  query?: any;
};

export type QueryBuilder<T> = {
  bool: () => BoolBuilder<T>;

  // Full-text queries
  match: <K extends keyof T>(field: K, value: T[K]) => QueryBuilder<T>;
  // multiMatch TBD
  // matchPhrase TBD
  // queryString TBD

  // Term-level queries
  term: <K extends keyof T>(field: K, value: T[K]) => QueryBuilder<T>;
  terms: <K extends keyof T>(field: K, values: T[K][]) => QueryBuilder<T>;
  // range TBD
  exists: (field: keyof T) => QueryBuilder<T>;
  prefix: <K extends keyof T>(field: K, value: string) => QueryBuilder<T>;
  wildcard: <K extends keyof T>(field: K, value: string) => QueryBuilder<T>;

  // Conditionals
  when: (condition: any, builder: QueryBuilder<T>) => QueryBuilder<T>;

  // agg: TBD

  // Meta
  // sort: (field: keyof T, direction: 'asc' | 'desc') => QueryBuilder<T>;
  from: (n: number) => QueryBuilder<T>;
  size: (n: number) => QueryBuilder<T>;
  source: (fields: (keyof T)[] | boolean) => QueryBuilder<T>;

  build: () => any;
};

export type BoolBuilder<T> = {
  must: (fn: (q: QueryBuilder<T>) => QueryBuilder<T>) => BoolBuilder<T>;
  should: (fn: (q: QueryBuilder<T>) => QueryBuilder<T>) => BoolBuilder<T>;
  mustNot: (fn: (q: QueryBuilder<T>) => QueryBuilder<T>) => BoolBuilder<T>;
  filter: (fn: (q: QueryBuilder<T>) => QueryBuilder<T>) => BoolBuilder<T>;
  minimumShouldMatch: (n: number) => BoolBuilder<T>;

  build: () => any;
};
