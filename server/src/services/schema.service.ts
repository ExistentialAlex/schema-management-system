import type { ServerEnv } from '@env';
import type { Context } from 'hono';
import type {
  CreateSchemaRequestBody,
  CreateSchemaVersionRequestBody,
  PaginationResponse,
  Schema,
  SchemaVersion,
  UpdateSchemaRequestBody,
  UpdateSchemaVersionRequestBody,
} from 'schema-manager-schemas';
import { getLatestVersionNumber, incrementPatch } from 'schema-manager-utils';
import { SchemaGetException, SchemaNotFoundException, SchemaVersionNotFoundException } from '@/exceptions';
import { convertExternalPaginationResponse, log, paginate } from '../utils';

let schemas: Schema[] = [
  {
    id: 1,
    title: `Test Schema`,
    description: `Dummy Schema`,
    createdDate: new Date(Date.now()).toISOString(),
    versions: [],
  },
];

// Add more dummy schemas
// This is just for testing purposes, in a real application you would fetch this from a database
for (let i = 0; i < 25; i++) {
  schemas.push({
    id: i + 2,
    title: `Schema ${i + 1}`,
    description: `Dummy Schema ${i + 1}`,
    createdDate: new Date(Date.now()).toISOString(),
    versions: [],
  });
}

export const useSchemaService = (c: Context<ServerEnv>) => {
  const reqID = c.get('requestId');

  const getSchema = (id: number): Schema => {
    log(reqID, `Getting Schema with ID '${id}'`);

    if (id === 999) {
      throw new SchemaGetException(c, { id });
    }

    const schema = schemas.find((schema) => schema.id === id);
    if (!schema) {
      throw new SchemaNotFoundException(c, { id });
    }

    log(reqID, `Schema Found`);

    return schema;
  };

  const getSchemaVersion = (id: number, version: string) => {
    const schema = getSchema(id);
    const schemaVersion = schema.versions.find((v) => v.id === version);

    if (!schemaVersion) {
      throw new SchemaVersionNotFoundException(c, { id, version });
    }

    return schemaVersion;
  };

  const getSchemas = (
    page?: number,
    pageSize?: number,
    search?: string,
    sort?: string[] | string,
  ): PaginationResponse<Schema> => {
    log(reqID, 'Getting paginated list of schemas');
    return convertExternalPaginationResponse(c, paginate(schemas, page, pageSize, search, sort));
  };

  const createSchemaVersion = (schemaId: number, schemaVersion: CreateSchemaVersionRequestBody): SchemaVersion => {
    log(reqID, 'Creating new schema version');

    const schema = getSchema(schemaId);

    const newVersionId = schema.versions.length ? incrementPatch(getLatestVersionNumber(schema.versions)) : '0.0.0';

    const newSchemaVersion: SchemaVersion = {
      id: newVersionId,
      schemaId,
      createdDate: new Date(Date.now()).toISOString(),
      ...schemaVersion,
    };

    schema.versions.push(newSchemaVersion);
    schemas = schemas.map((s) => s.id === schemaId ? schema : s);

    log(reqID, `New Schema version '${newVersionId}' created`);

    return newSchemaVersion;
  };

  const createSchema = (schema: CreateSchemaRequestBody): Schema => {
    log(reqID, 'Creating new schema');

    const newSchema: Schema = {
      id: schemas.length + 1,
      title: schema.title,
      description: schema.description,
      createdDate: new Date(Date.now()).toISOString(),
      versions: [],
    };
    schemas.push(newSchema);

    log(reqID, 'New schema created');

    createSchemaVersion(newSchema.id, { draft: true, properties: schema.properties });

    return newSchema;
  };

  const updateSchema = (id: number, schema: UpdateSchemaRequestBody): Schema => {
    log(reqID, `Updating schema with ID '${id}'`);

    const existingSchema = getSchema(id);
    const updatedSchema = { ...existingSchema, ...schema };
    schemas = schemas.map((u) => (u.id === id ? updatedSchema : u));

    log(reqID, 'Schema Updated');

    return updatedSchema;
  };

  const updateSchemaVersion = (id: number, version: string, schemaVersion: UpdateSchemaVersionRequestBody): SchemaVersion => {
    log(reqID, `Updating schema with ID '${id}', version '${version}'`);

    const existingSchemaVersion = getSchemaVersion(id, version);
    const updatedSchemaVersion = { ...existingSchemaVersion, ...schemaVersion };

    const existingSchema = getSchema(id);
    existingSchema.versions = existingSchema.versions.map((v) => v.id === version ? updatedSchemaVersion : v);

    schemas = schemas.map((u) => (u.id === id ? existingSchema : u));

    log(reqID, 'Schema version updated');

    return updatedSchemaVersion;
  };

  return { getSchema, getSchemaVersion, getSchemas, createSchema, createSchemaVersion, updateSchema, updateSchemaVersion };
};
