/**
 * Type definitions for Elasticsearch Suggesters
 * @see https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Options for term suggester
 */
export type TermSuggesterOptions = {
  /** The field to fetch candidate suggestions from */
  field: string;
  /** Text analyzer to use */
  analyzer?: string;
  /** Maximum number of suggestions to return */
  size?: number;
  /** Sort order for suggestions */
  sort?: 'score' | 'frequency';
  /** Suggest mode */
  suggest_mode?: 'missing' | 'popular' | 'always';
  /** String distance algorithm */
  string_distance?:
    | 'internal'
    | 'damerau_levenshtein'
    | 'levenshtein'
    | 'jaro_winkler'
    | 'ngram';
  /** Maximum edit distance */
  max_edits?: number;
  /** Maximum number of inspected documents */
  max_inspections?: number;
  /** Maximum term frequency threshold */
  max_term_freq?: number;
  /** Prefix length */
  prefix_length?: number;
  /** Minimum word length */
  min_word_length?: number;
  /** Minimum document frequency */
  min_doc_freq?: number;
};

/**
 * Options for phrase suggester
 */
export type PhraseSuggesterOptions = {
  /** The field to fetch candidate suggestions from */
  field: string;
  /** Text analyzer to use */
  analyzer?: string;
  /** Maximum number of suggestions to return */
  size?: number;
  /** Real word error likelihood */
  real_word_error_likelihood?: number;
  /** Confidence threshold */
  confidence?: number;
  /** Maximum errors per term */
  max_errors?: number;
  /** Separator between terms */
  separator?: string;
  /** Gram size for shingle generation */
  gram_size?: number;
  /** Direct generators for candidate terms */
  direct_generator?: Array<{
    field: string;
    suggest_mode?: 'missing' | 'popular' | 'always';
    min_word_length?: number;
    max_edits?: number;
    max_inspections?: number;
    min_doc_freq?: number;
    max_term_freq?: number;
    prefix_length?: number;
    size?: number;
  }>;
  /** Highlight pre-tag */
  pre_tag?: string;
  /** Highlight post-tag */
  post_tag?: string;
  /** Collate query to verify suggestions */
  collate?: {
    query: any;
    params?: Record<string, any>;
    prune?: boolean;
  };
};

/**
 * Options for completion suggester
 */
export type CompletionSuggesterOptions = {
  /** The field to fetch completions from (must be type: completion) */
  field: string;
  /** Maximum number of suggestions to return */
  size?: number;
  /** Skip duplicates */
  skip_duplicates?: boolean;
  /** Fuzzy matching options */
  fuzzy?: {
    /** Enable fuzzy matching */
    fuzziness?: string | number;
    /** Whether transpositions should be treated as one change */
    transpositions?: boolean;
    /** Minimum length before fuzzy matching is used */
    min_length?: number;
    /** Prefix length */
    prefix_length?: number;
    /** Whether all measurements should be in Unicode code points */
    unicode_aware?: boolean;
  };
  /** Context filtering */
  contexts?: Record<string, string | string[]>;
};

/**
 * Suggester state for build output
 */
export type SuggesterState = {
  [suggesterName: string]: {
    text?: string;
    prefix?: string;
    term?: TermSuggesterOptions;
    phrase?: PhraseSuggesterOptions;
    completion?: CompletionSuggesterOptions;
  };
};

/**
 * Suggester builder interface
 */
export type SuggesterBuilder<T> = {
  /** Term suggester - suggests corrections for individual terms */
  term: (
    name: string,
    text: string,
    options: TermSuggesterOptions
  ) => SuggesterBuilder<T>;

  /** Phrase suggester - suggests corrections for entire phrases */
  phrase: (
    name: string,
    text: string,
    options: PhraseSuggesterOptions
  ) => SuggesterBuilder<T>;

  /** Completion suggester - autocomplete functionality */
  completion: (
    name: string,
    prefix: string,
    options: CompletionSuggesterOptions
  ) => SuggesterBuilder<T>;

  /** Build suggester DSL */
  build: () => { suggest: SuggesterState };
};
