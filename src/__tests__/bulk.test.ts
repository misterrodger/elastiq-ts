import { bulk } from '..';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

describe('Bulk API', () => {
  describe('Index operations', () => {
    it('should build single index operation', () => {
      const result = bulk<Product>()
        .index({ id: '1', name: 'Test', price: 100, category: 'electronics' })
        .build();

      const lines = result.split('\n').filter((l) => l);
      expect(lines).toHaveLength(2); // action + document
    });

    it('should index with metadata', () => {
      const result = bulk<Product>()
        .index(
          { id: '1', name: 'Test', price: 100, category: 'electronics' },
          { _index: 'products', _id: '1' }
        )
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "index": {
              "_id": "1",
              "_index": "products",
            },
          },
          {
            "category": "electronics",
            "id": "1",
            "name": "Test",
            "price": 100,
          },
        ]
      `);
    });

    it('should index with routing', () => {
      const result = bulk<Product>()
        .index(
          { id: '1', name: 'Test', price: 100, category: 'electronics' },
          { routing: 'user-123' }
        )
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "index": {
              "routing": "user-123",
            },
          },
          {
            "category": "electronics",
            "id": "1",
            "name": "Test",
            "price": 100,
          },
        ]
      `);
    });

    it('should index with version', () => {
      const result = bulk<Product>()
        .index(
          { id: '1', name: 'Test', price: 100, category: 'electronics' },
          { version: 5, version_type: 'external' }
        )
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "index": {
              "version": 5,
              "version_type": "external",
            },
          },
          {
            "category": "electronics",
            "id": "1",
            "name": "Test",
            "price": 100,
          },
        ]
      `);
    });
  });

  describe('Create operations', () => {
    it('should build create operation', () => {
      const result = bulk<Product>()
        .create({ id: '2', name: 'New Product', price: 200, category: 'tech' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"create":{}}
        {"id":"2","name":"New Product","price":200,"category":"tech"}
        "
      `);
    });

    it('should create with metadata', () => {
      const result = bulk<Product>()
        .create(
          { id: '2', name: 'New Product', price: 200, category: 'tech' },
          { _index: 'products', _id: '2' }
        )
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "create": {
              "_id": "2",
              "_index": "products",
            },
          },
          {
            "category": "tech",
            "id": "2",
            "name": "New Product",
            "price": 200,
          },
        ]
      `);
    });
  });

  describe('Update operations', () => {
    it('should build update with doc', () => {
      const result = bulk<Product>()
        .update({
          _index: 'products',
          _id: '3',
          doc: { name: 'Updated Name', price: 150 }
        })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "update": {
              "_id": "3",
              "_index": "products",
            },
          },
          {
            "doc": {
              "name": "Updated Name",
              "price": 150,
            },
          },
        ]
      `);
    });

    it('should update with script', () => {
      const result = bulk<Product>()
        .update({
          _index: 'products',
          _id: '4',
          script: {
            source: 'ctx._source.price += params.increment',
            params: { increment: 10 }
          }
        })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "update": {
              "_id": "4",
              "_index": "products",
            },
          },
          {
            "script": {
              "params": {
                "increment": 10,
              },
              "source": "ctx._source.price += params.increment",
            },
          },
        ]
      `);
    });

    it('should update with upsert', () => {
      const result = bulk<Product>()
        .update({
          _index: 'products',
          _id: '5',
          doc: { name: 'Updated', price: 100, category: 'tech', id: '5' },
          upsert: { id: '5', name: 'New', price: 100, category: 'tech' }
        })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "update": {
              "_id": "5",
              "_index": "products",
            },
          },
          {
            "doc": {
              "category": "tech",
              "id": "5",
              "name": "Updated",
              "price": 100,
            },
            "upsert": {
              "category": "tech",
              "id": "5",
              "name": "New",
              "price": 100,
            },
          },
        ]
      `);
    });

    it('should update with doc_as_upsert', () => {
      const result = bulk<Product>()
        .update({
          _index: 'products',
          _id: '6',
          doc: { name: 'Product', price: 100, category: 'tech', id: '6' },
          doc_as_upsert: true
        })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "update": {
              "_id": "6",
              "_index": "products",
            },
          },
          {
            "doc": {
              "category": "tech",
              "id": "6",
              "name": "Product",
              "price": 100,
            },
            "doc_as_upsert": true,
          },
        ]
      `);
    });

    it('should update with retry_on_conflict', () => {
      const result = bulk<Product>()
        .update({
          _index: 'products',
          _id: '7',
          doc: { price: 200 },
          retry_on_conflict: 3
        })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "update": {
              "_id": "7",
              "_index": "products",
              "retry_on_conflict": 3,
            },
          },
          {
            "doc": {
              "price": 200,
            },
          },
        ]
      `);
    });
  });

  describe('Delete operations', () => {
    it('should build delete operation', () => {
      const result = bulk<Product>()
        .delete({ _index: 'products', _id: '8' })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "delete": {
              "_id": "8",
              "_index": "products",
            },
          },
        ]
      `);
    });

    it('should delete with routing', () => {
      const result = bulk<Product>()
        .delete({ _index: 'products', _id: '9', routing: 'user-456' })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "delete": {
              "_id": "9",
              "_index": "products",
              "routing": "user-456",
            },
          },
        ]
      `);
    });

    it('should delete with version', () => {
      const result = bulk<Product>()
        .delete({ _index: 'products', _id: '10', version: 3 })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "delete": {
              "_id": "10",
              "_index": "products",
              "version": 3,
            },
          },
        ]
      `);
    });
  });

  describe('Mixed operations', () => {
    it('should combine multiple operation types', () => {
      const result = bulk<Product>()
        .index(
          { id: '1', name: 'Product 1', price: 100, category: 'tech' },
          { _index: 'products', _id: '1' }
        )
        .create(
          { id: '2', name: 'Product 2', price: 200, category: 'tech' },
          { _index: 'products', _id: '2' }
        )
        .update({
          _index: 'products',
          _id: '3',
          doc: { name: 'Updated Product 3' }
        })
        .delete({ _index: 'products', _id: '4' })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "index": {
              "_id": "1",
              "_index": "products",
            },
          },
          {
            "category": "tech",
            "id": "1",
            "name": "Product 1",
            "price": 100,
          },
          {
            "create": {
              "_id": "2",
              "_index": "products",
            },
          },
          {
            "category": "tech",
            "id": "2",
            "name": "Product 2",
            "price": 200,
          },
          {
            "update": {
              "_id": "3",
              "_index": "products",
            },
          },
          {
            "doc": {
              "name": "Updated Product 3",
            },
          },
          {
            "delete": {
              "_id": "4",
              "_index": "products",
            },
          },
        ]
      `);
    });
  });

  describe('Bulk output formats', () => {
    it('should build as NDJSON string', () => {
      const result = bulk<Product>()
        .index({ id: '1', name: 'Test', price: 100, category: 'tech' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"index":{}}
        {"id":"1","name":"Test","price":100,"category":"tech"}
        "
      `);
    });

    it('should build as array', () => {
      const result = bulk<Product>()
        .index({ id: '1', name: 'Test', price: 100, category: 'tech' })
        .buildArray();

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "index": {},
          },
          {
            "category": "tech",
            "id": "1",
            "name": "Test",
            "price": 100,
          },
        ]
      `);
    });
  });

  describe('Real-world bulk scenarios', () => {
    it('should batch product updates', () => {
      const products: Product[] = [
        { id: '1', name: 'Laptop', price: 1000, category: 'electronics' },
        { id: '2', name: 'Mouse', price: 25, category: 'accessories' },
        { id: '3', name: 'Keyboard', price: 75, category: 'accessories' }
      ];

      let bulkOp = bulk<Product>();
      for (const product of products) {
        bulkOp = bulkOp.index(product, {
          _index: 'products',
          _id: product.id
        });
      }

      const result = bulkOp.buildArray();
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "index": {
              "_id": "1",
              "_index": "products",
            },
          },
          {
            "category": "electronics",
            "id": "1",
            "name": "Laptop",
            "price": 1000,
          },
          {
            "index": {
              "_id": "2",
              "_index": "products",
            },
          },
          {
            "category": "accessories",
            "id": "2",
            "name": "Mouse",
            "price": 25,
          },
          {
            "index": {
              "_id": "3",
              "_index": "products",
            },
          },
          {
            "category": "accessories",
            "id": "3",
            "name": "Keyboard",
            "price": 75,
          },
        ]
      `);
    });

    it('should handle mixed CRUD operations', () => {
      const result = bulk<Product>()
        // Create new products
        .create(
          { id: '100', name: 'New Product', price: 500, category: 'new' },
          { _index: 'products', _id: '100' }
        )
        // Update existing
        .update({
          _index: 'products',
          _id: '50',
          doc: { price: 450 }
        })
        // Delete old
        .delete({ _index: 'products', _id: '25' })
        .build();

      expect(result).toMatchInlineSnapshot(`
        "{"create":{"_index":"products","_id":"100"}}
        {"id":"100","name":"New Product","price":500,"category":"new"}
        {"update":{"_index":"products","_id":"50"}}
        {"doc":{"price":450}}
        {"delete":{"_index":"products","_id":"25"}}
        "
      `);
    });
  });
});
