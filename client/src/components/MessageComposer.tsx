import { useState, useRef, useEffect } from "react";
import { Send, X, Image, Upload, XCircle, BrainCircuit, Search, ImageIcon, FileSearch, FileText, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/hooks/useChat";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  allowImageUpload?: boolean;
  deepThinking?: boolean;
  webSearch?: boolean;
  imageGeneration?: boolean;
  fileAnalysis?: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
  allowImageUpload = false,
  deepThinking = false,
  webSearch = false,
  imageGeneration = false,
  fileAnalysis = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [showClearButton, setShowClearButton] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const { toast } = useToast();
  const { rememberedCommands } = useChat();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = newHeight + 'px';
    }
    setShowClearButton(value.trim().length > 0);
  }, [value]);

  const handleClear = () => {
    onChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || uploadedImage) && !disabled) {
        onSend();
        if (uploadedImage) {
          setUploadedImage(null);
        }
      }
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleDocumentUpload = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ảnh quá lớn",
        description: "Kích thước ảnh tối đa là 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Định dạng không hỗ trợ",
        description: "Vui lòng tải lên hình ảnh (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setIsUploading(false);
      
      // Update message with information about the image
      const imageDescription = `[Đã tải lên ảnh: ${file.name} (${Math.round(file.size / 1024)}KB)]`;
      onChange(value ? `${value}\n${imageDescription}` : imageDescription);
      
      toast({
        title: "Đã tải lên thành công",
        description: "Ảnh đã được đính kèm và sẽ được gửi đi cùng với tin nhắn của bạn.",
        variant: "default",
      });
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Lỗi tải lên",
        description: "Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    
    // Update the message to remove image description
    const imageRegex = /\[Đã tải lên ảnh:.*?\]/g;
    onChange(value.replace(imageRegex, '').trim());
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Tài liệu quá lớn",
        description: "Kích thước tài liệu tối đa là 10MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type (accept common document formats)
    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'text/csv', 'application/json', 'text/markdown'];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      toast({
        title: "Định dạng không hỗ trợ",
        description: "Vui lòng tải lên tài liệu văn bản (PDF, TXT, DOC, DOCX, CSV, JSON, MD)",
        variant: "destructive",
      });
      return;
    }

    setIsFileUploading(true);
    setUploadedFile(file);
    setUploadedFileName(file.name);
    
    // Update message with information about the document
    const fileDescription = `[Đã tải lên tài liệu: ${file.name} (${Math.round(file.size / 1024)}KB)]`;
    onChange(value ? `${value}\n${fileDescription}` : fileDescription);
    
    toast({
      title: "Đã tải lên thành công",
      description: "Tài liệu đã được đính kèm và sẽ được phân tích khi gửi tin nhắn.",
      variant: "default",
    });
    
    setIsFileUploading(false);
  };
  
  const removeFile = () => {
    setUploadedFile(null);
    setUploadedFileName(null);
    
    // Update the message to remove file description
    const fileRegex = /\[Đã tải lên tài liệu:.*?\]/g;
    onChange(value.replace(fileRegex, '').trim());
    
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t border-border p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Active VIP features indicator */}
        {(deepThinking || webSearch || imageGeneration || fileAnalysis) && (
          <div className="active-vip-features flex flex-wrap gap-2 px-2 py-1.5 text-xs rounded-md bg-pink-900/10 border border-pink-500/20">
            {deepThinking && (
              <span className="inline-flex items-center gap-1 text-pink-300">
                <BrainCircuit size={12} />
                <span>Suy nghĩ sâu</span>
              </span>
            )}
            {webSearch && (
              <span className="inline-flex items-center gap-1 text-pink-300">
                <Search size={12} />
                <span>Tìm kiếm web</span>
              </span>
            )}
            {imageGeneration && (
              <span className="inline-flex items-center gap-1 text-pink-300">
                <ImageIcon size={12} />
                <span>Tạo ảnh AI</span>
              </span>
            )}
            {fileAnalysis && (
              <span className="inline-flex items-center gap-1 text-pink-300">
                <FileSearch size={12} />
                <span>Phân tích file</span>
              </span>
            )}
          </div>
        )}
        
        {/* Image preview */}
        {uploadedImage && (
          <div className="relative inline-block">
            <img 
              src={uploadedImage} 
              alt="Uploaded preview" 
              className="image-preview" 
            />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={removeImage}
            >
              <XCircle className="h-5 w-5" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        )}
        
        {/* Document preview */}
        {uploadedFileName && (
          <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-accent/30 rounded-md">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{uploadedFileName}</span>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-6 w-6 rounded-full ml-2"
              onClick={removeFile}
            >
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        )}
        
        <div className="flex space-x-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn hoặc tải ảnh lên..."
              className="w-full p-3 pr-20 resize-none min-h-[50px] max-h-[150px]"
              rows={1}
            />
            
            {showClearButton && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-16 bottom-2.5 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear input</span>
              </Button>
            )}
            
            {allowImageUpload && (
              <>
                {/* Memory dropdown - show previously used commands */}
                {rememberedCommands.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute right-[84px] bottom-2.5 h-8 w-8 text-muted-foreground hover:text-primary"
                        title="Lệnh đã dùng trước đó"
                      >
                        <Clock className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3 absolute bottom-0 right-0" />
                        <span className="sr-only">Lệnh đã dùng</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[260px] max-h-[200px] overflow-y-auto">
                      {rememberedCommands.map((cmd, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="cursor-pointer truncate"
                          onClick={() => onChange(cmd)}
                        >
                          {cmd.length > 40 ? cmd.substring(0, 40) + '...' : cmd}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-16 bottom-2.5 h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  title="Tải lên hình ảnh"
                >
                  {isUploading ? (
                    <Upload className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Image className="h-4 w-4" />
                  )}
                  <span className="sr-only">Upload image</span>
                </Button>
                
                {fileAnalysis && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 bottom-2.5 h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={handleDocumentUpload}
                    disabled={isFileUploading}
                    title="Tải lên tài liệu để phân tích"
                  >
                    {isFileUploading ? (
                      <Upload className="h-4 w-4 animate-pulse" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span className="sr-only">Upload document</span>
                  </Button>
                )}
              </>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <input 
              type="file" 
              ref={documentInputRef}
              className="hidden" 
              accept=".pdf,.txt,.doc,.docx,.csv,.json,.md,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv,application/json,text/markdown"
              onChange={handleDocumentFileChange}
            />
          </div>
          
          <Button
            type="button"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-lg bg-primary hover:bg-primary/90"
            disabled={(!value.trim() && !uploadedImage && !uploadedFile) || disabled}
            onClick={() => {
              onSend();
              if (uploadedImage) {
                setUploadedImage(null);
              }
              if (uploadedFile) {
                setUploadedFile(null);
                setUploadedFileName(null);
              }
            }}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
