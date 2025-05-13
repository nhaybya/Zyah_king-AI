import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Chat from "@/pages/Chat";
import FreeChat from "@/pages/FreeChat";
import VipChat from "@/pages/VipChat";
import Login from "@/pages/Login";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Check if user is first time visitor
const isFirstTimeVisitor = () => {
  const visited = localStorage.getItem("zyah-visited");
  if (!visited) {
    localStorage.setItem("zyah-visited", "true");
    return true;
  }
  return false;
};

function Router() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect first-time visitors to login page if they try to access the chat directly
    if (location === "/" && isFirstTimeVisitor()) {
      setLocation("/login");
    }
    
    // Handle GitHub Pages path issues
    const path = window.location.pathname;
    const basePath = document.querySelector('base')?.getAttribute('href') || '/';
    
    // If we're at the repository root but not at the app root, redirect
    if (path.endsWith('/') && path !== basePath && location === '/') {
      const newPath = path.replace(/\/$/, '');
      window.history.replaceState({}, '', newPath);
    }
  }, [location, setLocation]);
  
  return (
    <>
      <GithubPagesAlert />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/free" component={FreeChat} />
        <Route path="/vip" component={VipChat} />
        <Route path="/" component={Chat} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

// Cảnh báo cho người dùng biết đây là phiên bản GitHub Pages
function GithubPagesAlert() {
  return (
    <Alert variant="destructive" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Phiên bản GitHub Pages</AlertTitle>
      <AlertDescription>
        Đây là phiên bản trình diễn trên GitHub Pages, không kết nối với API thực tế.
        Các tin nhắn trong ứng dụng này chỉ là mẫu.
      </AlertDescription>
    </Alert>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;