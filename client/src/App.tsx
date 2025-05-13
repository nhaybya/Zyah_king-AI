import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Chat from "@/pages/Chat";
import FreeChat from "@/pages/FreeChat";
import VipChat from "@/pages/VipChat";
import Login from "@/pages/Login";
import { useEffect } from "react";

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
  }, [location, setLocation]);
  
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/free" component={FreeChat} />
      <Route path="/vip" component={VipChat} />
      <Route path="/" component={Chat} />
      <Route component={NotFound} />
    </Switch>
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
