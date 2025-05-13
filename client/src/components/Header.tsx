import { Key, Sun, Moon, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

interface HeaderProps {
  messageCount: number;
  maxFreeMessages: number;
  isFreeUser: boolean;
  onOpenApiModal: () => void;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  messageCount,
  maxFreeMessages,
  isFreeUser,
  onOpenApiModal,
  onToggleSidebar,
}) => {
  const { theme, setTheme } = useTheme();

  const getCounterColor = () => {
    if (isFreeUser) {
      if (messageCount >= maxFreeMessages) {
        return "text-red-600 dark:text-red-400";
      }
      if (messageCount > maxFreeMessages * 0.8) {
        return "text-yellow-600 dark:text-yellow-400";
      }
    }
    return "";
  };

  return (
    <header className="border-b border-border py-3 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-1 md:hidden" 
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="font-display text-lg font-semibold flex items-center relative">
            <span className="animated-text">ZYAH KING</span>
            <span className="ml-2 text-primary">👽</span>
          </h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">AI ASSISTANT</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Free message counter */}
        <div 
          className={`text-sm px-3 py-1 bg-muted rounded-full flex items-center ${getCounterColor()}`}
        >
          <span className="font-mono mr-1">{messageCount}</span>
          <span className="text-muted-foreground">/{maxFreeMessages}</span>
        </div>
        
        {/* API Key button */}
        <Button 
          variant={isFreeUser ? "outline" : "default"}
          size="sm" 
          className={`text-sm rounded-full flex items-center gap-1.5 ${
            isFreeUser 
              ? "" 
              : "bg-gradient-to-r from-purple-800 to-violet-500 hover:from-purple-700 hover:to-violet-400"
          }`}
          onClick={onOpenApiModal}
        >
          {isFreeUser ? (
            <Key className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isFreeUser ? "Nâng cấp VIP" : "VIP Activated"}</span>
        </Button>
        
        {/* Dark/Light Mode Toggle */}
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
