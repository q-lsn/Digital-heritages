import { useState, useRef, useEffect } from "react";

export default function HeritageCard({ item, active, onClick }) {
  console.log("Dữ liệu di sản:", item);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Tự động dừng nhạc nếu người dùng chọn sang di sản khác
  useEffect(() => {
    if (!active && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [active, isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation(); // CỰC KỲ QUAN TRỌNG: Ngăn chặn click lan ra ngoài Card
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Dừng tất cả các audio khác đang phát trên trang (nếu có)
      document.querySelectorAll('audio').forEach(el => el.pause());
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    // Đã đổi thẻ <button> thành <div> và thêm cursor-pointer để hợp lệ HTML
    <div
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-500 ease-in-out cursor-pointer shadow-[0_8px_24px_rgba(139,90,43,0.12)] hover:shadow-[0_10px_28px_rgba(139,90,43,0.2)]
      ${
        active
          ? "bg-[#8B5A2B] text-[#FDFBF7] border-[#8B5A2B]"
          : "bg-[#FDFBF7]/90 text-[#5C4033] border-[#E7D7C5] hover:bg-[#F5EBE0]"
      }`}
    >
      <h3 className="font-semibold text-sm">{item.name}</h3>
      <p className="text-xs mt-1 opacity-80">{item.province}</p>
      
      <div className="flex items-center justify-between mt-3">
        <span className="inline-block px-3 py-1 rounded-full text-[11px] bg-[#F5EBE0] text-[#5C4033]">
          {item.category === "chua_temple" ? "Chùa chiền" : "Di tích lịch sử"}
        </span>

        {/* Nút Play/Pause - Chỉ hiện ra nếu di sản này có file audio */}
        {item.audio_file && (
          <button
            onClick={togglePlay}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 shadow-sm ${
              active 
                ? "bg-[#FDFBF7] text-[#8B5A2B] hover:bg-[#E7D7C5]" 
                : "bg-[#8B5A2B] text-white hover:bg-[#5C4033]"
            } hover:scale-110 active:scale-95`}
            title={isPlaying ? "Tạm dừng thuyết minh" : "Nghe thuyết minh"}
          >
            {/* Sử dụng Icon Unicode đơn giản, bạn có thể thay bằng SVG nếu muốn */}
            <span className="text-[14px] ml-[2px]">{isPlaying ? "⏸" : "▶"}</span>
          </button>
        )}
      </div>

      {/* Thẻ audio ẩn */}
      {item.audio_file && (
        <audio
          ref={audioRef}
          src={`/audio/${item.audio_file}`}
          onEnded={() => setIsPlaying(false)} // Khi đọc xong tự đổi icon về nút Play
        />
      )}
    </div>
  );
}