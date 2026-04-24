import { useState, useEffect } from "react";

export default function ThreeDViewer({ modelUrl }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Trạng thái theo dõi xem iframe nào đã tải xong
  const [loadedFrames, setLoadedFrames] = useState({});
  // Trạng thái kích hoạt tải ngầm các góc nhìn khác
  const [startPreload, setStartPreload] = useState(false);

  const modelIds = modelUrl 
    ? modelUrl.split(",").map(id => id.trim()).filter(id => id !== "") 
    : [];

  const getSketchfabId = (input) => {
    if (!input) return "";
    const parts = input.split("/");
    const lastPart = parts[parts.length - 1];
    const idParts = lastPart.split("-");
    return idParts[idParts.length - 1];
  };

  useEffect(() => {
    // 1. Reset mọi thứ khi người dùng chọn một Di sản mới
    setActiveIndex(0);
    setLoadedFrames({});
    setStartPreload(false);

    // 2. Kích hoạt tải ngầm (Preload) sau 2.5 giây 
    // Giúp tập trung toàn bộ cấu hình máy để tải góc nhìn 1 mượt nhất
    const timer = setTimeout(() => {
      setStartPreload(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [modelUrl]);

  if (modelIds.length === 0) return null;

  // Kiểm tra xem góc nhìn HIỆN TẠI đã tải xong chưa
  const isCurrentLoading = !loadedFrames[activeIndex];

  return (
    <div className="relative w-full h-full bg-[#FDFBF7]">
      
      {/* Thanh điều hướng */}
      {modelIds.length > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-2 px-3 py-2 bg-[#FDFBF7]/80 backdrop-blur-xl rounded-2xl border border-[#E7D7C5] shadow-xl max-w-[90%]">
          <span className="w-full text-[9px] text-center font-bold text-[#8B5A2B]/60 uppercase tracking-tighter mb-1">
            Góc nhìn di sản
          </span>
          {modelIds.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-black transition-all duration-300 ${
                activeIndex === index 
                ? "bg-[#8B5A2B] text-[#FDFBF7] shadow-[0_4px_12px_rgba(139,90,43,0.3)] scale-110" 
                : "text-[#5C4033] bg-white border border-[#E7D7C5] hover:border-[#8B5A2B] hover:text-[#8B5A2B]"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Trạng thái Loading - Chỉ hiện nếu iframe hiện tại chưa load xong */}
      {isCurrentLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDFBF7] z-20">
          <div className="w-12 h-12 border-[3px] border-[#F5EBE0] border-t-[#8B5A2B] rounded-full animate-spin mb-4"></div>
          <p className="text-[#8B5A2B] text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">
            Đang trích xuất dữ liệu 3D...
          </p>
        </div>
      )}

      {/* RENDER TẤT CẢ CÁC IFRAME CÙNG LÚC (Xếp chồng lên nhau) */}
      {modelIds.map((rawId, index) => {
        const sketchfabId = getSketchfabId(rawId);
        
        // Chỉ Render iframe nếu nó là góc nhìn chính, góc nhìn đang được click, HOẶC chế độ preload đã bật
        const shouldRender = index === 0 || index === activeIndex || startPreload;

        if (!shouldRender) return null;

        return (
          <iframe
            key={sketchfabId}
            title={`Sketchfab Viewer ${index + 1}`}
            // Quan trọng: CSS giúp làm tàng hình các iframe không được chọn
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              activeIndex === index 
                ? "opacity-100 z-10 pointer-events-auto" // Hiện và cho phép tương tác
                : "opacity-0 z-0 pointer-events-none"    // Tàng hình và tắt tương tác (Nhưng vẫn ở trong RAM)
            }`}
            src={`https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&internal=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_stop=0`}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            // Khi tải xong, đánh dấu iframe này là true
            onLoad={() => setLoadedFrames(prev => ({ ...prev, [index]: true }))}
          ></iframe>
        );
      })}

      <div className="absolute bottom-6 left-6 pointer-events-none opacity-50 z-30">
        <p className="text-[9px] font-black text-[#5C4033] uppercase tracking-[0.4em] vertical-text">
          Heritage Archive
        </p>
      </div>
    </div>
  );
}