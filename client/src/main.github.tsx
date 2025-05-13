import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/ui/theme-provider";
import App from "./App.github";
import "./index.css";

// Điều chỉnh URL cơ sở cho GitHub Pages
(function() {
  const isGitHubPages = window.location.hostname.includes('github.io');
  if (isGitHubPages) {
    // Thêm một thẻ <base> vào head nếu nó chưa tồn tại
    if (!document.querySelector('base')) {
      const pathSegments = window.location.pathname.split('/');
      if (pathSegments.length > 1) {
        const repoName = pathSegments[1];
        const baseTag = document.createElement('base');
        baseTag.href = `/${repoName}/`;
        document.head.appendChild(baseTag);
      }
    }
  }
})();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="zyah-king-theme">
    <App />
  </ThemeProvider>
);