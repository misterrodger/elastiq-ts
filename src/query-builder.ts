import { QueryState, QueryBuilder, ClauseBuilder } from './types';

const createClauseBuilder = <T>(): ClauseBuilder<T> => ({
  matchAll: () => ({ match_all: {} }),
  match: (field, value, options) => {
    if (!options || Object.keys(options).length === 0) {
      return { match: { [field]: value } };
    }
    return { match: { [field]: { query: value, ...options } } };
  },
  multiMatch: (fields, query, options) => {
    if (!options || Object.keys(options).length === 0) {
      return { multi_match: { fields, query } };
    }
    return { multi_match: { fields, query, ...options } };
  },
  matchPhrase: (field, query) => ({ match_phrase: { [field]: query } }),
  term: (field, value) => ({ term: { [field]: value } }),
  terms: (field, value) => ({ terms: { [field]: value } }),
  range: (field, conditions) => ({ range: { [field]: conditions } }),
  exists: (field) => ({ exists: { field } }),
  prefix: (field, value) => ({ prefix: { [field]: value } }),
  wildcard: (field, value) => ({ wildcard: { [field]: value } }),
  fuzzy: (field, value, options) => {
    if (!options || Object.keys(options).length === 0) {
      return { fuzzy: { [field]: { value } } };
    }
    return { fuzzy: { [field]: { value, ...options } } };
  }
  // TODO: when conditional
});

const clauseBuilder = createClauseBuilder();

export const createQueryBuilder = <T>(
  state: QueryState<T> = {}
): QueryBuilder<T> => ({
  bool: () => createQueryBuilder<T>({ ...state, query: { bool: {} } }),

  must: (builderFn) => {
    const clause = builderFn(clauseBuilder);
    const existing = state.query?.bool?.must || [];
    return createQueryBuilder({
      ...state,
      query: { bool: { ...state.query.bool, must: [...existing, clause] } }
    });
  },

  mustNot: (builderFn) => {
    const clause = builderFn(clauseBuilder);
    const existing = state.query?.bool?.must_not || [];
    return createQueryBuilder({
      ...state,
      query: { bool: { ...state.query.bool, must_not: [...existing, clause] } }
    });
  },

  should: (builderFn) => {
    const clause = builderFn(clauseBuilder);
    const existing = state.query?.bool?.should || [];
    return createQueryBuilder({
      ...state,
      query: { bool: { ...state.query.bool, should: [...existing, clause] } }
    });
  },

  filter: (builderFn) => {
    const clause = builderFn(clauseBuilder);
    const existing = state.query?.bool?.filter || [];
    return createQueryBuilder({
      ...state,
      query: { bool: { ...state.query.bool, filter: [...existing, clause] } }
    });
  },

  minimumShouldMatch: (value) => {
    return createQueryBuilder({
      ...state,
      query: { bool: { ...state.query.bool, minimum_should_match: value } }
    });
  },

  matchAll: () => createQueryBuilder<T>({ ...state, query: { match_all: {} } }),
  match: (field, value, options) => {
    if (!options || Object.keys(options).length === 0) {
      return createQueryBuilder<T>({ ...state, query: { match: { [field]: value } } });
    }
    return createQueryBuilder<T>({
      ...state,
      query: { match: { [field]: { query: value, ...options } } }
    });
  },
  multiMatch: (fields, query, options) => {
    if (!options || Object.keys(options).length === 0) {
      return createQueryBuilder<T>({
        ...state,
        query: { multi_match: { fields, query } }
      });
    }
    return createQueryBuilder<T>({
      ...state,
      query: { multi_match: { fields, query, ...options } }
    });
  },
  term: (field, value) =>
    createQueryBuilder<T>({ ...state, query: { term: { [field]: value } } }),
  matchPhrase: (field, value) =>
    createQueryBuilder<T>({
      ...state,
      query: { match_phrase: { [field]: value } }
    }),
  terms: (field, value) =>
    createQueryBuilder<T>({ ...state, query: { terms: { [field]: value } } }),
  exists: (field) =>
    createQueryBuilder<T>({ ...state, query: { exists: { field } } }),
  prefix: (field, value) =>
    createQueryBuilder<T>({ ...state, query: { prefix: { [field]: value } } }),
  wildcard: (field, value) =>
    createQueryBuilder<T>({
      ...state,
      query: { wildcard: { [field]: value } }
    }),
  fuzzy: (field, value, options) => {
    if (!options || Object.keys(options).length === 0) {
      return createQueryBuilder<T>({
        ...state,
        query: { fuzzy: { [field]: { value } } }
      });
    }
    return createQueryBuilder<T>({
      ...state,
      query: { fuzzy: { [field]: { value, ...options } } }
    });
  },

  // TODO: when conditional

  range: (field, conditions) =>
    createQueryBuilder({ ...state, query: { range: { [field]: conditions } } }),

  // Sort implementation
  sort: (field, direction = 'asc') => {
    const existing = state.sort || [];
    return createQueryBuilder({
      ...state,
      sort: [
        ...existing,
        { [field]: direction } as { [P in keyof T]: 'asc' | 'desc' }
      ]
    });
  },

  // Pagination & source
  from: (from) => createQueryBuilder({ ...state, from }),
  to: (to) => createQueryBuilder({ ...state, to }),
  size: (size) => createQueryBuilder({ ...state, size }),
  _source: (_source) => createQueryBuilder({ ...state, _source }),

  // Query parameters
  timeout: (timeout) => createQueryBuilder({ ...state, timeout }),
  trackScores: (track_scores) => createQueryBuilder({ ...state, track_scores }),
  explain: (explain) => createQueryBuilder({ ...state, explain }),
  minScore: (min_score) => createQueryBuilder({ ...state, min_score }),
  version: (version) => createQueryBuilder({ ...state, version }),
  seqNoPrimaryTerm: (seq_no_primary_term) =>
    createQueryBuilder({ ...state, seq_no_primary_term }),

  build: () => state
});
