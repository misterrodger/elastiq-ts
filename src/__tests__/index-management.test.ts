import { indexBuilder } from '..';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  created_at: string;
  embedding: number[];
};

describe('Index Management', () => {
  describe('Mappings', () => {
    it('should build basic mappings', () => {
      const result = indexBuilder<Product>()
        .mappings({
          properties: {
            name: { type: 'text' },
            price: { type: 'float' },
            category: { type: 'keyword' }
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "mappings": {
            "properties": {
              "category": {
                "type": "keyword",
              },
              "name": {
                "type": "text",
              },
              "price": {
                "type": "float",
              },
            },
          },
        }
      `);
    });

    it('should build mappings with analyzers', () => {
      const result = indexBuilder<Product>()
        .mappings({
          properties: {
            name: {
              type: 'text',
              analyzer: 'standard',
              search_analyzer: 'english'
            }
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "mappings": {
            "properties": {
              "name": {
                "analyzer": "standard",
                "search_analyzer": "english",
                "type": "text",
              },
            },
          },
        }
      `);
    });

    it('should build mappings with multi-fields', () => {
      const result = indexBuilder<Product>()
        .mappings({
          properties: {
            name: {
              type: 'text',
              fields: {
                keyword: { type: 'keyword' },
                ngram: { type: 'text', analyzer: 'ngram' }
              }
            }
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "mappings": {
            "properties": {
              "name": {
                "fields": {
                  "keyword": {
                    "type": "keyword",
                  },
                  "ngram": {
                    "analyzer": "ngram",
                    "type": "text",
                  },
                },
                "type": "text",
              },
            },
          },
        }
      `);
    });

    it('should build mappings with nested fields', () => {
      type ProductWithNested = {
        name: string;
        variants: Array<{ size: string; color: string }>;
      };

      const result = indexBuilder<ProductWithNested>()
        .mappings({
          properties: {
            variants: {
              type: 'nested',
              properties: {
                size: { type: 'keyword' },
                color: { type: 'keyword' }
              }
            }
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "mappings": {
            "properties": {
              "variants": {
                "properties": {
                  "color": {
                    "type": "keyword",
                  },
                  "size": {
                    "type": "keyword",
                  },
                },
                "type": "nested",
              },
            },
          },
        }
      `);
    });

    it('should build mappings with dense_vector', () => {
      const result = indexBuilder<Product>()
        .mappings({
          properties: {
            embedding: {
              type: 'dense_vector',
              dims: 384,
              index_options: {
                type: 'hnsw',
                m: 16,
                ef_construction: 100
              }
            }
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "mappings": {
            "properties": {
              "embedding": {
                "dims": 384,
                "index_options": {
                  "ef_construction": 100,
                  "m": 16,
                  "type": "hnsw",
                },
                "type": "dense_vector",
              },
            },
          },
        }
      `);
    });

    it('should build mappings with dynamic setting', () => {
      const result = indexBuilder<Product>()
        .mappings({
          dynamic: 'strict',
          properties: {
            name: { type: 'text' }
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "mappings": {
            "dynamic": "strict",
            "properties": {
              "name": {
                "type": "text",
              },
            },
          },
        }
      `);
    });
  });

  describe('Settings', () => {
    it('should build basic settings', () => {
      const result = indexBuilder<Product>()
        .settings({
          number_of_shards: 2,
          number_of_replicas: 1
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "settings": {
            "number_of_replicas": 1,
            "number_of_shards": 2,
          },
        }
      `);
    });

    it('should configure refresh interval', () => {
      const result = indexBuilder<Product>()
        .settings({
          refresh_interval: '30s'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "settings": {
            "refresh_interval": "30s",
          },
        }
      `);
    });

    it('should configure max result window', () => {
      const result = indexBuilder<Product>()
        .settings({
          max_result_window: 100000
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "settings": {
            "max_result_window": 100000,
          },
        }
      `);
    });
  });

  describe('Aliases', () => {
    it('should add simple alias', () => {
      const result = indexBuilder<Product>().alias('products_alias').build();

      expect(result).toMatchInlineSnapshot(`
        {
          "aliases": {
            "products_alias": {},
          },
        }
      `);
    });

    it('should add multiple aliases', () => {
      const result = indexBuilder<Product>()
        .alias('products_read')
        .alias('products_write')
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "aliases": {
            "products_read": {},
            "products_write": {},
          },
        }
      `);
    });

    it('should add alias with filter', () => {
      const result = indexBuilder<Product>()
        .alias('electronics_alias', {
          filter: { term: { category: 'electronics' } }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "aliases": {
            "electronics_alias": {
              "filter": {
                "term": {
                  "category": "electronics",
                },
              },
            },
          },
        }
      `);
    });
  });

  describe('Complete index configuration', () => {
    it('should combine mappings, settings, and aliases', () => {
      const result = indexBuilder<Product>()
        .mappings({
          properties: {
            name: { type: 'text', analyzer: 'standard' },
            price: { type: 'float' },
            category: { type: 'keyword' },
            tags: { type: 'keyword' },
            created_at: { type: 'date' }
          }
        })
        .settings({
          number_of_shards: 2,
          number_of_replicas: 1,
          refresh_interval: '1s'
        })
        .alias('products_alias')
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "aliases": {
            "products_alias": {},
          },
          "mappings": {
            "properties": {
              "category": {
                "type": "keyword",
              },
              "created_at": {
                "type": "date",
              },
              "name": {
                "analyzer": "standard",
                "type": "text",
              },
              "price": {
                "type": "float",
              },
              "tags": {
                "type": "keyword",
              },
            },
          },
          "settings": {
            "number_of_replicas": 1,
            "number_of_shards": 2,
            "refresh_interval": "1s",
          },
        }
      `);
    });
  });

  describe('Real-world index configurations', () => {
    it('should build e-commerce product index', () => {
      const result = indexBuilder<Product>()
        .mappings({
          properties: {
            id: { type: 'keyword' },
            name: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                keyword: { type: 'keyword' },
                suggest: { type: 'completion' }
              }
            },
            description: { type: 'text', analyzer: 'english' },
            price: { type: 'float' },
            category: { type: 'keyword' },
            tags: { type: 'keyword' },
            created_at: { type: 'date' }
          }
        })
        .settings({
          number_of_shards: 3,
          number_of_replicas: 2,
          refresh_interval: '5s',
          max_result_window: 50000
        })
        .alias('products_live')
        .alias('products_search', {
          filter: { range: { price: { gte: 0 } } }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "aliases": {
            "products_live": {},
            "products_search": {
              "filter": {
                "range": {
                  "price": {
                    "gte": 0,
                  },
                },
              },
            },
          },
          "mappings": {
            "properties": {
              "category": {
                "type": "keyword",
              },
              "created_at": {
                "type": "date",
              },
              "description": {
                "analyzer": "english",
                "type": "text",
              },
              "id": {
                "type": "keyword",
              },
              "name": {
                "analyzer": "standard",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                  },
                  "suggest": {
                    "type": "completion",
                  },
                },
                "type": "text",
              },
              "price": {
                "type": "float",
              },
              "tags": {
                "type": "keyword",
              },
            },
          },
          "settings": {
            "max_result_window": 50000,
            "number_of_replicas": 2,
            "number_of_shards": 3,
            "refresh_interval": "5s",
          },
        }
      `);
    });

    it('should build vector search index', () => {
      type VectorProduct = {
        name: string;
        embedding: number[];
      };

      const result = indexBuilder<VectorProduct>()
        .mappings({
          properties: {
            name: { type: 'text' },
            embedding: {
              type: 'dense_vector',
              dims: 768,
              index: true,
              index_options: {
                type: 'hnsw',
                m: 16,
                ef_construction: 200
              }
            }
          }
        })
        .settings({
          number_of_shards: 1,
          number_of_replicas: 0
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "mappings": {
            "properties": {
              "embedding": {
                "dims": 768,
                "index": true,
                "index_options": {
                  "ef_construction": 200,
                  "m": 16,
                  "type": "hnsw",
                },
                "type": "dense_vector",
              },
              "name": {
                "type": "text",
              },
            },
          },
          "settings": {
            "number_of_replicas": 0,
            "number_of_shards": 1,
          },
        }
      `);
    });

    it('should build time-series index', () => {
      type LogEntry = {
        timestamp: string;
        level: string;
        message: string;
        source: string;
      };

      const result = indexBuilder<LogEntry>()
        .mappings({
          properties: {
            timestamp: { type: 'date' },
            level: { type: 'keyword' },
            message: { type: 'text' },
            source: { type: 'keyword' }
          }
        })
        .settings({
          number_of_shards: 1,
          number_of_replicas: 1,
          refresh_interval: '30s'
        })
        .alias('logs_current')
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "aliases": {
            "logs_current": {},
          },
          "mappings": {
            "properties": {
              "level": {
                "type": "keyword",
              },
              "message": {
                "type": "text",
              },
              "source": {
                "type": "keyword",
              },
              "timestamp": {
                "type": "date",
              },
            },
          },
          "settings": {
            "number_of_replicas": 1,
            "number_of_shards": 1,
            "refresh_interval": "30s",
          },
        }
      `);
    });
  });
});
