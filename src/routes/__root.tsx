import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/Sidebar";
import appCss from "@/styles.css?url";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Veritas — Truth Platform" },
      { name: "description", content: "Signal over noise, verified over viral." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
              <Outlet />
            </main>
          </div>
          <Toaster theme="dark" />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
