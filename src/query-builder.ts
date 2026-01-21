import { QueryState, QueryBuilder } from './types';
import { Monad } from './helpers/monad';
import { createBoolBuilder } from './bool-builder';

export const createQueryBuilder = <T>(
  state: QueryState = {}
): QueryBuilder<T> => ({
  bool: () => createBoolBuilder<T>(state),

  match: (field, value) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({
          ...s,
          query: {
            match: {
              [field]: value
            }
          }
        }))
        .fold()
    ),

  term: (field, value) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({
          ...s,
          query: { term: { [field]: value } }
        }))
        .fold()
    ),

  terms: (field, values) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({
          ...s,
          query: { terms: { [field]: values } }
        }))
        .fold()
    ),

  exists: (field) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({
          ...s,
          query: { exists: { field } }
        }))
        .fold()
    ),

  prefix: (field, value) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({
          ...s,
          query: { prefix: { [field]: value } }
        }))
        .fold()
    ),

  wildcard: (field, value) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({
          ...s,
          query: { wildcard: { [field]: value } }
        }))
        .fold()
    ),

  when: (condition, builder) =>
    condition ? builder : createQueryBuilder<T>(state),

  // sort: (field, direction) =>
  //   createQueryBuilder<T>(
  //     Monad<T>(state).map(s => ({
  //       ...s,
  //       sort: [...(s.sort || []), { [field]: direction }]
  //     })).fold()
  //   ),

  from: (n) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({ ...s, from: n }))
        .fold()
    ),

  size: (n) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({ ...s, size: n }))
        .fold()
    ),

  source: (fields) =>
    createQueryBuilder<T>(
      Monad<T>(state)
        .map((s) => ({ ...s, _source: fields }))
        .fold()
    ),

  build: () => state
});

export type { QueryBuilder } from './types';
