import { appRouter } from '../../server';
import { createContext } from '../../server/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type LoaderFunctionArgs } from 'react-router';

export const config = {
  runtime: 'edge',
};

// Handle GET requests (React Router loader)
export async function loader({ request }: LoaderFunctionArgs) {
  return handleTRPCRequest(request);
}

// Handle POST requests (React Router action)
export async function action({ request }: LoaderFunctionArgs) {
  return handleTRPCRequest(request);
}

// Common handler for both GET and POST
async function handleTRPCRequest(request: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext,
  });
}

// Keep the POST function for backward compatibility
export function POST(request: Request) {
  return handleTRPCRequest(request);
}
