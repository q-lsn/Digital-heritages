import { useState, useRef, useEffect } from "react";

const QUICK_ACTIONS = [
  { label: "🏮 Chuyện Hội An", prompt: "Kể một chi tiết thú vị ít người biết về kiến trúc Phố cổ Hội An." },
  { label: "🏰 Cung An Định", prompt: "Kiến trúc Cung An Định có gì đặc biệt so với các cung điện khác ở Huế?" },
  { label: "🗿 Gạch ở Thánh địa Mỹ Sơn", prompt: "Tại sao gạch ở tháp Chăm Mỹ Sơn lại xếp khít nhau mà không cần mạch vữa?" },
  { label: "👑 Đền Vua Hùng", prompt: "Biểu tượng hình tròn và hình vuông ở Đền Vua Hùng Cần Thơ có ý nghĩa gì?" }
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào! Tôi là Trợ lý Di sản. Bạn muốn tìm hiểu câu chuyện về công trình nào hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const finalPrompt = textToSend || input;
    if (!finalPrompt.trim()) return;

    // Cập nhật UI với câu hỏi của User
    const userMsg = { role: "user", text: finalPrompt };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Gọi API xuống Backend Express
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          // Gửi toàn bộ lịch sử (trừ câu vừa chat) để AI có ngữ cảnh
          history: messages 
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...newMessages, { role: "bot", text: data.text }]);
      } else {
        setMessages([...newMessages, { role: "bot", text: "Xin lỗi, đường truyền tín hiệu di sản đang bị gián đoạn. Vui lòng thử lại sau." }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "bot", text: "Hệ thống đang bảo trì, vui lòng kết nối lại sau nhé!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[3000] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[340px] h-[480px] bg-[#FDFBF7] rounded-[2rem] shadow-[0_10px_40px_rgba(92,64,51,0.2)] border border-[#E7D7C5] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#8B5A2B] text-[#FDFBF7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#FDFBF7] rounded-full animate-pulse opacity-90"></div>
              <span className="font-bold text-[13px] tracking-widest uppercase">Sứ giả Di sản</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 hover:rotate-90 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-[#8B5A2B] text-white rounded-tr-sm" 
                    : "bg-white text-[#5C4033] rounded-tl-sm border border-[#E7D7C5]"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-[#E7D7C5] text-[#8B5A2B] text-[13px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#8B5A2B] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#8B5A2B] rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-[#8B5A2B] rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick Actions & Input */}
          <div className="p-3 bg-white border-t border-[#E7D7C5] flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.prompt)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-3 py-1.5 bg-[#FDFBF7] text-[#8B5A2B] text-[11px] font-bold rounded-full border border-[#E7D7C5] hover:bg-[#8B5A2B] hover:text-white transition-colors disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Hỏi tôi về các di tích..."
                disabled={isTyping}
                className="flex-1 bg-[#FDFBF7] border border-[#E7D7C5] rounded-full px-4 py-2 text-[13px] text-[#5C4033] placeholder:text-[#5C4033]/40 focus:outline-none focus:border-[#8B5A2B] disabled:opacity-50"
              />
              <button 
                onClick={() => handleSend()} 
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 flex items-center justify-center bg-[#8B5A2B] text-white rounded-full hover:bg-[#5C4033] transition-colors disabled:opacity-50 disabled:hover:bg-[#8B5A2B]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#8B5A2B] text-[#FDFBF7] rounded-full shadow-[0_4px_20px_rgba(139,90,43,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#FDFBF7]"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}