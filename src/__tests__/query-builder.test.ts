import { query } from '..';

type TestIndex = {
  title: string;
  price: number;
};

describe('QueryBuilder', () => {
  it('should build a top-level match query', () => {
    const result = query<TestIndex>().match('title', 'test title').build();

    expect(result).toMatchInlineSnapshot(`
     {
       "query": {
         "match": {
           "title": "test title",
         },
       },
     }
    `);
  });

  describe('Root-level', () => {
    it('should build a match query', () => {
      const result = query<TestIndex>().match('title', 'test title').build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "match": {
                  "title": "test title",
                },
              },
            }
          `);
    });

    it('should build a term query', () => {
      const result = query<TestIndex>().term('title', 'test title').build();

      expect(result).toMatchInlineSnapshot(`
       {
         "query": {
           "term": {
             "title": "test title",
           },
         },
       }
      `);
    });

    it('should build a terms query', () => {
      const result = query<TestIndex>()
        .terms('title', ['test', 'title'])
        .build();

      expect(result).toMatchInlineSnapshot(`
       {
         "query": {
           "terms": {
             "title": [
               "test",
               "title",
             ],
           },
         },
       }
      `);
    });

    it('should build an exists query', () => {
      const result = query<TestIndex>().exists('title').build();

      expect(result).toMatchInlineSnapshot(`
       {
         "query": {
           "exists": {
             "field": "title",
           },
         },
       }
      `);
    });

    it('should build a prefix query', () => {
      const result = query<TestIndex>().prefix('title', 'test').build();

      expect(result).toMatchInlineSnapshot(`
       {
         "query": {
           "prefix": {
             "title": "test",
           },
         },
       }
      `);
    });

    it('should build a wildcard query', () => {
      const result = query<TestIndex>().wildcard('title', 'test').build();

      expect(result).toMatchInlineSnapshot(`
       {
         "query": {
           "wildcard": {
             "title": "test",
           },
         },
       }
      `);
    });

    it('should add a conditional query when defined', () => {
      const title = 'title exists';
      const result = query<TestIndex>()
        .bool()
        .filter((q) => q.when(title, q.term('title', title)))
        .build();

      expect(result).toMatchInlineSnapshot(`
       {
         "query": {
           "bool": {
             "filter": [
               {
                 "term": {
                   "title": "title exists",
                 },
               },
             ],
           },
         },
       }
      `);
    });

    it('should NOT add a conditional query when undefined', () => {
      const title = undefined;
      const result = query<TestIndex>()
        .bool()
        .filter((q) => q.when(title, q.term('title', title!))) // TBD - fix this
        .build();

      expect(result).toMatchInlineSnapshot(`
       {
         "query": {
           "bool": {
             "filter": [
               undefined,
             ],
           },
         },
       }
      `);
    });
  });

  describe('BoolBuilder', () => {
    it('should build a bool.must query', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.match('title', 'test title'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "must": [
                    {
                      "match": {
                        "title": "test title",
                      },
                    },
                  ],
                },
              },
            }
          `);
    });

    it('should build a bool.should query', () => {
      const result = query<TestIndex>()
        .bool()
        .should((q) => q.match('title', 'test title'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "should": [
                    {
                      "match": {
                        "title": "test title",
                      },
                    },
                  ],
                },
              },
            }
          `);
    });

    it('should build a bool.mustNot query', () => {
      const result = query<TestIndex>()
        .bool()
        .mustNot((q) => q.match('title', 'test title'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "must_not": [
                    {
                      "match": {
                        "title": "test title",
                      },
                    },
                  ],
                },
              },
            }
          `);
    });

    it('should build a bool query with minimumShouldMatch', () => {
      const result = query<TestIndex>()
        .bool()
        .filter((q) => q.match('title', 'test title'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "filter": [
                    {
                      "match": {
                        "title": "test title",
                      },
                    },
                  ],
                },
              },
            }
          `);
    });

    it('should build a query with bool.minimumShouldMatch', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.match('title', 'test title'))
        .must((q) => q.match('price', 42))
        .minimumShouldMatch(1)
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "minimum_should_match": 1,
                  "must": [
                    {
                      "match": {
                        "title": "test title",
                      },
                    },
                    {
                      "match": {
                        "price": 42,
                      },
                    },
                  ],
                },
              },
            }
          `);
    });
  });
});
