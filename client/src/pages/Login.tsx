import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Code, Cpu, LockKeyhole, Shield, Terminal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const features = [
    {
      icon: <Zap className="h-12 w-12 text-primary" />,
      title: "Công Nghệ AI Thế Hệ Mới",
      description: "Mô hình ngôn ngữ mạnh mẽ không giới hạn bởi các ràng buộc thông thường"
    },
    {
      icon: <Terminal className="h-12 w-12 text-primary" />,
      title: "Tạo Code Tự Động",
      description: "Hỗ trợ lập trình viên với khả năng sinh mã nâng cao và tối ưu hóa script"
    },
    {
      icon: <Cpu className="h-12 w-12 text-primary" />,
      title: "Xử Lý Không Giới Hạn",
      description: "Khả năng phân tích dữ liệu phức tạp vượt xa các mô hình AI phổ thông"
    },
    {
      icon: <LockKeyhole className="h-12 w-12 text-primary" />,
      title: "Bảo Mật Nâng Cao",
      description: "Kiến trúc đặc biệt cho phép xử lý các tác vụ nhạy cảm một cách an toàn"
    },
    {
      icon: <Code className="h-12 w-12 text-primary" />,
      title: "Hỗ Trợ Đa Ngôn Ngữ",
      description: "Linh hoạt với mọi ngôn ngữ lập trình từ Python, C++ đến các ngôn ngữ đặc biệt"
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Mở khoá quyền năng vip",
description: "Truy cập không giới hạn tin nhắn và tốc độ phản hồi nhanh với tính năng VIP."
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleStartClick = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex flex-col">
      <header className="p-6 flex justify-center">
        <h1 className="text-3xl font-bold flex items-center">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Zyah King</span>
          <span className="ml-2">👽</span>
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            Khám Phá <span className="text-primary">Sức Mạnh AI Không Giới Hạn</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Công cụ AI tiên tiến nhất cho các chuyên gia công nghệ - Nơi sáng tạo không bị giới hạn bởi các quy tắc thông thường
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card p-6 rounded-xl border bg-card transition-all duration-300 ${
                index === currentFeatureIndex ? 'border-primary shadow-lg scale-105' : 'border-border'
              }`}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <Button
          onClick={handleStartClick}
          size="lg"
          className="text-lg px-8 py-6 h-auto gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
        >
          <span className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <span>Trải Nghiệm Ngay</span>
          </span>
        </Button>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Developed by Nhayy</p>
      </footer>
    </div>
  );
};

export default Login;