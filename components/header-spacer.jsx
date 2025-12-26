"use client";

import { useEffect, useState } from "react";

export default function HeaderSpacer() {
  const [h, setH] = useState(0);

  useEffect(() => {
    const el = document.getElementById("app-header");
    if (!el) return;

    const update = () => setH(el.getBoundingClientRect().height);

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div style={{ height: h }} aria-hidden="true" />;
}
