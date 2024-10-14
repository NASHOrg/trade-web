export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;
  const { token } = useUserStore();
  if (!token && to.path !== '/') return navigateTo('/');
});
