import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsScripts() {
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    const cleanup: HTMLScriptElement[] = [];

    if (gaId) {
      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gaScript);
      cleanup.push(gaScript);

      const configScript = document.createElement("script");
      configScript.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(configScript);
      cleanup.push(configScript);
    }

    if (plausibleDomain) {
      const plausibleScript = document.createElement("script");
      plausibleScript.defer = true;
      plausibleScript.dataset.domain = plausibleDomain;
      plausibleScript.src = "https://plausible.io/js/script.js";
      document.head.appendChild(plausibleScript);
      cleanup.push(plausibleScript);
    }

    return () => {
      cleanup.forEach((script) => script.remove());
    };
  }, []);

  return null;
}
