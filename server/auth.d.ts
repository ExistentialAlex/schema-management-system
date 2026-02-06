import type { UserSession } from 'schema-manager-types';
import 'hono-session/global';

declare module 'hono-session' {
  export interface Session extends UserSession {}
}
