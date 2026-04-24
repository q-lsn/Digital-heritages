export default function HeritageCard({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-500 ease-in-out shadow-[0_8px_24px_rgba(139,90,43,0.12)] hover:shadow-[0_10px_28px_rgba(139,90,43,0.2)]
      ${
        active
          ? "bg-[#8B5A2B] text-[#FDFBF7] border-[#8B5A2B]"
          : "bg-[#FDFBF7]/90 text-[#5C4033] border-[#E7D7C5] hover:bg-[#F5EBE0]"
      }`}
    >
      <h3 className="font-semibold text-sm">{item.name}</h3>
      <p className="text-xs mt-1 opacity-80">{item.province}</p>
      <span className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] bg-[#F5EBE0] text-[#5C4033]">
        {item.category === "chua_temple" ? "Chùa chiền" : "Di tích lịch sử"}
      </span>
    </button>
  );
}