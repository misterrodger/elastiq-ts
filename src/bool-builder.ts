import { BoolBuilder, QueryState } from './types';
import { Monad } from './helpers/monad';
import { createQueryBuilder } from './query-builder';

export const createBoolBuilder = <T>(
  state: QueryState = {}
): BoolBuilder<T> => {
  const ensureBool = (s: QueryState) => ({
    ...s,
    query: { bool: { ...(s.query?.bool || {}) } }
  });

  return {
    must: (fn) => {
      const innerBuilder = fn(createQueryBuilder<T>({}));
      const innerState = innerBuilder.build();

      return createBoolBuilder<T>(
        Monad<T>(state)
          .map((s) => {
            const boolState = ensureBool(s);
            return {
              ...boolState,
              query: {
                bool: {
                  ...boolState.query.bool,
                  must: [...(boolState.query.bool.must || []), innerState.query]
                }
              }
            };
          })
          .fold()
      );
    },

    should: (fn) => {
      const innerBuilder = fn(createQueryBuilder<T>({}));
      const innerState = innerBuilder.build();

      return createBoolBuilder<T>(
        Monad<T>(state)
          .map((s) => {
            const boolState = ensureBool(s);
            return {
              ...boolState,
              query: {
                bool: {
                  ...boolState.query.bool,
                  should: [
                    ...(boolState.query.bool.should || []),
                    innerState.query
                  ]
                }
              }
            };
          })
          .fold()
      );
    },

    mustNot: (fn) => {
      const innerBuilder = fn(createQueryBuilder<T>({}));
      const innerState = innerBuilder.build();

      return createBoolBuilder<T>(
        Monad<T>(state)
          .map((s) => {
            const boolState = ensureBool(s);
            return {
              ...boolState,
              query: {
                bool: {
                  ...boolState.query.bool,
                  must_not: [
                    ...(boolState.query.bool.must_not || []),
                    innerState.query
                  ]
                }
              }
            };
          })
          .fold()
      );
    },

    filter: (fn) => {
      const innerBuilder = fn(createQueryBuilder<T>({}));
      const innerState = innerBuilder.build();

      return createBoolBuilder<T>(
        Monad<T>(state)
          .map((s) => {
            const boolState = ensureBool(s);
            return {
              ...boolState,
              query: {
                bool: {
                  ...boolState.query.bool,
                  filter: [
                    ...(boolState.query.bool.filter || []),
                    innerState.query
                  ]
                }
              }
            };
          })
          .fold()
      );
    },

    minimumShouldMatch: (n) =>
      createBoolBuilder<T>(
        Monad<T>(state)
          .map((s) => {
            const boolState = ensureBool(s);
            return {
              ...boolState,
              query: {
                bool: {
                  ...boolState.query.bool,
                  minimum_should_match: n
                }
              }
            };
          })
          .fold()
      ),

    build: () => state
  };
};
