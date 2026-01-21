import { createQueryBuilder } from './query-builder';

export const query = <T>() => createQueryBuilder<T>();
