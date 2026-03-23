
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Card from "./pages/Card"
import StorePreview from "./pages/preview"
import Sidebar from "./components/Sidebar"
import Login from "./pages/login"

const NotFound = () => {
  return <h1>404 - Page Not Found</h1>;
};
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Login/>} />

        <Route path="/app" element={<AppLayout />}>
          <Route path="card" element={<Card />} />
          <Route path="preview" element={<StorePreview />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );

}

export default App
