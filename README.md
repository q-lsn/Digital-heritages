# 🇻🇳 Digital Heritage Map (Bản đồ Di sản Số hóa Việt Nam)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

Một ứng dụng web tương tác giúp số hóa, lưu trữ và quảng bá các di sản văn hóa, lịch sử của Việt Nam. Hệ thống kết hợp bản đồ địa lý, công nghệ trình diễn 3D và Trợ lý ảo AI để mang lại trải nghiệm khám phá sống động và mang tính giáo dục cao.

---

## ✨ Tính năng nổi bật

- **📍 Bản đồ Di sản Tương tác:** Tích hợp Leaflet đính kèm các điểm đánh dấu (marker) cho hơn 30 di tích trên toàn quốc.
- **🏛️ Sa bàn 3D Trực quan:** Xem các di tích dưới góc nhìn 3D xoay 360 độ (tích hợp Sketchfab/WebGL) với giao diện Popup sang trọng, hỗ trợ xem nhiều góc nhìn khác nhau của cùng một cụm di tích.
- **🤖 Sứ giả Di sản (AI Chatbot):** Trợ lý ảo thông minh được cung cấp sức mạnh bởi **Google Gemini 2.0 Flash**. AI được tích hợp kỹ thuật RAG (Retrieval-Augmented Generation) để đọc hiểu dữ liệu di sản và tư vấn như một hướng dẫn viên thực thụ.
- **🎨 Giao diện UI/UX Hiện đại:** Thiết kế đồng bộ với hệ màu "Heritage" (Nâu gỗ, Kem giấy cũ, Cà phê) cùng các hiệu ứng chuyển động (animations) mượt mà bằng Tailwind CSS.
- **⚡ Hiệu suất cao:** Kiến trúc tách biệt hoàn toàn giữa Client (Vite/React) và Server (Node.js/Express), dữ liệu lưu trữ gọn nhẹ qua định dạng CSV.

---

## 📂 Cấu trúc thư mục (Project Structure)

Dự án được chia làm 2 phần chính: `client` (Frontend) và `server` (Backend).

```text
digital-heritage/
│
├── server/                    <-- BACKEND (Node.js & Express)
│   ├── data/
│   │   └── heritages.csv      <-- File cơ sở dữ liệu (chứa tọa độ, mô tả, ID 3D)
│   ├── server.js              <-- File code chính: Đọc CSV, xử lý API và Gemini
│   └── package.json           <-- Quản lý thư viện backend
│
└── client/                    <-- FRONTEND (Vite, React, Tailwind, Leaflet)
    ├── public/
    │   └── models/            <-- Nơi chứa các file tài nguyên tĩnh/3D
    │
    ├── src/
    │   ├── components/        <-- Các Component UI tái sử dụng
    │   │   ├── MapViewer.jsx  <-- Bản đồ tương tác Leaflet
    │   │   ├── Sidebar.jsx    <-- Thanh tìm kiếm & bộ lọc
    │   │   ├── ChatBot.jsx    <-- Giao diện Trợ lý AI Sứ giả Di sản
    │   │   └── ThreeDViewer.jsx<-- Trình chiếu không gian 3D
    │   │
    │   ├── App.jsx            <-- Component gốc lắp ráp toàn bộ giao diện
    │   ├── main.jsx           <-- Điểm neo khởi chạy React
    │   └── index.css          <-- Cấu hình Tailwind CSS v4 & Global CSS
    │
    ├── index.html             <-- HTML Root
    ├── vite.config.js         <-- Cấu hình Vite
    └── package.json           <-- Quản lý thư viện frontend