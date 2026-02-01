/**
 * Index Management builder
 * Create and configure Elasticsearch indices
 */

import { IndexBuilder, CreateIndexOptions } from './index-types';

/**
 * Creates an index builder
 * @returns IndexBuilder instance
 */
export const createIndexBuilder = <T>(
  state: CreateIndexOptions<T> = {}
): IndexBuilder<T> => ({
  mappings: (mappings) => {
    return createIndexBuilder<T>({ ...state, mappings });
  },

  settings: (settings) => {
    return createIndexBuilder<T>({ ...state, settings });
  },

  alias: (name, options = {}) => {
    const aliases = state.aliases || {};
    return createIndexBuilder<T>({
      ...state,
      aliases: { ...aliases, [name]: options }
    });
  },

  build: () => state
});

/**
 * Create a new index builder
 * @example
 * const indexConfig = indexBuilder<Product>()
 *   .mappings({
 *     properties: {
 *       name: { type: 'text' },
 *       price: { type: 'float' },
 *       category: { type: 'keyword' }
 *     }
 *   })
 *   .settings({
 *     number_of_shards: 1,
 *     number_of_replicas: 1
 *   })
 *   .alias('products_alias')
 *   .build();
 */
export const indexBuilder = <T>() => createIndexBuilder<T>();
