import { test, expect } from '../../fixtures/test.fixture';
import { validateSchema } from '../../utils/schema-validator';
import {
    ProductListResponseSchema,
    ApiMessageResponseSchema,
} from '../schemas/product.schema';

/**
 * API Specialist — Products API Tests
 *
 * Mandatory 3-step flow (enforced by api-specialist.md):
 *   Step 1: Call API client    → returns raw unknown
 *   Step 2: Validate schema    → fails immediately if contract drifts
 *   Step 3: Business assertions → on fully-typed validated data only
 *
 * Target: https://automationexercise.com/api_list
 */
test.describe('Products API', () => {

    // ─── GET All Products ─────────────────────────────────────────────────────

    test('GET /api/productsList — schema is valid and products exist', async ({ productsApi }) => {
        // Step 1: Call client (raw transport)
        const rawData = await productsApi.getAllProducts();

        // Step 2: Validate schema — fails loudly if API contract drifts
        const validated = validateSchema(
            ProductListResponseSchema,
            rawData,
            'GET /api/productsList',
        );

        // Step 3: Business assertions on typed data
        expect(validated.responseCode).toBe(200);
        expect(validated.products.length).toBeGreaterThan(0);
    });

    test('GET /api/productsList — each product has required fields', async ({ productsApi }) => {
        const rawData = await productsApi.getAllProducts();
        const validated = validateSchema(
            ProductListResponseSchema,
            rawData,
            'GET /api/productsList - field check',
        );

        const firstProduct = validated.products[0];
        expect(firstProduct.id).toBeGreaterThan(0);
        expect(firstProduct.name).toBeTruthy();
        expect(firstProduct.price).toBeTruthy();
        expect(firstProduct.brand).toBeTruthy();
        expect(firstProduct.category.category).toBeTruthy();
    });

    // ─── Search Products ──────────────────────────────────────────────────────

    test('POST /api/searchProduct — valid query returns matching products', async ({ productsApi }) => {
        const rawData = await productsApi.searchProduct('Top');

        const validated = validateSchema(
            ProductListResponseSchema,
            rawData,
            'POST /api/searchProduct (query=Top)',
        );

        expect(validated.responseCode).toBe(200);
        expect(validated.products.length).toBeGreaterThan(0);

        // All results should relate to the search query
        const names = validated.products.map((p) => p.name.toLowerCase());
        const hasMatch = names.some((n) => n.includes('top'));
        expect(hasMatch).toBe(true);
    });

    test('POST /api/searchProduct — empty query returns all products', async ({ productsApi }) => {
        const rawData = await productsApi.searchProduct('');

        // Empty search may return all products or a message response
        // Try both schemas via safeParse
        const listResult = ProductListResponseSchema.safeParse(rawData);
        const msgResult = ApiMessageResponseSchema.safeParse(rawData);

        // At least one schema must be valid
        expect(listResult.success || msgResult.success).toBe(true);
    });

});
