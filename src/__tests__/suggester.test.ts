import { query, suggest } from '..';

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  suggest_field: string;
};

describe('Suggester API', () => {
  describe('Term Suggester', () => {
    it('should build basic term suggester', () => {
      const result = suggest<Product>()
        .term('name-suggestions', 'laptpo', {
          field: 'name'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should build term suggester with size', () => {
      const result = suggest<Product>()
        .term('name-suggestions', 'laptpo', {
          field: 'name',
          size: 5
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
                "size": 5,
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should build term suggester with suggest_mode', () => {
      const result = suggest<Product>()
        .term('name-suggestions', 'laptpo', {
          field: 'name',
          suggest_mode: 'popular'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
                "suggest_mode": "popular",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should build term suggester with string_distance', () => {
      const result = suggest<Product>()
        .term('name-suggestions', 'laptpo', {
          field: 'name',
          string_distance: 'levenshtein'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
                "string_distance": "levenshtein",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should build term suggester with max_edits', () => {
      const result = suggest<Product>()
        .term('name-suggestions', 'laptpo', {
          field: 'name',
          max_edits: 2
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
                "max_edits": 2,
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should build term suggester with all options', () => {
      const result = suggest<Product>()
        .term('name-suggestions', 'laptpo', {
          field: 'name',
          size: 5,
          sort: 'score',
          suggest_mode: 'popular',
          max_edits: 2,
          prefix_length: 1,
          min_word_length: 4,
          min_doc_freq: 0.01
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
                "max_edits": 2,
                "min_doc_freq": 0.01,
                "min_word_length": 4,
                "prefix_length": 1,
                "size": 5,
                "sort": "score",
                "suggest_mode": "popular",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });
  });

  describe('Phrase Suggester', () => {
    it('should build basic phrase suggester', () => {
      const result = suggest<Product>()
        .phrase('description-suggestions', 'powerfull laptop', {
          field: 'description'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "description-suggestions": {
              "phrase": {
                "field": "description",
              },
              "text": "powerfull laptop",
            },
          },
        }
      `);
    });

    it('should build phrase suggester with confidence', () => {
      const result = suggest<Product>()
        .phrase('description-suggestions', 'powerfull laptop', {
          field: 'description',
          confidence: 2.0
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "description-suggestions": {
              "phrase": {
                "confidence": 2,
                "field": "description",
              },
              "text": "powerfull laptop",
            },
          },
        }
      `);
    });

    it('should build phrase suggester with direct_generator', () => {
      const result = suggest<Product>()
        .phrase('description-suggestions', 'powerfull laptop', {
          field: 'description',
          direct_generator: [
            {
              field: 'description',
              suggest_mode: 'always',
              min_word_length: 1
            }
          ]
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "description-suggestions": {
              "phrase": {
                "direct_generator": [
                  {
                    "field": "description",
                    "min_word_length": 1,
                    "suggest_mode": "always",
                  },
                ],
                "field": "description",
              },
              "text": "powerfull laptop",
            },
          },
        }
      `);
    });

    it('should build phrase suggester with highlighting', () => {
      const result = suggest<Product>()
        .phrase('description-suggestions', 'powerfull laptop', {
          field: 'description',
          pre_tag: '<em>',
          post_tag: '</em>'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "description-suggestions": {
              "phrase": {
                "field": "description",
                "post_tag": "</em>",
                "pre_tag": "<em>",
              },
              "text": "powerfull laptop",
            },
          },
        }
      `);
    });

    it('should build phrase suggester with collate', () => {
      const result = suggest<Product>()
        .phrase('description-suggestions', 'powerfull laptop', {
          field: 'description',
          collate: {
            query: {
              source: {
                match: {
                  '{{field_name}}': '{{suggestion}}'
                }
              }
            },
            params: { field_name: 'description' },
            prune: true
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "description-suggestions": {
              "phrase": {
                "collate": {
                  "params": {
                    "field_name": "description",
                  },
                  "prune": true,
                  "query": {
                    "source": {
                      "match": {
                        "{{field_name}}": "{{suggestion}}",
                      },
                    },
                  },
                },
                "field": "description",
              },
              "text": "powerfull laptop",
            },
          },
        }
      `);
    });

    it('should build phrase suggester with all options', () => {
      const result = suggest<Product>()
        .phrase('description-suggestions', 'powerfull laptop', {
          field: 'description',
          size: 3,
          real_word_error_likelihood: 0.95,
          confidence: 2.0,
          max_errors: 0.5,
          gram_size: 3,
          pre_tag: '<em>',
          post_tag: '</em>'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "description-suggestions": {
              "phrase": {
                "confidence": 2,
                "field": "description",
                "gram_size": 3,
                "max_errors": 0.5,
                "post_tag": "</em>",
                "pre_tag": "<em>",
                "real_word_error_likelihood": 0.95,
                "size": 3,
              },
              "text": "powerfull laptop",
            },
          },
        }
      `);
    });
  });

  describe('Completion Suggester', () => {
    it('should build basic completion suggester', () => {
      const result = suggest<Product>()
        .completion('autocomplete', 'lap', {
          field: 'suggest_field'
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "autocomplete": {
              "completion": {
                "field": "suggest_field",
              },
              "prefix": "lap",
            },
          },
        }
      `);
    });

    it('should build completion suggester with size', () => {
      const result = suggest<Product>()
        .completion('autocomplete', 'lap', {
          field: 'suggest_field',
          size: 10
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "autocomplete": {
              "completion": {
                "field": "suggest_field",
                "size": 10,
              },
              "prefix": "lap",
            },
          },
        }
      `);
    });

    it('should build completion suggester with skip_duplicates', () => {
      const result = suggest<Product>()
        .completion('autocomplete', 'lap', {
          field: 'suggest_field',
          skip_duplicates: true
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "autocomplete": {
              "completion": {
                "field": "suggest_field",
                "skip_duplicates": true,
              },
              "prefix": "lap",
            },
          },
        }
      `);
    });

    it('should build completion suggester with fuzzy matching', () => {
      const result = suggest<Product>()
        .completion('autocomplete', 'lap', {
          field: 'suggest_field',
          fuzzy: {
            fuzziness: 'AUTO',
            transpositions: true,
            min_length: 3,
            prefix_length: 1
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "autocomplete": {
              "completion": {
                "field": "suggest_field",
                "fuzzy": {
                  "fuzziness": "AUTO",
                  "min_length": 3,
                  "prefix_length": 1,
                  "transpositions": true,
                },
              },
              "prefix": "lap",
            },
          },
        }
      `);
    });

    it('should build completion suggester with contexts', () => {
      const result = suggest<Product>()
        .completion('autocomplete', 'lap', {
          field: 'suggest_field',
          contexts: {
            category: 'electronics'
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "autocomplete": {
              "completion": {
                "contexts": {
                  "category": "electronics",
                },
                "field": "suggest_field",
              },
              "prefix": "lap",
            },
          },
        }
      `);
    });

    it('should build completion suggester with all options', () => {
      const result = suggest<Product>()
        .completion('autocomplete', 'lap', {
          field: 'suggest_field',
          size: 10,
          skip_duplicates: true,
          fuzzy: {
            fuzziness: 2,
            transpositions: true,
            min_length: 3,
            prefix_length: 1,
            unicode_aware: false
          },
          contexts: {
            category: ['electronics', 'computers']
          }
        })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "autocomplete": {
              "completion": {
                "contexts": {
                  "category": [
                    "electronics",
                    "computers",
                  ],
                },
                "field": "suggest_field",
                "fuzzy": {
                  "fuzziness": 2,
                  "min_length": 3,
                  "prefix_length": 1,
                  "transpositions": true,
                  "unicode_aware": false,
                },
                "size": 10,
                "skip_duplicates": true,
              },
              "prefix": "lap",
            },
          },
        }
      `);
    });
  });

  describe('Multiple Suggesters', () => {
    it('should combine multiple term suggesters', () => {
      const result = suggest<Product>()
        .term('name-suggestions', 'laptpo', { field: 'name' })
        .term('category-suggestions', 'electornics', { field: 'category' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "category-suggestions": {
              "term": {
                "field": "category",
              },
              "text": "electornics",
            },
            "name-suggestions": {
              "term": {
                "field": "name",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should combine different suggester types', () => {
      const result = suggest<Product>()
        .term('name-term', 'laptpo', { field: 'name' })
        .phrase('description-phrase', 'powerfull laptop', {
          field: 'description'
        })
        .completion('name-complete', 'lap', { field: 'suggest_field' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "suggest": {
            "description-phrase": {
              "phrase": {
                "field": "description",
              },
              "text": "powerfull laptop",
            },
            "name-complete": {
              "completion": {
                "field": "suggest_field",
              },
              "prefix": "lap",
            },
            "name-term": {
              "term": {
                "field": "name",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });
  });

  describe('Suggester with QueryBuilder', () => {
    it('should add term suggester to query', () => {
      const result = query<Product>()
        .match('category', 'electronics')
        .suggest((s) => s.term('name-suggestions', 'laptpo', { field: 'name' }))
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "category": "electronics",
            },
          },
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should add phrase suggester to query', () => {
      const result = query<Product>()
        .match('category', 'electronics')
        .suggest((s) =>
          s.phrase('description-suggestions', 'powerfull laptop', {
            field: 'description',
            confidence: 2.0
          })
        )
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "category": "electronics",
            },
          },
          "suggest": {
            "description-suggestions": {
              "phrase": {
                "confidence": 2,
                "field": "description",
              },
              "text": "powerfull laptop",
            },
          },
        }
      `);
    });

    it('should add completion suggester to query', () => {
      const result = query<Product>()
        .match('category', 'electronics')
        .suggest((s) =>
          s.completion('autocomplete', 'lap', {
            field: 'suggest_field',
            size: 5
          })
        )
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "category": "electronics",
            },
          },
          "suggest": {
            "autocomplete": {
              "completion": {
                "field": "suggest_field",
                "size": 5,
              },
              "prefix": "lap",
            },
          },
        }
      `);
    });

    it('should add multiple suggesters to query', () => {
      const result = query<Product>()
        .match('category', 'electronics')
        .suggest((s) =>
          s
            .term('name-term', 'laptpo', { field: 'name', size: 3 })
            .completion('name-complete', 'lap', {
              field: 'suggest_field',
              size: 5
            })
        )
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "category": "electronics",
            },
          },
          "suggest": {
            "name-complete": {
              "completion": {
                "field": "suggest_field",
                "size": 5,
              },
              "prefix": "lap",
            },
            "name-term": {
              "term": {
                "field": "name",
                "size": 3,
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should combine query, aggregations, and suggestions', () => {
      const result = query<Product>()
        .match('category', 'electronics')
        .aggs((agg) => agg.terms('popular-brands', 'name', { size: 10 }))
        .suggest((s) =>
          s.term('name-suggestions', 'laptpo', { field: 'name', size: 5 })
        )
        .size(20)
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "aggs": {
            "popular-brands": {
              "terms": {
                "field": "name",
                "size": 10,
              },
            },
          },
          "query": {
            "match": {
              "category": "electronics",
            },
          },
          "size": 20,
          "suggest": {
            "name-suggestions": {
              "term": {
                "field": "name",
                "size": 5,
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });
  });

  describe('Suggester method chaining', () => {
    it('should support fluent chaining', () => {
      const result = suggest<Product>()
        .term('name-term', 'laptpo', { field: 'name' })
        .phrase('desc-phrase', 'powerfull', { field: 'description' })
        .completion('auto', 'lap', { field: 'suggest_field' })
        .build();

      expect(result.suggest).toHaveProperty('name-term');
      expect(result.suggest).toHaveProperty('desc-phrase');
      expect(result.suggest).toHaveProperty('auto');
    });
  });

  describe('Real-world suggester scenarios', () => {
    it('should build product search with autocomplete', () => {
      const result = query<Product>()
        .bool()
        .filter((q) => q.term('category', 'electronics'))
        .suggest((s) =>
          s.completion('product-autocomplete', 'lapt', {
            field: 'suggest_field',
            size: 10,
            fuzzy: {
              fuzziness: 'AUTO',
              prefix_length: 1
            },
            skip_duplicates: true
          })
        )
        .size(0)
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "bool": {
              "filter": [
                {
                  "term": {
                    "category": "electronics",
                  },
                },
              ],
            },
          },
          "size": 0,
          "suggest": {
            "product-autocomplete": {
              "completion": {
                "field": "suggest_field",
                "fuzzy": {
                  "fuzziness": "AUTO",
                  "prefix_length": 1,
                },
                "size": 10,
                "skip_duplicates": true,
              },
              "prefix": "lapt",
            },
          },
        }
      `);
    });

    it('should build spell-check with term suggester', () => {
      const result = query<Product>()
        .match('name', 'laptpo')
        .suggest((s) =>
          s.term('spelling-correction', 'laptpo', {
            field: 'name',
            size: 3,
            suggest_mode: 'popular',
            string_distance: 'levenshtein',
            max_edits: 2,
            prefix_length: 0,
            min_word_length: 3
          })
        )
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "name": "laptpo",
            },
          },
          "suggest": {
            "spelling-correction": {
              "term": {
                "field": "name",
                "max_edits": 2,
                "min_word_length": 3,
                "prefix_length": 0,
                "size": 3,
                "string_distance": "levenshtein",
                "suggest_mode": "popular",
              },
              "text": "laptpo",
            },
          },
        }
      `);
    });

    it('should build phrase correction with highlighting', () => {
      const result = query<Product>()
        .match('description', 'powerfull gaming laptop')
        .suggest((s) =>
          s.phrase('phrase-correction', 'powerfull gaming laptop', {
            field: 'description',
            size: 3,
            confidence: 1.5,
            max_errors: 1,
            pre_tag: '<strong>',
            post_tag: '</strong>',
            direct_generator: [
              {
                field: 'description',
                suggest_mode: 'always',
                max_edits: 2,
                min_word_length: 3
              }
            ]
          })
        )
        .build();

      expect(result).toMatchInlineSnapshot(`
        {
          "query": {
            "match": {
              "description": "powerfull gaming laptop",
            },
          },
          "suggest": {
            "phrase-correction": {
              "phrase": {
                "confidence": 1.5,
                "direct_generator": [
                  {
                    "field": "description",
                    "max_edits": 2,
                    "min_word_length": 3,
                    "suggest_mode": "always",
                  },
                ],
                "field": "description",
                "max_errors": 1,
                "post_tag": "</strong>",
                "pre_tag": "<strong>",
                "size": 3,
              },
              "text": "powerfull gaming laptop",
            },
          },
        }
      `);
    });
  });
});
