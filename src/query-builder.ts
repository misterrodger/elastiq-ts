import { QueryState, QueryBuilder, ClauseBuilder } from './types';

const createClauseBuilder = <T>(): ClauseBuilder<T> => ({
  match: (field, value) => ({ match: { [field]: value } }),
  term: (field, value) => ({ term: { [field]: value } }),
  terms: (field, value) => ({ terms: { [field]: value } }),
  range: (field, conditions) => ({ range: { [field]: conditions } }),
  matchAll: () => ({ match_all: {} })

  // TODO: exists, prefix, wildcard, when conditional
});

const clauseBuilder = createClauseBuilder();

export const createQueryBuilder = <T>(
  state: QueryState = {}
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
  match: (field, value) =>
    createQueryBuilder<T>({ ...state, query: { match: { [field]: value } } }),
  term: (field, value) =>
    createQueryBuilder<T>({ ...state, query: { term: { [field]: value } } }),
  terms: (field, value) =>
    createQueryBuilder<T>({ ...state, query: { terms: { [field]: value } } }),

  // TODO: exists, prefix, wildcard, when conditional

  range: (field, conditions) =>
    createQueryBuilder({ ...state, query: { range: { [field]: conditions } } }),

  // todo - sort

  // Pagination & source
  // size: (size) => createQueryBuilder({ ...state, size }),
  // from: (from) => createQueryBuilder({ ...state, from }),
  // to: (to) => createQueryBuilder({ ...state, to }),
  // source: (_source) => createQueryBuilder({ ...state, _source }),

  build: () => state
});
