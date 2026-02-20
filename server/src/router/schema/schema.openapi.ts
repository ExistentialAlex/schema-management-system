import { describeRoute, resolver } from 'hono-openapi';
import { PaginationResponseSchema, SchemaSchema, SchemaVersionSchema } from 'schema-manager-schemas';

/**
 * OpenAPI documentation for Schema List Endpoint
 */
export const SchemaListOpenApi = describeRoute({
  description: 'Get list of schemas',
  tags: ['schemas'],
  responses: {
    200: {
      description: 'List of Schemas',
      content: {
        'application/json': {
          schema: resolver(PaginationResponseSchema(SchemaSchema)),
        },
      },
    },
  },
});

/**
 * OpenAPI documentation for Get Schema Endpoint
 */
export const GetSchemaOpenApi = describeRoute({
  description: 'Get schema by ID',
  tags: ['schemas'],
  responses: {
    200: {
      description: 'Schema Details',
      content: {
        'application/json': {
          schema: resolver(SchemaSchema),
        },
      },
    },
    404: {
      description: 'Schema not found',
    },
  },
});

/**
 * OpenAPI documentation for Create Schema Endpoint
 */
export const CreateSchemaOpenApi = describeRoute({
  description: 'Create a new schema',
  tags: ['schemas'],
  responses: {
    201: {
      description: 'Schema created successfully',
      content: {
        'application/json': {
          schema: resolver(SchemaSchema),
        },
      },
    },
    400: {
      description: 'Invalid input',
    },
  },
});

/**
 * OpenAPI documentation for Create Schema Endpoint
 */
export const CreateSchemaVersionOpenApi = describeRoute({
  description: 'Create a new schema version',
  tags: ['schemas'],
  responses: {
    201: {
      description: 'Schema version created successfully',
      content: {
        'application/json': {
          schema: resolver(SchemaSchema),
        },
      },
    },
    400: {
      description: 'Invalid input',
    },
  },
});

/**
 * OpenAPI documentation for Update Schema Endpoint
 */
export const UpdateSchemaOpenApi = describeRoute({
  description: 'Update schema by ID',
  tags: ['schemas'],
  responses: {
    200: {
      description: 'Schema updated successfully',
      content: {
        'application/json': {
          schema: resolver(SchemaSchema),
        },
      },
    },
    404: {
      description: 'Schema not found',
    },
    400: {
      description: 'Invalid input',
    },
  },
});

/**
 * OpenAPI documentation for Update Schema Endpoint
 */
export const UpdateSchemaVersionOpenApi = describeRoute({
  description: 'Update schema version by ID & version number',
  tags: ['schemas'],
  responses: {
    200: {
      description: 'Schema version updated successfully',
      content: {
        'application/json': {
          schema: resolver(SchemaVersionSchema),
        },
      },
    },
    404: {
      description: 'Schema version not found',
    },
    400: {
      description: 'Invalid input',
    },
  },
});
