import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({children}:any) => {
  return (
    <div style={{ display: "flex" }}>
      {/* <Sidebar /> */}
      <main style={{flex:1}}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout