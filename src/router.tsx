import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function createRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
  });
}

// TanStack Start's client/server entry points import `getRouter` from this
// file by convention (virtual module `#tanstack-router-entry`) — exporting
// only `createRouter` builds fine but fails at runtime with a
// "getRouter is not exported" bundling error.
export function getRouter() {
  return createRouter();
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
