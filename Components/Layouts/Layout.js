import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "./navbar";
import Aside from "./aside";

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState("Todos");
  const router = useRouter();

  const hiddenRoutes = ["/register", "/login", "/Admin-panel", "/"];

  const shouldHide = hiddenRoutes.includes(router.pathname);

  return (
    <div className="flex flex-col min-h-screen rtl bg-gray-100">
       <Header />
      <div className="flex flex-grow">
        {!shouldHide && (
          <Aside
            setActiveSection={setActiveSection}
            activeSection={activeSection}
          />
        )}
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
