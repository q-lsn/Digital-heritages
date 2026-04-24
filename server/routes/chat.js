const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Biến toàn cục lưu trữ bối cảnh di sản (Rút gọn tối đa)
let heritageContext = "";

const loadHeritageDataForAI = () => {
  const CSV_PATH = path.join(__dirname, "../data/new-heritages.csv");
  const results = [];

  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on("data", (row) => {
      // TỐI ƯU TOKEN: Chỉ lấy Tên và Tỉnh. Bỏ qua tọa độ và mô tả dài để tránh lỗi 429
      results.push(`- ${row.name} (${row.province})`);
    })
    .on("end", () => {
      heritageContext = results.join("\n");
      console.log("✅ Đã nạp Context Di sản (Bản siêu nhẹ) cho AI Chatbot.");
    })
    .on("error", (err) => console.error("❌ Lỗi đọc CSV:", err));
};

loadHeritageDataForAI();

// 3. Xử lý logic Chat
router.post("/", async (req, res) => {
  const { prompt, history } = req.body;

  try {
    // Lọc bỏ câu chào của Bot và giữ lại tối đa 4 tin nhắn gần nhất để tiết kiệm Token
    const filteredHistory = (history || [])
      .filter((msg, index) => !(index === 0 && msg.role === "bot"))
      .slice(-4); // Chỉ nhớ 4 câu gần nhất

    const formattedHistory = filteredHistory.map(msg => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    // PROMPT NGẮN GỌN 
    const DYNAMIC_SYSTEM_INSTRUCTION = `Bạn là hướng dẫn viên ảo của Bản đồ Di sản số.
1. Trả lời NGẮN GỌN (tối đa 5 câu). Không lan man.
2. Bạn ĐANG CÓ các di sản sau trong hệ thống:
${heritageContext} về các khía cạnh như kiến trúc, lịch sử, văn hóa, câu chuyện thú vị. Hãy tập trung vào những điểm nổi bật và hấp dẫn nhất của từng di sản để kích thích sự tò mò của người dùng.
3. Chỉ tư vấn về các di sản có trong danh sách trên. Gợi ý người dùng click vào bản đồ để xem 3D.`;

    // SỬ DỤNG MODEL 2.0 FLASH
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      systemInstruction: DYNAMIC_SYSTEM_INSTRUCTION
    });

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    
    res.json({ success: true, text: response.text() });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    
    // XỬ LÝ LỖI MỀM (Dành cho Frontend)
    let botReply = "Xin lỗi, hệ thống đang bảo trì. Bạn vui lòng thử lại sau nhé.";
    
    if (error.message.includes("429") || error.message.includes("Quota")) {
      botReply = "Sứ giả Di sản đang phục vụ quá nhiều người (vượt giới hạn miễn phí). Bạn vui lòng đợi 1 phút rồi hỏi lại nhé!";
    } else if (error.message.includes("503")) {
      botReply = "Đường truyền từ máy chủ AI đang nghẽn. Bạn thử lại sau vài giây nhé.";
    }

    res.json({ success: false, text: botReply });
  }
});

module.exports = router;