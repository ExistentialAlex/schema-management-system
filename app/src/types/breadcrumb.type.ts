import type { MessageSchema } from 'schema-manager-i18n';
import type { ShapeOf } from 'schema-manager-types';
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import type { RouteNamedMap } from 'vue-router/auto-routes';

export interface AppBreadcrumb<TRouteName extends keyof RouteNamedMap> {
  to: RouteLocationRaw;
  label: ShapeOf<MessageSchema>;
  params?: Record<string, (route: RouteLocationNormalized<TRouteName>) => string>;
}
