import { Helmet } from "react-helmet";
import ChatInterface from "@/components/ChatInterface";

const FreeChat = () => {
  return (
    <>
      <Helmet>
        <title>Zyah King AI - Free Chat</title>
        <meta name="description" content="Chat with Zyah King AI - Free version with limited features" />
        <meta property="og:title" content="Zyah King AI - Free Chat" />
        <meta property="og:description" content="Free AI assistant with 30 message limit" />
        <meta property="og:type" content="website" />
      </Helmet>
      <ChatInterface forceFreeMode={true} />
    </>
  );
};

export default FreeChat;