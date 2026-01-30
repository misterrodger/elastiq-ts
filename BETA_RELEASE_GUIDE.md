# elastiq Beta Release Guide

**Status**: ✅ Ready for npm beta publication
**Version**: 0.1.0-beta.0
**Package Size**: 11.9 KB (11.9 MB when installed)

## What's Included

elastiq is a **type-safe, lightweight Elasticsearch query builder** with:

- ✅ **Full V1.0 features**: 13+ core query types, boolean logic, conditional building
- ✅ **Full V1.1 features**: 12+ aggregations, 3 geo queries, advanced patterns
- ✅ **143+ tests passing** with good coverage
- ✅ **Production-ready code** with TypeScript strict mode
- ✅ **Comprehensive documentation** with examples
- ✅ **CI/CD configured** with GitHub Actions
- ✅ **Zero external dependencies** (lightweight)

## Publishing the Beta

### Option 1: Automatic (Recommended)

Push with `[beta]` in commit message to trigger GitHub Actions auto-publish:

```bash
git commit -m "chore: publish v0.1.0-beta.0 [beta]"
git push origin main
```

Requires: NPM_TOKEN secret in GitHub repo settings

### Option 2: Manual Publish

```bash
# Login to npm
npm login

# Publish as beta
npm publish --tag beta

# Verify
npm view elastiq@0.1.0-beta.0
```

## Installation

Beta testers can install:

```bash
# Latest beta (recommended)
npm install elastiq@latest

# Specific version
npm install elastiq@0.1.0-beta.0

# Add to package.json
npm install elastiq@0.1.0-beta.0 --save-dev
```

## Quick Start for Beta Testers

```typescript
import { query } from 'elastiq';

type Product = {
  id: string;
  name: string;
  price: number;
};

// Type-safe query building
const q = query<Product>()
  .bool()
  .must(q => q.match('name', 'laptop'))
  .filter(q => q.range('price', { gte: 500, lte: 2000 }))
  .from(0)
  .size(20)
  .build();

// Send to Elasticsearch
client.search({ index: 'products', ...q });
```

## Beta Features

### Query Types (Ready)
- match, multiMatch, matchPhrase, matchPhrasePrefix
- term, terms, range, exists, prefix, wildcard, fuzzy, ids
- bool (must, filter, should, mustNot, minimumShouldMatch)
- nested, regexp, constantScore
- geoDistance, geoBoundingBox, geoPolygon

### Query Parameters (Ready)
- Pagination: from, to, size
- Sorting: sort
- Field selection: _source
- Performance: timeout, trackScores, trackTotalHits
- Debugging: explain, minScore, version, seqNoPrimaryTerm

### Aggregations (Ready)
- Bucket: terms, dateHistogram, range, histogram
- Metric: avg, sum, min, max, cardinality, percentiles, stats, valueCount
- Sub-aggregations with fluent chaining

### Advanced Features (Ready)
- Conditional query building with when()
- Highlighting with custom tags
- Full TypeScript generics for type safety

## Pre-release Checklist

✅ Code ready
✅ Documentation complete
✅ Tests passing (143 tests)
✅ Build passing
✅ Linting passing
✅ Package.json updated
✅ CHANGELOG updated
✅ CI/CD configured
✅ Local install verified
✅ Commit prepared

## Feedback Channels

- **Issues**: https://github.com/misterrodger/elastiq/issues
- **Discussions**: https://github.com/misterrodger/elastiq/discussions
- **Bugs**: Create issue with version and reproduction steps

## Known Limitations (Beta)

1. **Node.js 16+** required (we test on 16, 18, 20)
2. **Elasticsearch 7.0+** compatible (DSL based)
3. **No script queries** yet (planned for v1.2)
4. **No bulk operations** (planned for v1.2)

## Stability

This is a beta release suitable for:
- **Production testing** in non-critical systems
- **API feedback** before v1.0 stable
- **Early adoption** with version pinning

Not recommended for:
- Critical production systems
- Large-scale deployments without testing

## Migration Path

Beta users will have a smooth upgrade path:
- v0.1.0-beta.0 → v0.1.0 (stable) - no breaking changes
- v0.1.0 → v1.0.0 - public API finalized
- v1.x → v2.x - future major features

## Support Timeline

- **Beta phase**: v0.1.0-beta.x (this)
- **Stable v1**: v1.0.0+ (expected Q1 2026)
- **LTS support**: v1.x (minimum 2 years)

## Next Steps

1. **Publish beta** (via Git push with [beta] tag or `npm publish --tag beta`)
2. **Announce** on:
   - GitHub releases page
   - npm package page
   - TypeScript/Elasticsearch communities
3. **Gather feedback** from early adopters
4. **Iterate** on v0.1.0-beta.1+ if needed
5. **Release v1.0** when stable

## Version Bumping for Next Betas

If iterations needed before v1.0:

```bash
# In package.json
"version": "0.1.0-beta.1"  # For second beta
"version": "0.1.0-beta.2"  # For third beta
# etc.

# Publish
npm publish --tag beta

# Users always get latest with:
npm install elastiq@latest
```

## Questions?

See:
- README.md - Feature overview and examples
- CHANGELOG.md - What's new in v1.0 and v1.1
- CONTRIBUTING.md - Development guide
- Documentation in code - JSDoc comments

---

**Ready to release! 🚀**
