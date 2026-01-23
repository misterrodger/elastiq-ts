import { query } from '..';

type TestIndex = {
  type: string;
  name: string;
  price: number;
  size: number;
};

describe('QueryBuilder', () => {
  describe('Meta properties', () => {
    it('should add from', () => {
      const result = query<TestIndex>().match('type', 'test').from(1).build();

      expect(result).toMatchInlineSnapshot(`
        {
          "from": 1,
          "query": {
            "match": {
              "type": "test",
            },
          },
        }
      `);
    });
    it('should add to', () => {
      const result = query<TestIndex>().match('type', 'test').to(1).build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "type": "test",
            },
          },
          "to": 1,
        }
      `);
    });
    it('should add size', () => {
      const result = query<TestIndex>().match('type', 'test').size(1).build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "type": "test",
            },
          },
          "size": 1,
        }
      `);
    });

    it('should add source', () => {
      const result = query<TestIndex>()
        .match('type', 'test')
        ._source(['type', 'size'])
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "_source": [
            "type",
            "size",
          ],
          "query": {
            "match": {
              "type": "test",
            },
          },
        }
      `);
    });

    it('should add sort', () => {
      const result = query<TestIndex>()
        .match('type', 'test')
        .sort('size', 'asc')
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "type": "test",
            },
          },
          "sort": [
            {
              "size": "asc",
            },
          ],
        }
      `);
    });
  });
  describe('Root-level queries', () => {
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
      const result = query<TestIndex>().match('type', 'test type').build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "match": {
                  "type": "test type",
                },
              },
            }
          `);
    });

    it('should build a multi_match query', () => {
      const result = query<TestIndex>()
        .multiMatch(['type', 'name'], 'test')
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "multi_match": {
              "fields": [
                "type",
                "name",
              ],
              "query": "test",
            },
          },
        }
      `);
    });

    it('should build a match_phrase query', () => {
      const result = query<TestIndex>().matchPhrase('type', 'test').build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match_phrase": {
              "type": "test",
            },
          },
        }
      `);
    });

    it('should build a term query', () => {
      const result = query<TestIndex>().term('type', 'test').build();

      expect(result).toMatchInlineSnapshot(`
               {
                 "query": {
                   "term": {
                     "type": "test",
                   },
                 },
               }
            `);
    });

    it('should build a terms query', () => {
      const result = query<TestIndex>().terms('type', ['test', 'type']).build();

      expect(result).toMatchInlineSnapshot(`
               {
                 "query": {
                   "terms": {
                     "type": [
                       "test",
                       "type",
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

    it('should build an exists query', () => {
      const result = query<TestIndex>().exists('type').build();

      expect(result).toMatchInlineSnapshot(`
               {
                 "query": {
                   "exists": {
                     "field": "type",
                   },
                 },
               }
            `);
    });

    it('should build a prefix query', () => {
      const result = query<TestIndex>().prefix('type', 'test').build();
      expect(result).toMatchInlineSnapshot(`
               {
                 "query": {
                   "prefix": {
                     "type": "test",
                   },
                 },
               }
            `);
    });

    it('should build a wildcard query', () => {
      const result = query<TestIndex>().wildcard('type', 'test').build();

      expect(result).toMatchInlineSnapshot(`
               {
                 "query": {
                   "wildcard": {
                     "type": "test",
                   },
                 },
               }
            `);
    });

    // it('should add a conditional query when defined', () => {
    //   const type = 'type exists';
    //   const result = query<TestIndex>()
    //     .bool()
    //     .filter((q) => q.when(type, q.term('type', type)))
    //     ._build();

    //   expect(result).toMatchInlineSnapshot(`
    //            {
    //              "query": {
    //                "bool": {
    //                  "filter": [
    //                    {
    //                      "term": {
    //                        "type": "type exists",
    //                      },
    //                    },
    //                  ],
    //                },
    //              },
    //            }
    //         `);
    // });

    // it('should NOT add a conditional query when undefined', () => {
    //   const type = undefined;
    //   const result = query<TestIndex>()
    //     .bool()
    //     .filter((q) => q.when(type, q.term('type', type!))) // TBD - fix this
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
        .must((q) => q.match('type', 'test type'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "must": [
                    {
                      "match": {
                        "type": "test type",
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
        .must((q) => q.match('type', 'test type'))
        .must((q) => q.match('price', 42))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must": [
                {
                  "match": {
                    "type": "test type",
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
        .mustNot((q) => q.match('type', 'test type'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "must_not": [
                    {
                      "match": {
                        "type": "test type",
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
        .mustNot((q) => q.match('type', 'test type'))
        .mustNot((q) => q.match('price', 42))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must_not": [
                {
                  "match": {
                    "type": "test type",
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
        .should((q) => q.match('type', 'test type'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "should": [
                    {
                      "match": {
                        "type": "test type",
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
        .should((q) => q.match('type', 'test type'))
        .should((q) => q.match('price', 42))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "should": [
                {
                  "match": {
                    "type": "test type",
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
        .filter((q) => q.match('type', 'test type'))
        .build();

      expect(result).toMatchInlineSnapshot(`
            {
              "query": {
                "bool": {
                  "filter": [
                    {
                      "match": {
                        "type": "test type",
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
        .must((q) => q.match('type', 'test type'))
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
                        "type": "test type",
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
        .must((q) => q.range('size', { gte: 1, lte: 100 }))
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
                {
                  "range": {
                    "size": {
                      "gte": 1,
                      "lte": 100,
                    },
                  },
                },
              ],
            },
          },
        }
      `);
    });

    it('should build a bool with exists', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.exists('price'))
        .must((q) => q.exists('type'))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must": [
                {
                  "exists": {
                    "field": "price",
                  },
                },
                {
                  "exists": {
                    "field": "type",
                  },
                },
              ],
            },
          },
        }
      `);
    });

    it('should build a bool with prefix', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.prefix('type', 'pr'))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must": [
                {
                  "prefix": {
                    "type": "pr",
                  },
                },
              ],
            },
          },
        }
      `);
    });

    it('should build a bool with wildcard', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.wildcard('price', 'pr'))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must": [
                {
                  "wildcard": {
                    "price": "pr",
                  },
                },
              ],
            },
          },
        }
      `);
    });

    it('should build a bool with multi_match', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.multiMatch(['name', 'type'], 'test'))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must": [
                {
                  "multi_match": {
                    "fields": [
                      "name",
                      "type",
                    ],
                    "query": "test",
                  },
                },
              ],
            },
          },
        }
      `);
    });

    it('should build a bool with match_phrase', () => {
      const result = query<TestIndex>()
        .bool()
        .must((q) => q.matchPhrase('type', 'test'))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "must": [
                {
                  "match_phrase": {
                    "type": "test",
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
