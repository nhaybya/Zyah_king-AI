import { useRef, useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import Header from "./Header";
import MessageComposer from "./MessageComposer";
import ApiKeyModal from "./ApiKeyModal";
import Message from "./Message";
import { PlusCircle, Trash2, Menu, Pencil, Search, BrainCircuit, ImageIcon, Check, FileSearch, ChevronDown, ChevronUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChatInterfaceProps {
  forceFreeMode?: boolean;
  forceVIPMode?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  forceFreeMode = false, 
  forceVIPMode = false 
}) => {
  const {
    messages,
    isTyping,
    messageCount,
    maxFreeMessages,
    isFreeUser,
    apiKey,
    apiKeyModalOpen,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleApiKeySave,
    handleUseDefaultKey,
    setApiKeyModalOpen,
    currentChatId,
    chatList,
    createNewChat,
    switchChat,
    deleteChat,
    deepThinkingMode,
    setDeepThinkingMode,
    webSearchMode,
    setWebSearchMode,
    imageGenerationMode,
    setImageGenerationMode,
    fileAnalysisMode,
    setFileAnalysisMode
  } = useChat({
    forceFreeMode,
    forceVIPMode
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vipDrawerOpen, setVipDrawerOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when typing indicator appears/disappears
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const formatChatName = (chatId: string) => {
    if (chatId === "default") return "Trò chuyện mặc định";
    
    const timestamp = chatId.replace("chat-", "");
    const date = new Date(parseInt(timestamp));
    return `Trò chuyện ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Update document class list when VIP status changes
  useEffect(() => {
    if (isFreeUser) {
      document.documentElement.classList.remove('vip-mode');
    } else {
      document.documentElement.classList.add('vip-mode');
    }
  }, [isFreeUser]);
  
  // Rename chat state
  const [isRenaming, setIsRenaming] = useState(false);
  const [chatNameInput, setChatNameInput] = useState("");
  const [customChatNames, setCustomChatNames] = useState<Record<string, string>>({});
  
  // Load saved custom chat names
  useEffect(() => {
    const savedNames = localStorage.getItem("zyah-chat-names");
    if (savedNames) {
      setCustomChatNames(JSON.parse(savedNames));
    }
  }, []);

  // Save custom chat names
  useEffect(() => {
    if (Object.keys(customChatNames).length) {
      localStorage.setItem("zyah-chat-names", JSON.stringify(customChatNames));
    }
  }, [customChatNames]);

  const handleRenameChat = (chatId: string) => {
    const newName = chatNameInput.trim();
    if (newName) {
      setCustomChatNames(prev => ({
        ...prev,
        [chatId]: newName
      }));
      setIsRenaming(false);
      setChatNameInput("");
    }
  };

  const getChatName = (chatId: string) => {
    if (customChatNames[chatId]) {
      return customChatNames[chatId];
    }
    return formatChatName(chatId);
  };
  
  // VIP feature - File analysis
  // Lưu ý: Các tính năng VIP khác đã được lấy từ useChat hook

  return (
    <div className={`flex h-screen ${!isFreeUser ? 'vip-mode' : ''}`}>
      {/* Chat Sidebar */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-card border-r border-border h-screen overflow-hidden flex flex-col z-10 absolute md:relative`}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold">Danh sách trò chuyện</h2>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <Menu size={18} />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2">
          {chatList.map(chatId => (
            <div 
              key={chatId}
              className={`flex justify-between items-center px-3 py-2 rounded-md mb-1 cursor-pointer ${currentChatId === chatId ? 'bg-muted' : 'hover:bg-accent/10'}`}
              onClick={() => {
                if (!isRenaming || currentChatId !== chatId) {
                  switchChat(chatId);
                  setSidebarOpen(false);
                }
              }}
            >
              {isRenaming && currentChatId === chatId ? (
                <div className="flex flex-1 items-center gap-1">
                  <Input
                    value={chatNameInput}
                    onChange={(e) => setChatNameInput(e.target.value)}
                    placeholder="Tên cuộc trò chuyện"
                    className="text-sm h-7 py-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameChat(chatId);
                      } else if (e.key === 'Escape') {
                        setIsRenaming(false);
                      }
                    }}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => handleRenameChat(chatId)}
                  >
                    <Check size={14} />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="truncate flex-1">{getChatName(chatId)}</div>
                  <div className="flex">
                    {!isFreeUser && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setChatNameInput(customChatNames[chatId] || "");
                          setIsRenaming(true);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                    )}
                    {chatList.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 opacity-70 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chatId);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              createNewChat();
              setSidebarOpen(false);
            }}
          >
            <PlusCircle size={16} /> Tạo trò chuyện mới
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          messageCount={messageCount}
          maxFreeMessages={maxFreeMessages}
          isFreeUser={isFreeUser}
          onOpenApiModal={() => setApiKeyModalOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-hidden flex flex-col relative">
          {/* Chat Messages Area */}
          <div 
            ref={chatContainerRef}
            className="chat-container flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
          >
            {messages.map((message, index) => (
              <Message 
                key={index} 
                role={message.role} 
                content={message.content}
                allowCopy={!isFreeUser} // Only VIP users can copy
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`message-bubble px-4 py-3 rounded-2xl bg-muted typing-animation ${
                  deepThinkingMode ? "deep-thinking" : ""
                }`}>
                  {deepThinkingMode ? "Đang suy nghĩ sâu..." : "Đang trả lời..."}
                </div>
              </div>
            )}
          </div>

          {/* VIP Features as a collapsible drawer - only show for VIP users */}
          {!isFreeUser && (
            <Collapsible
              open={vipDrawerOpen}
              onOpenChange={setVipDrawerOpen}
              className="w-full border-t border-pink-500/20 py-1"
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="vip-drawer-trigger">
                      {vipDrawerOpen ? (
                        <ChevronUp className="h-4 w-4 text-pink-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-pink-400" />
                      )}
                      <Settings className="h-4 w-4 ml-1 text-pink-400" />
                      <span className="text-pink-300 text-sm font-medium ml-1">
                        Tính năng VIP
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                </div>

                {(deepThinkingMode || webSearchMode || imageGenerationMode || fileAnalysisMode) && (
                  <div className="mr-2 flex items-center vip-indicator">
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                    <span className="text-xs text-pink-300">
                      {deepThinkingMode && webSearchMode && imageGenerationMode && fileAnalysisMode
                        ? "Tất cả tính năng đang bật" 
                        : "Tính năng VIP đang bật"}
                    </span>
                  </div>
                )}
              </div>

              <CollapsibleContent className="vip-drawer-content">
                <div className="vip-features-grid">
                  <button
                    className={`vip-feature-button ${deepThinkingMode ? 'active' : 'bg-pink-900/20 text-pink-100 hover:bg-pink-900/30'}`}
                    onClick={() => setDeepThinkingMode(!deepThinkingMode)}
                    title="Phân tích sâu hơn, suy nghĩ kỹ lưỡng hơn giống như DeepSeek"
                  >
                    <BrainCircuit size={16} />
                    <span>Suy nghĩ sâu</span>
                    {deepThinkingMode && <Check size={14} className="ml-1" />}
                  </button>
                  
                  <button
                    className={`vip-feature-button ${webSearchMode ? 'active' : 'bg-pink-900/20 text-pink-100 hover:bg-pink-900/30'}`}
                    onClick={() => setWebSearchMode(!webSearchMode)}
                    title="Tra cứu thông tin trên internet theo thời gian thực"
                  >
                    <Search size={16} />
                    <span>Tìm kiếm web</span>
                    {webSearchMode && <Check size={14} className="ml-1" />}
                  </button>
                  
                  <button
                    className={`vip-feature-button ${imageGenerationMode ? 'active' : 'bg-pink-900/20 text-pink-100 hover:bg-pink-900/30'}`}
                    onClick={() => setImageGenerationMode(!imageGenerationMode)}
                    title="Tạo hình ảnh từ mô tả văn bản, tương tự Gemini"
                  >
                    <ImageIcon size={16} />
                    <span>Tạo ảnh AI</span>
                    {imageGenerationMode && <Check size={14} className="ml-1" />}
                  </button>
                  
                  <button
                    className={`vip-feature-button ${fileAnalysisMode ? 'active' : 'bg-pink-900/20 text-pink-100 hover:bg-pink-900/30'}`}
                    onClick={() => setFileAnalysisMode(!fileAnalysisMode)}
                    title="Phân tích file được tải lên như tài liệu, hình ảnh, PDF"
                  >
                    <FileSearch size={16} />
                    <span>Phân tích file</span>
                    {fileAnalysisMode && <Check size={14} className="ml-1" />}
                  </button>
                </div>
                <div className="text-xs text-pink-300/70 italic mt-1">
                  Mở các tính năng VIP để tăng cường khả năng của Zyah King👽
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Message Composer */}
          <MessageComposer
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            disabled={isFreeUser && messageCount >= maxFreeMessages}
            allowImageUpload={!isFreeUser} // Only VIP users can upload images
            deepThinking={deepThinkingMode}
            webSearch={webSearchMode}
            imageGeneration={imageGenerationMode}
            fileAnalysis={fileAnalysisMode}
          />
        </main>

        {/* API Key Modal */}
        <ApiKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={handleApiKeySave}
          onUseDefault={handleUseDefaultKey}
          defaultApiKey="AIzaSyCHOlBGd3R5LYeGclWQq3pUXZa028YeF9E"
          currentApiKey={apiKey}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
