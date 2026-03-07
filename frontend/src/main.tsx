import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../index.css";
import { WidgetProvider } from "./context/WidgetContext";
import { MusicProvider } from "./context/MusicContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WidgetProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </WidgetProvider>
  </QueryClientProvider>,
);
