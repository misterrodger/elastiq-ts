import { QueryState } from '../types';

export const Monad = <T>(state: QueryState) => ({
  map: (fn: (s: QueryState) => QueryState) => Monad<T>(fn(state)),
  fold: () => state
});
