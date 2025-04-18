
import { Outlet } from "react-router-dom";
import { RedirectHandler } from "@/components/RedirectHandler";

export const Layout = () => {
  return (
    <>
      <RedirectHandler />
      <Outlet />
    </>
  );
};
