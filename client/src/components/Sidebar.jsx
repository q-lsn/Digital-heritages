import HeritageCard from "./HeritageCard";

const filterItems = [
  { key: "all", label: "Tất cả" },
  { key: "chua_temple", label: "Chùa chiền" },
  { key: "di_tich_lich_su", label: "Di tích lịch sử" },
];

export default function Sidebar({
  searchText,
  setSearchText,
  activeCategory,
  setActiveCategory,
  list,
  selected,
  onSelect,
}) {
  return (
    <aside className="absolute top-4 left-4 bottom-4 z-[1000] w-[360px] max-w-[92vw] rounded-3xl bg-[#FDFBF7]/70 backdrop-blur-xl border border-[#E7D7C5] p-4 shadow-[0_10px_30px_rgba(139,90,43,0.2)] transition-all duration-500 ease-in-out flex flex-col">
      <h1 className="text-lg font-bold text-[#5C4033] mb-3">
        Bản đồ Di sản số hóa
      </h1>

      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Tìm tên, tỉnh, mô tả..."
        className="w-full rounded-full border border-[#E7D7C5] bg-[#F5EBE0] px-4 py-3 text-[#5C4033] placeholder-[#8B5A2B]/70 outline-none focus:ring-2 focus:ring-[#8B5A2B] transition-all duration-500 ease-in-out"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {filterItems.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveCategory(f.key)}
            className={`px-4 py-2 rounded-full text-sm border transition-all duration-500 ease-in-out
            ${
              activeCategory === f.key
                ? "bg-[#8B5A2B] text-[#FDFBF7] border-[#8B5A2B]"
                : "bg-[#FDFBF7] text-[#5C4033] border-[#E7D7C5] hover:bg-[#F5EBE0]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
        {list.map((item) => (
          <HeritageCard
            key={item.id}
            item={item}
            active={selected?.id === item.id}
            onClick={() => onSelect(item)}
          />
        ))}

        {list.length === 0 && (
          <div className="rounded-2xl p-4 bg-[#F5EBE0] text-[#5C4033] text-sm">
            Không có di sản phù hợp bộ lọc hiện tại.
          </div>
        )}
      </div>
    </aside>
  );
}