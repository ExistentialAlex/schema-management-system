import type { MessageSchema } from 'schema-manager-i18n';

declare module '@intlify/hono' {
  // extend `DefineLocaleMessage` with `ResourceSchema`
  export interface DefineLocaleMessage extends MessageSchema {}
}
