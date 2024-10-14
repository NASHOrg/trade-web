export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const { token } = useUserStore();
  switch (to.path) {
    case '/':
      if (token) return navigateTo('/dashboard');
      break;
    default:
      if (!token) return navigateTo('/');
  }
});
