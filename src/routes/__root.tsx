import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/Sidebar";
import { HelpBot } from "@/components/layout/HelpBot";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#0d111a] text-white">
        <Sidebar />
        <main className="flex-1 px-3 py-4 sm:px-6 sm:py-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <HelpBot />
      <Toaster theme="dark" />
    </QueryClientProvider>
  );
}
