/* eslint-disable @typescript-eslint/no-explicit-any */
const ES_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const INDEX_NAME = 'test-index';

const mappings = {
  properties: {
    type: { type: 'keyword' }, // exact, term-level queries
    name: { type: 'text' }, // tokenizes for partial match
    price: { type: 'integer' },
    size: { type: 'integer' }
  }
};

export type TestDocument = {
  type: string;
  name: string;
  price: number;
  size: number;
};

const docs: TestDocument[] = [
  { type: 'condo', name: 'Beach condo', price: 1_000_000, size: 1000 },
  { type: 'co-op', name: 'City co-op', price: 2_000_000, size: 2000 },
  { type: 'house', name: 'City house', price: 3_000_000, size: 3000 }
];

export type Request = {
  method?: 'POST' | 'PUT' | 'DELETE';
  path?: string;
  body?: any;
};

export async function esRequest({
  method = 'POST',
  path = '',
  body
}: Request): Promise<any> {
  const fetchPath = `${ES_URL}/${INDEX_NAME}${path}`;

  const response = await fetch(fetchPath, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) })
  });
  return response.json();
}

export async function createIndex() {
  await esRequest({ method: 'PUT', body: { mappings } });
}

export async function indexDocuments() {
  for (const doc of docs) {
    await esRequest({ path: '/_doc', body: doc });
  }
}

export async function refreshIndex() {
  await esRequest({ path: '/_refresh' });
}

export async function deleteIndex() {
  await esRequest({ method: 'DELETE' });
}
