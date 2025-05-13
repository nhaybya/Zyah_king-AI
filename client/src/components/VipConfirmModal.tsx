import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VipConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VipConfirmModal: React.FC<VipConfirmModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleActivate = () => {
    // The official VIP key
    if (apiKey === 'Zyahking2405') {
      // Save the API key to localStorage
      localStorage.setItem('zyah-api-key', apiKey);
      // Set the user as a VIP user
      localStorage.setItem('zyah-is-vip', 'true');
      
      // Show success message
      toast({
        title: "VIP Đã Kích Hoạt",
        description: "Bạn đã kích hoạt tính năng VIP, không giới hạn tin nhắn với tốc độ phản hồi nhanh.",
        variant: "default",
      });
      
      // Navigate to VIP page
      setLocation('/vip');
    } else {
      // Show error message
      toast({
        title: "Mã Không Hợp Lệ",
        description: "Mã VIP không hợp lệ. Sử dụng mã chính xác để nâng cấp.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            Kích Hoạt Tài Khoản VIP
          </DialogTitle>
          <DialogDescription>
            Nhập mã VIP của bạn để kích hoạt các tính năng cao cấp và sử dụng không giới hạn.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 border rounded-lg bg-slate-950/30 mt-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                Mã VIP
              </Label>
              <Input
                id="api-key"
                placeholder="Nhập mã VIP của bạn"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-900"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button 
            onClick={handleActivate}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Kích Hoạt VIP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VipConfirmModal;