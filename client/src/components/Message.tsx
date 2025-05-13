import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MessageProps {
  role: string;
  content: string;
  allowCopy?: boolean;
}

const Message: React.FC<MessageProps> = ({ role, content, allowCopy = true }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Automatically reset the copied state after 2 seconds
  useEffect(() => {
    if (copiedCode) {
      const timer = setTimeout(() => setCopiedCode(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedCode]);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text);
      toast({
        title: "Đã sao chép!",
        description: "Nội dung đã được sao chép vào clipboard",
        variant: "default",
      });
    });
  };

  // Copy entire message
  const copyMessage = () => {
    copyToClipboard(content);
  };

  // Detect programming language from code block
  const detectLanguage = (code: string): string => {
    // Extract language from first line if specified
    const firstLine = code.trim().split('\n')[0].trim();
    
    // Common programming language patterns
    if (firstLine.includes('python') || code.includes('def ') || code.includes('import ') && code.includes(':')) {
      return 'Python';
    } else if (firstLine.includes('javascript') || firstLine.includes('js') || code.includes('const ') || code.includes('let ')) {
      return 'JavaScript';
    } else if (firstLine.includes('java') || code.includes('public class ') || code.includes('public static void main')) {
      return 'Java';
    } else if (firstLine.includes('c++') || code.includes('#include') || code.includes('std::')) {
      return 'C++';
    } else if (firstLine.includes('typescript') || firstLine.includes('ts') || code.includes('interface ') && code.includes(': ')) {
      return 'TypeScript';
    } else if (code.includes('func ') && code.includes('{}')) {
      return 'Go';
    } else if (code.includes('fn ') && code.includes('-> ')) {
      return 'Rust';
    } else if (code.includes('<?php')) {
      return 'PHP';
    } else if (code.includes('<html>') || code.includes('<!DOCTYPE')) {
      return 'HTML';
    } else if (code.includes('@media') || code.includes('{') && code.includes(':') && code.includes(';')) {
      return 'CSS';
    }
    
    return 'Code'; // Default
  };
  
  // Format the content based on user type (VIP or free)
  const processContent = (text: string) => {
    // For free users (not allowed to copy), use simple formatting
    if (!allowCopy) {
      return text
        // Simple code blocks for free users
        .replace(/```([\s\S]*?)```/g, '<pre>$1</pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br />');
    }
    
    // For VIP users, use fancy code formatting with copy buttons
    // First, handle code blocks with specialized formatting
    let processedText = text.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
      const language = detectLanguage(codeContent);
      const trimmedCode = codeContent.trim();
      const codeId = `code-${Math.random().toString(36).substring(2, 9)}`;
      
      return `
        <div class="code-block">
          <div class="code-block-header">
            <span>${language}</span>
          </div>
          <div class="code-block-content">
            <pre id="${codeId}">${trimmedCode}</pre>
          </div>
          <button class="code-copy-button" data-code="${codeId}" onclick="document.querySelector('[data-code-text=\\'${codeId}\\']').click()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </button>
          <span class="hidden" data-code-text="${codeId}">${trimmedCode}</span>
        </div>
      `;
    });
    
    return processedText
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };
  
  // Process message content
  const formattedContent = processContent(content);
  
  // Handle clicks on code copy buttons inside formatted HTML
  useEffect(() => {
    const handleCopyCodeClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-code-text')) {
        const codeText = target.textContent || '';
        copyToClipboard(codeText);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const messageElement = messageRef.current;
    if (messageElement) {
      const codeTextSpans = messageElement.querySelectorAll('[data-code-text]');
      codeTextSpans.forEach(span => {
        span.addEventListener('click', handleCopyCodeClick);
      });

      return () => {
        codeTextSpans.forEach(span => {
          span.removeEventListener('click', handleCopyCodeClick);
        });
      };
    }
  }, [content]);

  return (
    <div className={cn(
      "flex group relative",
      role === "user" ? "justify-end" : "justify-start"
    )}>
      <div
        ref={messageRef}
        className={cn(
          "message-bubble px-4 py-3 rounded-2xl relative",
          role === "user" 
            ? "bg-[hsl(var(--chat-user-bg))] text-[hsl(var(--chat-user-text))]" 
            : "bg-[hsl(var(--chat-ai-bg))] border-l-4 border-[hsl(var(--chat-ai-border))]"
        )}
      >
        <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        
        {/* Only show copy button for VIP users */}
        {allowCopy && (
          <div className="text-actions">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-action-button"
              onClick={copyMessage}
            >
              {copiedCode === content ? <Check size={14} /> : <Clipboard size={14} />}
              <span className="sr-only">Sao chép</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;