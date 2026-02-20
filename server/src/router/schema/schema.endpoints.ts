import type { ServerEnv } from '@env';
import { Hono } from 'hono';
import {
  CreateSchemaRequestBodySchema,
  CreateSchemaVersionRequestBodySchema,
  GetSchemaRequestParamSchema,
  GetSchemaVersionRequestParamSchema,
  PaginationQuerySchema,
  UpdateSchemaRequestBodySchema,
  UpdateSchemaVersionRequestBodySchema,
} from 'schema-manager-schemas';
import { requireUserSession, zValidator } from '@/middleware';
import { useSchemaService } from '@/services';
import {
  CreateSchemaOpenApi,
  GetSchemaOpenApi,
  SchemaListOpenApi,
  UpdateSchemaOpenApi,
  UpdateSchemaVersionOpenApi,
} from './schema.openapi';

const schemaRouter = new Hono<ServerEnv>()
  .use(requireUserSession())
  /**
   * Schema List Endpoint
   */
  .get('/', SchemaListOpenApi, zValidator('query', PaginationQuerySchema), async (c) => {
    const { getSchemas } = useSchemaService(c);

    const { page, page_size, search, sort } = c.req.valid('query');
    const schemas = await getSchemas(page, page_size, search, sort);
    return c.json(schemas);
  })
  /**
   * Schema Detail Endpoint
   */
  .get('/:id', GetSchemaOpenApi, zValidator('param', GetSchemaRequestParamSchema), async (c) => {
    const { getSchema } = useSchemaService(c);
    const { id } = c.req.valid('param');
    const schema = await getSchema(id);

    return c.json(schema);
  })
  /**
   * Schema Version Detail Endpoint
   */
  .get('/:id/:version', GetSchemaOpenApi, zValidator('param', GetSchemaVersionRequestParamSchema), async (c) => {
    const { getSchemaVersion } = useSchemaService(c);
    const { id, version } = c.req.valid('param');
    const schemaVersion = await getSchemaVersion(id, version);

    return c.json(schemaVersion);
  })
  /**
   * Create Schema Endpoint
   */
  .post('/', CreateSchemaOpenApi, zValidator('json', CreateSchemaRequestBodySchema), async (c) => {
    const { createSchema } = useSchemaService(c);
    const schema = await createSchema(c.req.valid('json'));
    return c.json(schema, 201);
  })
  /**
   * Create Schema Version Endpoint
   */
  .post('/:id', CreateSchemaOpenApi, zValidator('param', GetSchemaRequestParamSchema), zValidator('json', CreateSchemaVersionRequestBodySchema), async (c) => {
    const { createSchemaVersion } = useSchemaService(c);

    const { id } = c.req.valid('param');
    const schema = await createSchemaVersion(id, c.req.valid('json'));
    return c.json(schema, 201);
  })
  /**
   * Update Schema Endpoint
   */
  .patch(
    '/:id',
    UpdateSchemaOpenApi,
    zValidator('param', GetSchemaRequestParamSchema),
    zValidator('json', UpdateSchemaRequestBodySchema),
    async (c) => {
      const { updateSchema } = useSchemaService(c);

      const { id } = c.req.valid('param');
      const schema = await updateSchema(id, c.req.valid('json'));

      return c.json(schema);
    },
  )
  .patch(
    '/:id/:version',
    UpdateSchemaVersionOpenApi,
    zValidator('param', GetSchemaVersionRequestParamSchema),
    zValidator('json', UpdateSchemaVersionRequestBodySchema),
    async (c) => {
      const { updateSchemaVersion } = useSchemaService(c);

      const { id, version } = c.req.valid('param');
      const schemaVersion = await updateSchemaVersion(id, version, c.req.valid('json'));

      return c.json(schemaVersion);
    },
  );

export { schemaRouter };
