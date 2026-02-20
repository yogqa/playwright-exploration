import { APIRequestContext } from '@playwright/test';

/**
 * Products API Client — Transport Layer Only
 *
 * This class handles HTTP transport for product-related endpoints.
 * It returns raw unknown data — NO Zod imports, NO assertions.
 *
 * Validation and assertions happen in the test spec (src/tests/api/).
 * See: api-specialist.md for the mandatory 3-step API test flow.
 */
export class ProductsApiClient {
    constructor(private readonly request: APIRequestContext) { }

    /**
     * Get all products.
     * Endpoint: GET /api/productsList
     */
    async getAllProducts(): Promise<unknown> {
        const res = await this.request.get('/api/productsList');
        return res.json();
    }

    /**
     * Search products by query string.
     * Endpoint: POST /api/searchProduct
     */
    async searchProduct(query: string): Promise<unknown> {
        const res = await this.request.post('/api/searchProduct', {
            form: { search_product: query },
        });
        return res.json();
    }
}
