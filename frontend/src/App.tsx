
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signup";
import Card from "./pages/Card"
import StorePreview from "./pages/preview"
import Login from "./pages/login"
import Project from "./pages/Project"
import NewProject from "./pages/NewProject";

import Layout from "./components/layout/layout";
import ProtectedLayout
  from "./components/layout/ProtectedLayout";

  
const NotFound = () => {
  return <h1>404 - Page Not Found</h1>;
};

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Login />} />

        <Route element={<ProtectedLayout />}>

          <Route path="/app" element={<Layout />}>
            <Route path="card" element={<Card />} />
            <Route path="preview" element={<StorePreview />} />
            <Route path="project" element={<Project />} />
            <Route path="project/new" element={<NewProject />} />
            <Route path="project/:id" element={<Card />} />
            <Route path="card/:groupId" element={<Card />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );

}

export default App
