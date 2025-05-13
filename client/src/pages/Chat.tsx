import { Helmet } from "react-helmet";
import ChatInterface from "@/components/ChatInterface";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import VipConfirmModal from "@/components/VipConfirmModal";
import { useState } from "react";

const Chat = () => {
  const [, setLocation] = useLocation();
  const [vipModalOpen, setVipModalOpen] = useState(false);

  const handleFreeClick = () => {
    setLocation('/free');
  };

  const handleVipClick = () => {
    // Open VIP modal instead of direct navigation
    setVipModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Zyah King AI Chat</title>
        <meta name="description" content="Chat with Zyah King AI - Chọn phiên bản miễn phí hoặc VIP" />
        <meta property="og:title" content="Zyah King AI Chat" />
        <meta property="og:description" content="Chat với Zyah King - Chọn phiên bản phù hợp" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Zyah King<span className="text-pink-400">👽</span></h1>
        <p className="text-lg text-slate-300 mb-8 text-center">Chọn phiên bản chat phù hợp với nhu cầu của bạn</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-white">Phiên bản Miễn Phí</h2>
            <ul className="text-slate-300 space-y-2 mb-6 flex-grow">
              <li>✓ 30 tin nhắn miễn phí</li>
              <li>✓ Trả lời nhanh chóng</li>
              <li>✓ Lưu trữ lịch sử chat</li>
              <li className="text-slate-500">✗ Không có tính năng nâng cao</li>
              <li className="text-slate-500">✗ Không thể tải tệp lên</li>
            </ul>
            <Button 
              onClick={handleFreeClick}
              className="w-full py-6" 
              variant="outline"
            >
              Dùng Phiên Bản Miễn Phí
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 p-6 rounded-lg border border-pink-700/50 flex flex-col">
            <h2 className="text-xl font-bold mb-2 text-white flex items-center">
              Phiên bản VIP
              <span className="ml-2 text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full">PRO</span>
            </h2>
            <ul className="text-slate-200 space-y-2 mb-6 flex-grow">
              <li>✓ Không giới hạn tin nhắn</li>
              <li>✓ Tất cả tính năng của phiên bản miễn phí</li>
              <li>✓ Tính năng suy nghĩ sâu (DeepThinking)</li>
              <li>✓ Tìm kiếm web theo thời gian thực</li>
              <li>✓ Phân tích file tài liệu (như DeepSeek)</li>
              <li>✓ Trọn đời - Không cần thuê bao</li>
            </ul>
            <Button 
              onClick={handleVipClick}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 py-6"
            >
              Dùng Phiên Bản VIP
            </Button>
          </div>
        </div>
      </div>

      {/* VIP Confirmation Modal */}
      <VipConfirmModal
        isOpen={vipModalOpen}
        onClose={() => setVipModalOpen(false)}
      />
    </>
  );
};

export default Chat;
