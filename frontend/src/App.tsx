import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { AnalyticsScripts } from "./components/seo/AnalyticsScripts";
import { LoadingPanel } from "./components/common/LoadingPanel";
import { useAuth } from "./context/AuthContext";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { HomePage } from "./pages/HomePage";

function ProtectedRoute() {
  const { token, initializing } = useAuth();

  if (initializing) {
    return <LoadingPanel label="Verifying session" />;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminDashboardPage />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/blog",
    element: <BlogPage />
  },
  {
    path: "/blog/:slug",
    element: <BlogPostPage />
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />
  },
  {
    path: "/admin",
    element: <ProtectedRoute />
  }
]);

export default function App() {
  return (
    <>
      <AnalyticsScripts />
      <RouterProvider router={router} />
    </>
  );
}
