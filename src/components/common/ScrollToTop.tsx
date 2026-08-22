import { useEffect } from "react";
import { useLocation } from "react-router";

/** Every navigation starts at the top of the page, as a page load would. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
