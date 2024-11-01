import { Outlet } from "react-router-dom";
import CartButton from "../../components/CartButton";
import "./layout.css";
import { useCallback, useEffect, useRef } from "react";

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

  return (
    <div
      style={{ transition: "height 0.3s ease" }}
      ref={contentPageRef}
      className="layout-page"
    >
      <header>
        <a href="/">
          <img className="header-logo" src="/logo_transparent.png" />
        </a>

        <CartButton />
      </header>
      <div className="content-page">
        <Outlet />
      </div>
      <footer>
        <p>Desenvolvido por Adriano Rodrigues</p>
        <div className="footer-icons">
          <ul>
            <li>
              <a
                href="http://github.com/drirodri"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/github-mark.png" alt="github-link" width="30px" />
              </a>
            </li>
            <li>
              <a
                href="http://linkedin.com/in/drirodri"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/linkedin.png" alt="linkedin-link" width="30px" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
