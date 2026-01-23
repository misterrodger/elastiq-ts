import {
  esRequest,
  createIndex,
  deleteIndex,
  indexDocuments,
  refreshIndex,
  TestDocument
} from './elastic.helpers';
import { createQueryBuilder } from '../query-builder';

describe('Elasticsearch Integration Tests', () => {
  beforeAll(async () => {
    try {
      await createIndex();
      await indexDocuments();
      await refreshIndex();
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await deleteIndex();
  });

  test('should match all documents', async () => {
    const body = createQueryBuilder<TestDocument>().matchAll().build();
    const result = await esRequest({ path: '/_search', body });

    expect(result.hits.total.value).toBe(3);
  });

  test('should filter by term', async () => {
    const body = createQueryBuilder<TestDocument>()
      .term('type', 'condo')
      .build();
    const result = await esRequest({ path: '/_search', body });

    expect(result.hits.total.value).toBe(1);
    // expect(result.hits.hits[0]._source.name).toBe('John Doe');
  });

  test('should use range query', async () => {
    const body = createQueryBuilder<TestDocument>()
      .range('size', { gte: 1500 })
      .build();
    const result = await esRequest({ path: '/_search', body });

    expect(result.hits.total.value).toBe(2);
  });

  test('should use bool query with must and filter', async () => {
    const body = createQueryBuilder<TestDocument>()
      .bool()
      .must((q) => q.match('name', 'City'))
      .filter((q) => q.range('size', { gte: 2500 }))
      .build();

    const result = await esRequest({ path: '/_search', body });
    expect(result.hits.total.value).toBe(1);
  });

  // test('should sort results', async () => {
  //   const body = createQueryBuilder<TestDocument>()
  //     .matchAll()
  //     .sort('price', 'desc')
  //     .build();

  //   const result = await esRequest({body});
  //   // expect(result.hits.hits[0]._source.age).toBe(35);
  //   // expect(result.hits.hits[2]._source.age).toBe(25);
  // });

  // test('should limit source fields', async () => {
  //   const body = createQueryBuilder<TestDocument>()
  //     .matchAll()
  //     ._source(['type', 'price', 'size'])
  //     .build();

  //   const result = await esRequest({body});
  //   // const source = result.hits.hits[0]._source;
  //   // expect(source.name).toBeDefined();
  //   // expect(source.email).toBeDefined();
  //   // expect(source.age).toBeUndefined();
  // });

  // test('should use pagination', async () => {
  //   const body = createQueryBuilder<TestDocument>()
  //     .matchAll()
  //     .from(1)
  //     .size(1)
  //     .build();

  //   const result = await esRequest({body});
  //   expect(result.hits.hits.length).toBe(1);
  // });
});
