import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Check, X, KeyRound, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  onUseDefault: () => void;
  defaultApiKey: string;
  currentApiKey: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUseDefault,
  defaultApiKey,
  currentApiKey,
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSaveClick = () => {
    const key = apiKey.trim();
    if (!key) {
      setStatusMessage({ text: "Vui lòng nhập mã VIP hợp lệ", error: true });
      return;
    }

    // Validate against the correct VIP key
    if (key !== "Zyahking2405") {
      setStatusMessage({ text: "Mã VIP không hợp lệ", error: true });
      return;
    }

    onSave(key);
    setStatusMessage({ text: "Mã VIP đã được kích hoạt", error: false });
    
    toast({
      title: "VIP Đã Kích Hoạt",
      description: "Bạn đã kích hoạt tính năng VIP, không giới hạn tin nhắn với tốc độ phản hồi nhanh.",
      variant: "default",
    });
    
    setTimeout(() => {
      onClose();
      setStatusMessage(null);
    }, 1000);
  };

  const handleUseDefaultClick = () => {
    setApiKey(defaultApiKey);
    onUseDefault();
    setStatusMessage({ text: "Tiếp tục dùng phiên bản miễn phí", error: false });
    
    toast({
      title: "Phiên Bản Miễn Phí",
      description: "Tiếp tục sử dụng phiên bản miễn phí với giới hạn 30 tin nhắn và độ trễ 5-10s.",
      variant: "default",
    });
    
    setTimeout(() => {
      onClose();
      setStatusMessage(null);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#130522] to-[#280A2E] border-pink-500/30 shadow-lg shadow-pink-500/10">
        <DialogHeader className="pb-4 border-b border-pink-500/20">
          <DialogTitle className="flex items-center gap-2 text-pink-300">
            <KeyRound className="h-6 w-6 text-pink-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-pink-500">
              Nâng Cấp VIP
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm text-pink-200/70 mt-2">
            Mở khóa đầy đủ tính năng của trí tuệ nhân tạo
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <h3 className="text-base font-medium text-pink-100">Nâng Cấp Ngay Hôm Nay</h3>
            <p className="text-sm text-pink-100/70 leading-relaxed">
              VIP mang đến trải nghiệm cao cấp với tính năng không giới hạn, tốc độ phản hồi siêu nhanh và các công cụ độc quyền.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-pink-100/80">
              <Check className="h-4 w-4 text-pink-400" />
              <span>Tin nhắn không giới hạn</span>
            </div>
            <div className="flex items-center gap-2 text-pink-100/80">
              <Check className="h-4 w-4 text-pink-400" />
              <span>Phản hồi siêu nhanh</span>
            </div>
            <div className="flex items-center gap-2 text-pink-100/80">
              <Check className="h-4 w-4 text-pink-400" />
              <span>Tạo ảnh AI</span>
            </div>
            <div className="flex items-center gap-2 text-pink-100/80">
              <Check className="h-4 w-4 text-pink-400" />
              <span>Tìm kiếm thông tin mới nhất</span>
            </div>
          </div>
          
          <div className="relative">
            <Input
              ref={inputRef}
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Nhập mã VIP của bạn"
              className="pr-10 bg-pink-900/20 border-pink-500/30 focus:border-pink-400 text-pink-100 placeholder:text-pink-300/40"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full aspect-square text-pink-300 hover:text-pink-100 hover:bg-transparent"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showApiKey ? "Ẩn mã" : "Hiện mã"}
              </span>
            </Button>
          </div>
          
          {statusMessage && (
            <div className={`text-sm flex items-center justify-center gap-1.5 p-2 rounded-md ${
              statusMessage.error 
                ? "text-red-200 bg-red-500/20 border border-red-500/30" 
                : "text-green-200 bg-green-500/20 border border-green-500/30"
            }`}>
              {statusMessage.error ? (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Check className="h-4 w-4 flex-shrink-0" />
              )}
              {statusMessage.text}
            </div>
          )}
          

        </div>
        
        <DialogFooter className="flex sm:justify-between sm:space-x-2 border-t border-pink-500/20 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleUseDefaultClick}
            className="border-pink-500/40 text-pink-100 hover:bg-pink-900/30 hover:text-pink-100"
          >
            Tiếp Tục Miễn Phí
          </Button>
          <Button 
            type="button"
            onClick={handleSaveClick}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-none hover:opacity-90"
          >
            Kích Hoạt VIP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
