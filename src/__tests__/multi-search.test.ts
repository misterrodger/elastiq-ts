import { query, msearch } from '..';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

describe('Multi-Search API', () => {
  describe('Basic multi-search', () => {
    it('should build empty multi-search', () => {
      const result = msearch<Product>().build();
      expect(result).toBe('\n');
    });

    it('should build single search', () => {
      const q1 = query<Product>().match('name', 'laptop').build();
      const result = msearch<Product>().addQuery(q1).build();

      expect(result).toMatchInlineSnapshot(`
        "{}
        {"query":{"match":{"name":"laptop"}}}
        "
      `);
    });

    it('should build multiple searches', () => {
      const q1 = query<Product>().match('name', 'laptop').build();
      const q2 = query<Product>().term('category', 'electronics').build();

      const result = msearch<Product>().addQuery(q1).addQuery(q2).build();

      expect(result).toMatchInlineSnapshot(`
        "{}
        {"query":{"match":{"name":"laptop"}}}
        {}
        {"query":{"term":{"category":"electronics"}}}
        "
      `);
    });
  });

  describe('Multi-search with headers', () => {
    it('should add index to header', () => {
      const q1 = query<Product>().matchAll().build();
      const result = msearch<Product>()
        .addQuery(q1, { index: 'products' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"index":"products"}
        {"query":{"match_all":{}}}
        "
      `);
    });

    it('should add multiple indices', () => {
      const q1 = query<Product>().matchAll().build();
      const result = msearch<Product>()
        .addQuery(q1, { index: ['products-1', 'products-2'] })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"index":["products-1","products-2"]}
        {"query":{"match_all":{}}}
        "
      `);
    });

    it('should add routing', () => {
      const q1 = query<Product>().matchAll().build();
      const result = msearch<Product>()
        .addQuery(q1, { routing: 'user-123' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"routing":"user-123"}
        {"query":{"match_all":{}}}
        "
      `);
    });

    it('should add preference', () => {
      const q1 = query<Product>().matchAll().build();
      const result = msearch<Product>()
        .addQuery(q1, { preference: '_local' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"preference":"_local"}
        {"query":{"match_all":{}}}
        "
      `);
    });

    it('should add search_type', () => {
      const q1 = query<Product>().matchAll().build();
      const result = msearch<Product>()
        .addQuery(q1, { search_type: 'dfs_query_then_fetch' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"search_type":"dfs_query_then_fetch"}
        {"query":{"match_all":{}}}
        "
      `);
    });
  });

  describe('Multi-search output formats', () => {
    it('should build as NDJSON string', () => {
      const q1 = query<Product>().match('name', 'test').build();
      const result = msearch<Product>().addQuery(q1).build();

      expect(result).toMatchInlineSnapshot(`
        "{}
        {"query":{"match":{"name":"test"}}}
        "
      `);
    });

    it('should build as array', () => {
      const q1 = query<Product>().match('name', 'test').build();
      const result = msearch<Product>().addQuery(q1).buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {},
          {
            "query": {
              "match": {
                "name": "test",
              },
            },
          },
        ]
      `);
    });

    it('should alternate headers and bodies in array', () => {
      const q1 = query<Product>().match('name', 'laptop').build();
      const q2 = query<Product>().term('category', 'electronics').build();

      const result = msearch<Product>()
        .addQuery(q1, { index: 'products-1' })
        .addQuery(q2, { index: 'products-2' })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "index": "products-1",
          },
          {
            "query": {
              "match": {
                "name": "laptop",
              },
            },
          },
          {
            "index": "products-2",
          },
          {
            "query": {
              "term": {
                "category": "electronics",
              },
            },
          },
        ]
      `);
    });
  });

  describe('Multi-search method chaining', () => {
    it('should support fluent chaining', () => {
      const q1 = query<Product>().match('name', 'laptop').build();
      const q2 = query<Product>().term('category', 'electronics').build();
      const q3 = query<Product>().range('price', { gte: 100 }).build();

      const result = msearch<Product>()
        .addQuery(q1, { index: 'products' })
        .addQuery(q2, { index: 'products' })
        .addQuery(q3, { index: 'products' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"index":"products"}
        {"query":{"match":{"name":"laptop"}}}
        {"index":"products"}
        {"query":{"term":{"category":"electronics"}}}
        {"index":"products"}
        {"query":{"range":{"price":{"gte":100}}}}
        "
      `);
    });
  });

  describe('Real-world multi-search scenarios', () => {
    it('should search across multiple indices', () => {
      const laptopQuery = query<Product>()
        .match('name', 'laptop')
        .range('price', { gte: 500, lte: 2000 })
        .build();

      const phoneQuery = query<Product>()
        .match('name', 'smartphone')
        .range('price', { gte: 300, lte: 1000 })
        .build();

      const result = msearch<Product>()
        .addQuery(laptopQuery, { index: 'electronics' })
        .addQuery(phoneQuery, { index: 'electronics' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"index":"electronics"}
        {"query":{"range":{"price":{"gte":500,"lte":2000}}}}
        {"index":"electronics"}
        {"query":{"range":{"price":{"gte":300,"lte":1000}}}}
        "
      `);
    });

    it('should search with different preferences', () => {
      const localQuery = query<Product>().matchAll().size(10).build();
      const primaryQuery = query<Product>().matchAll().size(20).build();

      const result = msearch<Product>()
        .addQuery(localQuery, { preference: '_local' })
        .addQuery(primaryQuery, { preference: '_primary' })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "preference": "_local",
          },
          {
            "query": {
              "match_all": {},
            },
            "size": 10,
          },
          {
            "preference": "_primary",
          },
          {
            "query": {
              "match_all": {},
            },
            "size": 20,
          },
        ]
      `);
    });
  });
});
