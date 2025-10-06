import { useState } from "react";
import { ItemsPage } from "./items/ItemsPage";
import { ToastContainer } from "./components/Toast";

export default function App() {
  const [apiBase] = useState<string>(
    import.meta.env.VITE_API_BASE ?? "http://localhost:4000"
  );
  return (
    <div className="container">
      <header className="header">
        <h1>Items</h1>
      </header>
      <ItemsPage apiBase={apiBase} />
      <ToastContainer />
    </div>
  );
}
