// Thay bằng API Key thật của bạn
const API_KEY = "ĐIỀN_API_KEY_CỦA_BẠN_VÀO_ĐÂY";

async function checkAvailableModels() {
  console.log("Đang tải danh sách model từ Google...\n");
  
  try {
    // Gọi thẳng vào REST API của Google
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${"AIzaSyD59ywlvj32txFx8Oq4UVBG44J45GRW8bw"}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("Lỗi xác thực:", data.error.message);
      return;
    }

    // Lọc và in ra các model hỗ trợ tạo văn bản (generateContent)
    const textModels = data.models.filter(model => 
      model.supportedGenerationMethods.includes("generateContent")
    );

    console.log(`🎉 TÌM THẤY ${textModels.length} MODEL HỖ TRỢ CHAT:\n`);
    
    textModels.forEach(model => {
      // Cắt bỏ chữ "models/" ở đầu để lấy tên gọi chính xác
      const modelName = model.name.replace("models/", "");
      console.log(`🟢 Tên Model Code: ${modelName}`);
      console.log(`   - Tên hiển thị: ${model.displayName}`);
      console.log(`   - Mô tả: ${model.description.substring(0, 80)}...`);
      console.log("--------------------------------------------------");
    });

  } catch (error) {
    console.error("Lỗi kết nối:", error.message);
  }
}

checkAvailableModels();