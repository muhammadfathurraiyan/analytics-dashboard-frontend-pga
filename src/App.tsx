import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "./components/global/Header";
import Analytics from "./components/main/Analytics";
import Overview from "./components/main/Overview";
import { GlobalContextProvider } from "./context/GlobalContextProvider";

export default function App() {
  return (
    <GlobalContextProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <main className="px-16 py-8 max-lg:px-4 space-y-6">
        <div>
          <h2 className="font-bold text-3xl">Dashboard</h2>
          <p className="text-muted-foreground text-sm">
            Analytics dashboard yellow taxi trip.
          </p>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Overview />
          </TabsContent>
          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </main>
    </GlobalContextProvider>
  );
}
