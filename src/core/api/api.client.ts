import * as fs from 'fs';
import * as path from 'path';
import { APIRequestContext, request } from '@playwright/test';
import { logger } from '../logger';
import { envConfig } from '../../config/env.config';
import { TIMEOUTS } from '../../config/constants';

/** Shape of a single file entry in a multipart form */
type MultipartFileField = { name: string; mimeType: string; buffer: Buffer };

/** The multipart form object Playwright accepts */
type MultipartForm = Record<string, string | MultipartFileField>;

/**
 * A single file field in a multipart request.
 */
export interface MultipartFile {
    /** The form field name (e.g. 'avatar', 'document') */
    fieldName: string;
    /** Absolute path to the file on disk */
    filePath: string;
    /** MIME type (e.g. 'image/png', 'application/pdf'). Defaults to 'application/octet-stream'. */
    mimeType?: string;
}

/**
 * Thin wrapper around Playwright's APIRequestContext for API-first test setup.
 * Provides logging and error observability for all API calls.
 */
export class ApiClient {
    private context!: APIRequestContext;

    async init(): Promise<this> {
        this.context = await request.newContext({
            baseURL: envConfig.BASE_URL,
            extraHTTPHeaders: {
                'Accept': 'application/json',
            },
        });
        logger.info('API     ▸ initialized API client');
        return this;
    }

    // ─── JSON Methods ────────────────────────────────────────────────────────────

    async get(endpoint: string): Promise<Record<string, unknown>> {
        logger.info(`API     ▸ GET    → ${endpoint}`);
        try {
            const response = await this.context.get(endpoint, { timeout: TIMEOUTS.API });
            const body = await response.json();
            logger.info(`API     ◂ GET    ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ GET    → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    async post(endpoint: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
        logger.info(`API     ▸ POST   → ${endpoint}`);
        try {
            const response = await this.context.post(endpoint, {
                data,
                timeout: TIMEOUTS.API,
            });
            const body = await response.json();
            logger.info(`API     ◂ POST   ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ POST   → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    async put(endpoint: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
        logger.info(`API     ▸ PUT    → ${endpoint}`);
        try {
            const response = await this.context.put(endpoint, {
                data,
                timeout: TIMEOUTS.API,
            });
            const body = await response.json();
            logger.info(`API     ◂ PUT    ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ PUT    → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    async patch(endpoint: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
        logger.info(`API     ▸ PATCH  → ${endpoint}`);
        try {
            const response = await this.context.patch(endpoint, {
                data,
                timeout: TIMEOUTS.API,
            });
            const body = await response.json();
            logger.info(`API     ◂ PATCH  ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ PATCH  → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    async delete(endpoint: string): Promise<Record<string, unknown>> {
        logger.info(`API     ▸ DELETE → ${endpoint}`);
        try {
            const response = await this.context.delete(endpoint, { timeout: TIMEOUTS.API });
            const body = await response.json();
            logger.info(`API     ◂ DELETE ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ DELETE → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    // ─── Multipart / File Upload Methods ─────────────────────────────────────────

    /**
     * Upload a single file via multipart/form-data POST.
     *
     * Use this for simple image/document upload endpoints.
     *
     * @example
     * await apiClient.uploadFile('/api/avatar', {
     *     fieldName: 'avatar',
     *     filePath: '/absolute/path/to/photo.png',
     *     mimeType: 'image/png',
     * });
     */
    async uploadFile(
        endpoint: string,
        file: MultipartFile,
    ): Promise<Record<string, unknown>> {
        const fileName = path.basename(file.filePath);
        const mimeType = file.mimeType ?? 'application/octet-stream';
        logger.info(`API     ▸ UPLOAD → ${endpoint}  file="${fileName}" (${mimeType})`);
        try {
            const fileBuffer = fs.readFileSync(file.filePath);
            const response = await this.context.post(endpoint, {
                timeout: TIMEOUTS.API,
                multipart: {
                    [file.fieldName]: {
                        name: fileName,
                        mimeType,
                        buffer: fileBuffer,
                    } satisfies MultipartFileField,
                } satisfies MultipartForm,
            });
            const body = await response.json();
            logger.info(`API     ◂ UPLOAD ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ UPLOAD → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * Send a multipart/form-data POST with mixed text fields AND one or more files.
     *
     * Use this when the endpoint expects both metadata and file content in the same request
     * (e.g. uploading a product image alongside its name and description).
     *
     * @param fields  - Plain text form fields (key → value)
     * @param files   - File fields to attach
     *
     * @example
     * await apiClient.postMultipart('/api/products', {
     *     fields: { name: 'Brocolli', category: 'vegetables' },
     *     files: [{
     *         fieldName: 'image',
     *         filePath: '/absolute/path/to/brocolli.jpg',
     *         mimeType: 'image/jpeg',
     *     }],
     * });
     */
    async postMultipart(
        endpoint: string,
        payload: {
            fields?: Record<string, string>;
            files?: MultipartFile[];
        },
    ): Promise<Record<string, unknown>> {
        const fileNames = (payload.files ?? []).map(f => path.basename(f.filePath)).join(', ');
        logger.info(`API     ▸ MULTIPART POST → ${endpoint}  files=[${fileNames}]`);
        try {
            // Build the multipart form object
            const multipart: MultipartForm = {};

            // Attach plain text fields
            for (const [key, value] of Object.entries(payload.fields ?? {})) {
                multipart[key] = value;
            }

            // Attach file fields — read each file into a buffer
            for (const file of payload.files ?? []) {
                const fileName = path.basename(file.filePath);
                const mimeType = file.mimeType ?? 'application/octet-stream';
                multipart[file.fieldName] = {
                    name: fileName,
                    mimeType,
                    buffer: fs.readFileSync(file.filePath),
                };
                logger.info(`         ◂ field  "${file.fieldName}" = ${fileName} (${mimeType})`);
            }

            const response = await this.context.post(endpoint, {
                timeout: TIMEOUTS.API,
                multipart,
            });
            const body = await response.json();
            logger.info(`API     ◂ MULTIPART POST ← ${response.status()}`);
            return body;
        } catch (error) {
            logger.error(`FAILED  ▸ MULTIPART POST → ${endpoint} | Error: ${(error as Error).message}`);
            throw error;
        }
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────────

    async dispose(): Promise<void> {
        await this.context.dispose();
        logger.info('API     ▸ disposed API client');
    }
}
