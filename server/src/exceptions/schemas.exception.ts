import type { Context } from 'hono';
import type { HTTPExceptionOptions } from './base.exception';
import {
  DefaultInternalServerErrorException,
  DefaultNotFoundException,

} from './base.exception';

export class SchemaNotFoundException extends DefaultNotFoundException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.schemas.schema-not-found', translationParams, options);
  }
}

export class SchemaVersionNotFoundException extends DefaultNotFoundException {
  constructor(c: Context, translationParams: { id: number; version: string }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.schemas.schema-version-not-found', translationParams, options);
  }
}

export class SchemaListException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.schemas.list', translationParams, options);
  }
}

export class SchemaGetException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.schemas.get', translationParams, options);
  }
}

export class SchemaCreateException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.schemas.create', translationParams, options);
  }
}

export class SchemaUpdateException extends DefaultInternalServerErrorException {
  constructor(c: Context, translationParams: { id: number }, options?: HTTPExceptionOptions) {
    super(c, 'server.exceptions.schemas.update', translationParams, options);
  }
}
