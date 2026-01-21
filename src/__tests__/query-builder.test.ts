import { query } from '..';

type TestIndex = {
  title: string;
  price: number;
};

describe('QueryBuilder', () => {
  describe('Root-level', () => {
    it('should build a match_all query', () => {
      const result = query<TestIndex>().matchAll().build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match_all": {},
          },
        }
      `);
    });

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
      const result = query<TestIndex>().term('title', 'test').build();

      expect(result).toMatchInlineSnapshot(`
               {
                 "query": {
                   "term": {
                     "title": "test",
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

    it('should build a range query', () => {
      const result = query<TestIndex>()
        .range('price', { gt: 1, lt: 100 })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "range": {
              "price": {
                "gt": 1,
                "lt": 100,
              },
            },
          },
        }
      `);
    });

    // it.skip('should build an exists query', () => {
    //   // const result = query<TestIndex>().exists('title').build();

    //   expect(result).toMatchInlineSnapshot(`
    //            {
    //              "query": {
    //                "exists": {
    //                  "field": "title",
    //                },
    //              },
    //            }
    //         `);
    // });

    it.skip('should build a prefix query', () => {
      // const result = query<TestIndex>().prefix('title', 'test').build();
      // expect(result).toMatchInlineSnapshot(`
      //          {
      //            "query": {
      //              "prefix": {
      //                "title": "test",
      //              },
      //            },
      //          }
      //       `);
    });

    // it('should build a wildcard query', () => {
    //   const result = query<TestIndex>().wildcard('title', 'test').build();

    //   expect(result).toMatchInlineSnapshot(`
    //            {
    //              "query": {
    //                "wildcard": {
    //                  "title": "test",
    //                },
    //              },
    //            }
    //         `);
    // });

    // it('should add a conditional query when defined', () => {
    //   const title = 'title exists';
    //   const result = query<TestIndex>()
    //     .bool()
    //     .filter((q) => q.when(title, q.term('title', title)))
    //     ._build();

    //   expect(result).toMatchInlineSnapshot(`
    //            {
    //              "query": {
    //                "bool": {
    //                  "filter": [
    //                    {
    //                      "term": {
    //                        "title": "title exists",
    //                      },
    //                    },
    //                  ],
    //                },
    //              },
    //            }
    //         `);
    // });

    // it('should NOT add a conditional query when undefined', () => {
    //   const title = undefined;
    //   const result = query<TestIndex>()
    //     .bool()
    //     .filter((q) => q.when(title, q.term('title', title!))) // TBD - fix this
    //     ._build();

    //   expect(result).toMatchInlineSnapshot(`
    //            {
    //              "query": {
    //                "bool": {
    //                  "filter": [
    //                    undefined,
    //                  ],
    //                },
    //              },
    //            }
    //         `);
    // });
  });

  describe('Boolean queries', () => {
    it('should build a bool with 1 must query', () => {
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

    it('should build a bool with 2 must queries', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.match('title', 'test title'))
        .must((q) => q.match('price', 42))
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

    it('should build a bool with 1 mustNot query', () => {
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

    it('should build a bool with 2 mustNot queries', () => {
      const result = query<TestIndex>()
        .bool()
        .mustNot((q) => q.match('title', 'test title'))
        .mustNot((q) => q.match('price', 42))
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

    it('should build a bool with 1 should query', () => {
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

    it('should build a bool with 2 should queries', () => {
      const result = query<TestIndex>()
        .bool()
        .should((q) => q.match('title', 'test title'))
        .should((q) => q.match('price', 42))
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

    it('should build a bool with one filter query', () => {
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

    it('should build a bool with minimumShouldMatch', () => {
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

    it('should build a bool with range', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.range('price', { gt: 1, lt: 100 }))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must": [
                {
                  "range": {
                    "price": {
                      "gt": 1,
                      "lt": 100,
                    },
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
