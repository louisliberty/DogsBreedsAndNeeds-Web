import { useEffect } from "react";

export function useRobots(content: string) {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = meta?.content ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = content;
    return () => {
      if (meta) {
        if (previous !== null) {
          meta.content = previous;
        } else {
          meta.content = "index, follow";
        }
      }
    };
  }, [content]);
}
