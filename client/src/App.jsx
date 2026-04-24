import { useEffect, useMemo, useState } from "react";
import MapViewer from "./components/MapViewer";
import Sidebar from "./components/Sidebar";
import ThreeDViewer from "./components/ThreeDViewer";
import ChatBot from "./components/ChatBot";

export default function App() {
  const [heritages, setHeritages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/heritages")
      .then((res) => res.json())
      .then((res) => setHeritages(res.data || []))
      .catch(() => setHeritages([]));
  }, []);

  const filtered = useMemo(() => {
    const q = searchText.toLowerCase().trim();

    return heritages.filter((item) => {
      const matchText =
        item.name.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;

      return matchText && matchCategory;
    });
  }, [heritages, searchText, activeCategory]);

  useEffect(() => {
    if (selected && !filtered.find((x) => x.id === selected.id)) {
      setSelected(null);
      setShow3D(false);
    }
  }, [filtered, selected]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FDFBF7]">
      <MapViewer heritages={filtered} selected={selected} onSelect={setSelected} />

      <Sidebar
        searchText={searchText}
        setSearchText={setSearchText}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        list={filtered}
        selected={selected}
        onSelect={(item) => {
          setSelected(item);
          setShow3D(false);
        }}
      />

      {/* Thẻ thông tin tóm tắt bên phải */}
      {selected && (
        <section className="absolute right-4 top-4 z-[1100] w-[420px] max-w-[94vw] rounded-3xl border border-[#E7D7C5] bg-[#FDFBF7]/80 backdrop-blur-xl p-4 shadow-[0_10px_30px_rgba(139,90,43,0.2)] transition-all duration-500 ease-in-out">
          <img
            src={selected.image}
            alt={selected.name}
            className="w-full h-44 object-cover rounded-2xl"
          />
          <h2 className="mt-3 text-xl font-bold text-[#5C4033]">{selected.name}</h2>
          <p className="text-sm text-[#8B5A2B] mt-1">{selected.province}</p>
          <p className="text-sm text-[#5C4033] mt-3 leading-6">{selected.description}</p>

          <button
            // Luôn set true để mở Popup lớn thay vì toggle như cũ
            onClick={() => setShow3D(true)} 
            className="mt-4 px-5 py-2.5 rounded-full bg-[#8B5A2B] text-[#FDFBF7] hover:opacity-90 transition-all duration-500 ease-in-out"
          >
            Góc nhìn 3D
          </button>
        </section>
      )}

      {/* POPUP: Giao diện xem 3D toàn màn hình */}
      {show3D && selected && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-8">
          {/* Lớp nền mờ tối để làm nổi bật Popup */}
          <div 
            className="absolute inset-0 bg-[#5C4033]/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShow3D(false)}
          ></div>

          {/* Nội dung Popup */}
          <div className="relative w-full max-w-6xl h-[85vh] bg-[#FDFBF7] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(92,64,51,0.3)] border border-[#E7D7C5] flex flex-col animate-in fade-in zoom-in duration-300">
            
            {/* Thanh tiêu đề - Màu Beige đồng bộ */}
            <div className="flex items-center justify-between px-8 py-5 bg-[#F5EBE0] border-b border-[#E7D7C5]">
              <div>
                <h3 className="text-[#5C4033] font-bold text-xl">{selected.name}</h3>
                <p className="text-[#8B5A2B] text-xs uppercase tracking-[0.2em] font-semibold">{selected.province}</p>
              </div>
              <button 
                onClick={() => setShow3D(false)}
                className="p-2 hover:bg-[#8B5A2B]/10 rounded-full text-[#5C4033] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Vùng hiển thị 3D */}
            <div className="flex-1 relative bg-[#FDFBF7]">
              <ThreeDViewer modelUrl={selected.model3d} />
            </div>
          </div>
        </div>
      )}
    <ChatBot />
    </div>
  );
}