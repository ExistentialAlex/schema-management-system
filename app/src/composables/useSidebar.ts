import type { NavigationMenuItem } from '@nuxt/ui';
import { useLocalStorage } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useSidebar = () => {
  const { t } = useI18n();

  const open = useLocalStorage('schema-manager-sidebar', true);

  const toggleSidebar = () => (open.value = !open.value);

  const sidebarItems = ref<NavigationMenuItem[]>([
    [
      {
        value: 'dashboard',
        label: t('app.sidebar.dashboard'),
        to: '/',
        icon: 'i-lucide-layout-dashboard',
      },
      {
        value: 'schemas',
        label: t('app.sidebar.schemas'),
        to: '/schemas',
        icon: 'i-lucide-file-text',
      },
      {
        value: 'users',
        label: t('app.sidebar.users'),
        to: '/users',
        icon: 'i-lucide-user',
      },
    ],
  ]);

  return { sidebarItems, toggleSidebar, open };
};
