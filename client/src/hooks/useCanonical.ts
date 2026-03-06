import { useEffect } from "react";

const DOMAIN = "https://dogbreedsandneeds.com";

export function useCanonical(path: string) {
  useEffect(() => {
    const url = `${DOMAIN}${path}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
    return () => {
      if (link && link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [path]);
}
