import { Helmet } from "react-helmet";
import ChatInterface from "@/components/ChatInterface";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import VipConfirmModal from "@/components/VipConfirmModal";

const VipChat = () => {
  const [hasVipAccess, setHasVipAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vipModalOpen, setVipModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user has VIP access
    const apiKey = localStorage.getItem("zyah-api-key");
    
    if (apiKey === "Zyahking2405") {
      setHasVipAccess(true);
    } else {
      // Open the VIP confirmation modal if no valid key
      setVipModalOpen(true);
    }
    
    setLoading(false);
  }, []);

  // If the user closes the modal without entering a key, redirect to selection page
  const handleModalClose = () => {
    setVipModalOpen(false);
    setLocation('/');
  };

  return (
    <>
      <Helmet>
        <title>Zyah King AI - VIP Chat</title>
        <meta name="description" content="Chat with Zyah King AI - VIP version with advanced features" />
        <meta property="og:title" content="Zyah King AI - VIP Chat" />
        <meta property="og:description" content="Premium AI assistant with advanced capabilities" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Only show VIP interface if user has access */}
      {hasVipAccess && <ChatInterface forceVIPMode={true} />}
      
      {/* VIP confirmation modal */}
      <VipConfirmModal
        isOpen={vipModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
};

export default VipChat;