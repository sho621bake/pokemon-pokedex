import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
  layout('layout.tsx', [
    index('page.tsx'),
    route('pokemon/:id', 'pokemon/$id.tsx'),
    route('pokemon/*', 'not-found.tsx', { id: 'pokemon-not-found' }),
    route('types', 'types/page.tsx'),
    route('api/trpc/*', 'api/trpc/$trpc.tsx'),
    route('*', 'not-found.tsx', { id: 'global-not-found' }),
  ]),
] satisfies RouteConfig;
