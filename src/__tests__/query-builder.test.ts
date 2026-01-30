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

  describe('TBC Features', () => {
    describe('Enhanced match with options', () => {
      it('should build match with operator option', () => {
        const result = query<TestIndex>()
          .match('type', 'test type', { operator: 'and' })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match": {
                "type": {
                  "operator": "and",
                  "query": "test type",
                },
              },
            },
          }
        `);
      });

      it('should build match with fuzziness option', () => {
        const result = query<TestIndex>()
          .match('type', 'test', { fuzziness: 'AUTO' })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match": {
                "type": {
                  "fuzziness": "AUTO",
                  "query": "test",
                },
              },
            },
          }
        `);
      });

      it('should build match with boost option', () => {
        const result = query<TestIndex>()
          .match('type', 'test', { boost: 2.0 })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match": {
                "type": {
                  "boost": 2,
                  "query": "test",
                },
              },
            },
          }
        `);
      });

      it('should build match with multiple options', () => {
        const result = query<TestIndex>()
          .match('type', 'test', {
            operator: 'and',
            fuzziness: 'AUTO',
            boost: 2.0,
            zero_terms_query: 'all'
          })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match": {
                "type": {
                  "boost": 2,
                  "fuzziness": "AUTO",
                  "operator": "and",
                  "query": "test",
                  "zero_terms_query": "all",
                },
              },
            },
          }
        `);
      });

      it('should build match without options (backwards compatible)', () => {
        const result = query<TestIndex>().match('type', 'test').build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match": {
                "type": "test",
              },
            },
          }
        `);
      });

      it('should build match in bool query with options', () => {
        const result = query<TestIndex>()
          .bool()
          .must((q) => q.match('type', 'test', { operator: 'and', boost: 2 }))
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {
                      "type": {
                        "boost": 2,
                        "operator": "and",
                        "query": "test",
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

    describe('Enhanced multi_match with options', () => {
      it('should build multi_match with type option', () => {
        const result = query<TestIndex>()
          .multiMatch(['type', 'name'], 'test', { type: 'best_fields' })
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
                "type": "best_fields",
              },
            },
          }
        `);
      });

      it('should build multi_match with tie_breaker option', () => {
        const result = query<TestIndex>()
          .multiMatch(['type', 'name'], 'test', {
            type: 'best_fields',
            tie_breaker: 0.3
          })
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
                "tie_breaker": 0.3,
                "type": "best_fields",
              },
            },
          }
        `);
      });

      it('should build multi_match with operator and boost', () => {
        const result = query<TestIndex>()
          .multiMatch(['type', 'name'], 'test', {
            operator: 'and',
            boost: 1.5
          })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "multi_match": {
                "boost": 1.5,
                "fields": [
                  "type",
                  "name",
                ],
                "operator": "and",
                "query": "test",
              },
            },
          }
        `);
      });

      it('should build multi_match without options (backwards compatible)', () => {
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

      it('should build multi_match in bool query with options', () => {
        const result = query<TestIndex>()
          .bool()
          .must((q) =>
            q.multiMatch(['type', 'name'], 'test', {
              type: 'cross_fields',
              operator: 'and'
            })
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "multi_match": {
                      "fields": [
                        "type",
                        "name",
                      ],
                      "operator": "and",
                      "query": "test",
                      "type": "cross_fields",
                    },
                  },
                ],
              },
            },
          }
        `);
      });
    });

    describe('Fuzzy query', () => {
      it('should build a fuzzy query at root level', () => {
        const result = query<TestIndex>().fuzzy('type', 'tst').build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "fuzzy": {
                "type": {
                  "value": "tst",
                },
              },
            },
          }
        `);
      });

      it('should build a fuzzy query with fuzziness option', () => {
        const result = query<TestIndex>()
          .fuzzy('type', 'tst', { fuzziness: 'AUTO' })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "fuzzy": {
                "type": {
                  "fuzziness": "AUTO",
                  "value": "tst",
                },
              },
            },
          }
        `);
      });

      it('should build a fuzzy query with numeric fuzziness', () => {
        const result = query<TestIndex>()
          .fuzzy('type', 'test', { fuzziness: 2 })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "fuzzy": {
                "type": {
                  "fuzziness": 2,
                  "value": "test",
                },
              },
            },
          }
        `);
      });

      it('should build a fuzzy query with boost option', () => {
        const result = query<TestIndex>()
          .fuzzy('type', 'test', { boost: 1.5 })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "fuzzy": {
                "type": {
                  "boost": 1.5,
                  "value": "test",
                },
              },
            },
          }
        `);
      });

      it('should build a fuzzy query with multiple options', () => {
        const result = query<TestIndex>()
          .fuzzy('type', 'test', { fuzziness: 'AUTO', boost: 2.0 })
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "fuzzy": {
                "type": {
                  "boost": 2,
                  "fuzziness": "AUTO",
                  "value": "test",
                },
              },
            },
          }
        `);
      });

      it('should build a fuzzy query in bool context', () => {
        const result = query<TestIndex>()
          .bool()
          .must((q) => q.fuzzy('type', 'test', { fuzziness: 'AUTO' }))
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "fuzzy": {
                      "type": {
                        "fuzziness": "AUTO",
                        "value": "test",
                      },
                    },
                  },
                ],
              },
            },
          }
        `);
      });

      it('should build a fuzzy query in should context', () => {
        const result = query<TestIndex>()
          .bool()
          .should((q) => q.fuzzy('name', 'john', { fuzziness: 1 }))
          .should((q) => q.match('type', 'test'))
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "should": [
                  {
                    "fuzzy": {
                      "name": {
                        "fuzziness": 1,
                        "value": "john",
                      },
                    },
                  },
                  {
                    "match": {
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

    describe('Query parameters', () => {
      it('should add timeout parameter', () => {
        const result = query<TestIndex>()
          .match('type', 'test')
          .timeout('5s')
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match": {
                "type": "test",
              },
            },
            "timeout": "5s",
          }
        `);
      });

      it('should add track_scores parameter', () => {
        const result = query<TestIndex>()
          .bool()
          .filter((q) => q.term('type', 'test'))
          .trackScores(true)
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "filter": [
                  {
                    "term": {
                      "type": "test",
                    },
                  },
                ],
              },
            },
            "track_scores": true,
          }
        `);
      });

      it('should add explain parameter', () => {
        const result = query<TestIndex>()
          .match('type', 'test')
          .explain(true)
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "explain": true,
            "query": {
              "match": {
                "type": "test",
              },
            },
          }
        `);
      });

      it('should add min_score parameter', () => {
        const result = query<TestIndex>()
          .match('type', 'test')
          .minScore(0.5)
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "min_score": 0.5,
            "query": {
              "match": {
                "type": "test",
              },
            },
          }
        `);
      });

      it('should add version parameter', () => {
        const result = query<TestIndex>()
          .term('type', 'test')
          .version(true)
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "term": {
                "type": "test",
              },
            },
            "version": true,
          }
        `);
      });

      it('should add seq_no_primary_term parameter', () => {
        const result = query<TestIndex>()
          .term('type', 'test')
          .seqNoPrimaryTerm(true)
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "term": {
                "type": "test",
              },
            },
            "seq_no_primary_term": true,
          }
        `);
      });

      it('should support multiple query parameters together', () => {
        const result = query<TestIndex>()
          .match('type', 'test', { operator: 'and', boost: 2 })
          .timeout('10s')
          .trackScores(true)
          .explain(true)
          .minScore(1.0)
          .from(0)
          .size(20)
          .sort('price', 'asc')
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "explain": true,
            "from": 0,
            "min_score": 1,
            "query": {
              "match": {
                "type": {
                  "boost": 2,
                  "operator": "and",
                  "query": "test",
                },
              },
            },
            "size": 20,
            "sort": [
              {
                "price": "asc",
              },
            ],
            "timeout": "10s",
            "track_scores": true,
          }
        `);
      });
    });

    describe('ids query', () => {
      it('should build an ids query at root level', () => {
        const result = query<TestIndex>()
          .ids(['id1', 'id2', 'id3'])
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "ids": {
                "values": [
                  "id1",
                  "id2",
                  "id3",
                ],
              },
            },
          }
        `);
      });

      it('should build an ids query with single id', () => {
        const result = query<TestIndex>()
          .ids(['single-id'])
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "ids": {
                "values": [
                  "single-id",
                ],
              },
            },
          }
        `);
      });

      it('should build an ids query in bool must context', () => {
        const result = query<TestIndex>()
          .bool()
          .must((q) => q.ids(['id1', 'id2']))
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "ids": {
                      "values": [
                        "id1",
                        "id2",
                      ],
                    },
                  },
                ],
              },
            },
          }
        `);
      });

      it('should build an ids query in bool filter context', () => {
        const result = query<TestIndex>()
          .bool()
          .filter((q) => q.ids(['id1', 'id2', 'id3']))
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "filter": [
                  {
                    "ids": {
                      "values": [
                        "id1",
                        "id2",
                        "id3",
                      ],
                    },
                  },
                ],
              },
            },
          }
        `);
      });

      it('should combine ids with other queries', () => {
        const result = query<TestIndex>()
          .bool()
          .must((q) => q.ids(['id1', 'id2']))
          .filter((q) => q.term('type', 'test'))
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "filter": [
                  {
                    "term": {
                      "type": "test",
                    },
                  },
                ],
                "must": [
                  {
                    "ids": {
                      "values": [
                        "id1",
                        "id2",
                      ],
                    },
                  },
                ],
              },
            },
          }
        `);
      });
    });

    describe('nested query', () => {
      it('should build a nested query with single clause', () => {
        const result = query<TestIndex>()
          .nested('type' as any, (q) =>
            q.match('comments.author', 'john')
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "nested": {
                "path": "type",
                "query": {
                  "match": {
                    "comments.author": "john",
                  },
                },
              },
            },
          }
        `);
      });

      it('should build a nested query with multiple term queries', () => {
        const result = query<TestIndex>()
          .nested('name' as any, (q) =>
            q.term('status', 'approved')
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "nested": {
                "path": "name",
                "query": {
                  "term": {
                    "status": "approved",
                  },
                },
              },
            },
          }
        `);
      });

      it('should build a nested query with score_mode option', () => {
        const result = query<TestIndex>()
          .nested(
            'type' as any,
            (q) => q.match('comments.author', 'john'),
            { score_mode: 'sum' }
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "nested": {
                "path": "type",
                "query": {
                  "match": {
                    "comments.author": "john",
                  },
                },
                "score_mode": "sum",
              },
            },
          }
        `);
      });

      it('should build a nested query with avg score_mode', () => {
        const result = query<TestIndex>()
          .nested(
            'name' as any,
            (q) => q.term('status', 'approved'),
            { score_mode: 'avg' }
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "nested": {
                "path": "name",
                "query": {
                  "term": {
                    "status": "approved",
                  },
                },
                "score_mode": "avg",
              },
            },
          }
        `);
      });

      it('should build a nested query with min score_mode', () => {
        const result = query<TestIndex>()
          .nested(
            'type' as any,
            (q) => q.term('status', 'pending'),
            { score_mode: 'min' }
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "nested": {
                "path": "type",
                "query": {
                  "term": {
                    "status": "pending",
                  },
                },
                "score_mode": "min",
              },
            },
          }
        `);
      });

      it('should build nested query with pagination', () => {
        const result = query<TestIndex>()
          .nested('type' as any, (q: any) =>
            q.match('author', 'john')
          )
          .from(0)
          .size(10)
          .sort('price', 'asc')
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "from": 0,
            "query": {
              "nested": {
                "path": "type",
                "query": {
                  "match": {
                    "author": "john",
                  },
                },
              },
            },
            "size": 10,
            "sort": [
              {
                "price": "asc",
              },
            ],
          }
        `);
      });
    });

    describe('when() conditional', () => {
      it('should execute thenFn when condition is truthy', () => {
        const searchTerm = 'test';
        const result = query<TestIndex>()
          .when(
            searchTerm,
            (q) => q.match('type', searchTerm)
          )!
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match": {
                "type": "test",
              },
            },
          }
        `);
      });

      it('should not add query when condition is falsy', () => {
        const searchTerm = undefined;
        const result = query<TestIndex>()
          .when(
            searchTerm,
            (q) => q.match('type', searchTerm as any)
          )
          ?.build();

        expect(result).toMatchInlineSnapshot(`undefined`);
      });

      it('should execute elseFn when condition is falsy', () => {
        const searchTerm = undefined;
        const result = query<TestIndex>()
          .when(
            searchTerm,
            (q) => q.match('type', 'fallback'),
            (q) => q.matchAll()
          )!
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "match_all": {},
            },
          }
        `);
      });

      it('should use when in bool must context with truthy condition', () => {
        const type = 'test';
        const result = query<TestIndex>()
          .bool()
          .must((q) =>
            q.when(
              type,
              (q2) => q2.term('type', type)
            ) || q.matchAll()
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "term": {
                      "type": "test",
                    },
                  },
                ],
              },
            },
          }
        `);
      });

      it('should use when in bool filter context', () => {
        const minPrice = 100;
        const result = query<TestIndex>()
          .bool()
          .filter((q) =>
            q.when(
              minPrice,
              (q2) => q2.range('price', { gte: minPrice })
            ) || q.matchAll()
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "filter": [
                  {
                    "range": {
                      "price": {
                        "gte": 100,
                      },
                    },
                  },
                ],
              },
            },
          }
        `);
      });

      it('should chain multiple when conditions', () => {
        const searchTerm = 'test';
        const type = 'test';
        const minPrice = 500;

        const result = query<TestIndex>()
          .bool()
          .must(
            (q) =>
              q.when(
                searchTerm,
                (q2) => q2.match('name', searchTerm)
              ) || q.matchAll()
          )
          .filter(
            (q) =>
              q.when(
                type,
                (q2) => q2.term('type', type)
              ) || q.matchAll()
          )
          .filter(
            (q) =>
              q.when(
                minPrice,
                (q2) => q2.range('price', { gte: minPrice })
              ) || q.matchAll()
          )
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "bool": {
                "filter": [
                  {
                    "term": {
                      "type": "test",
                    },
                  },
                  {
                    "range": {
                      "price": {
                        "gte": 500,
                      },
                    },
                  },
                ],
                "must": [
                  {
                    "match": {
                      "name": "test",
                    },
                  },
                ],
              },
            },
          }
        `);
      });

      it('should use when with empty string (falsy)', () => {
        const searchTerm = '';
        const result = query<TestIndex>()
          .when(
            searchTerm,
            (q) => q.match('type', searchTerm)
          )
          ?.build();

        expect(result).toMatchInlineSnapshot(`undefined`);
      });

      it('should use when with 0 (falsy)', () => {
        const minPrice = 0;
        const result = query<TestIndex>()
          .when(
            minPrice,
            (q) => q.range('price', { gte: minPrice })
          )
          ?.build();

        expect(result).toMatchInlineSnapshot(`undefined`);
      });

      it('should use when with empty array (falsy)', () => {
        const ids: string[] = [];
        const result = query<TestIndex>()
          .when(
            ids.length > 0,
            (q) => q.ids(ids)
          )
          ?.build();

        expect(result).toMatchInlineSnapshot(`undefined`);
      });

      it('should use when with non-empty array (truthy)', () => {
        const ids = ['id1', 'id2'];
        const result = query<TestIndex>()
          .when(
            ids.length > 0,
            (q) => q.ids(ids)
          )!
          .build();

        expect(result).toMatchInlineSnapshot(`
          {
            "query": {
              "ids": {
                "values": [
                  "id1",
                  "id2",
                ],
              },
            },
          }
        `);
      });
    });
  });
});
