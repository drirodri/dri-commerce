import { NavLink, Outlet } from "react-router-dom";
import CartButton from "../../components/CartButton";
import "./layout.css";
import { useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

function Layout() {
  const contentPageRef = useRef<HTMLDivElement | null>(null);

  const updateHeight = useCallback(() => {
    const contentPage = contentPageRef.current;
    if (contentPage) {
      contentPage.style.height = `${contentPage.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    updateHeight();

    const observer = new MutationObserver(updateHeight);
    const contentPage = contentPageRef.current;

    if (contentPage) {
      observer.observe(contentPage, { childList: true });
    }

    window.addEventListener("resize", updateHeight);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [updateHeight]);

  const notMobile = useMediaQuery({ query: "(min-width:501px)" });

  const navLinks = [
    { to: "/", label: "Início" },
    { to: "/login", label: "Entrar" },
    { to: "/cartcheckout", label: "Checkout" },
  ];

  return (
    <div
      style={{ transition: "height 0.3s ease" }}
      ref={contentPageRef}
      className="layout-page"
    >
      <header className="layout-header">
        <div className="layout-brand">
          <NavLink to="/" className="layout-brand-title">
            Dri-Commerce
          </NavLink>
          <span className="layout-brand-tagline">
            Seu marketplace de tecnologia preferido
          </span>
        </div>

        <NavigationMenu className="layout-navigation">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent px-3 py-2 text-sm sm:text-base",
                        isActive &&
                          "bg-accent/40 text-primary font-semibold shadow-sm"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {notMobile && <CartButton />}
      </header>

      <main className="content-page">
        <Outlet />
      </main>

        <footer className="layout-footer">
          <Separator className="layout-footer-separator" />
          <div className="layout-footer-content">
            <div className="layout-footer-meta">
              <span className="layout-footer-title">Dri-Commerce</span>
              <span className="layout-footer-credit">
                Desenvolvido por Adriano Rodrigues
              </span>
            </div>

            <nav className="layout-footer-links">
              <a
                href="http://github.com/drirodri"
                target="_blank"
                rel="noopener noreferrer"
                className="layout-footer-link"
              >
                <img src="/github-mark.png" alt="GitHub" width="24" height="24" />
                <span>GitHub</span>
              </a>
              <a
                href="http://linkedin.com/in/drirodri"
                target="_blank"
                rel="noopener noreferrer"
                className="layout-footer-link"
              >
                <img src="/linkedin.png" alt="LinkedIn" width="24" height="24" />
                <span>LinkedIn</span>
              </a>
            </nav>
          </div>
        </footer>
    </div>
  );
}

export default Layout;
