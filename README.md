digital-heritage/               <-- Thư mục gốc chứa toàn bộ dự án
│
├── server/                     <-- BACKEND (Node.js & Express)
│   ├── data/
│   │   └── heritages.csv       <-- File cơ sở dữ liệu (chứa 30 địa danh)
│   ├── server.js               <-- File code chính: Đọc CSV, tạo API gửi cho Frontend
│   └── package.json            <-- Quản lý các thư viện backend (express, cors, csv-parser)
│
└── client/                     <-- FRONTEND (Vite, React, Tailwind, Leaflet, 3D)
    ├── public/
    │   └── models/             <-- Nơi chứa các file 3D (.glb, .gltf) của di sản
    │
    ├── src/
    │   ├── components/         <-- Thư mục chứa các mảnh ghép giao diện (UI)
    │   │   ├── MapViewer.jsx   <-- Code hiển thị bản đồ Leaflet & giới hạn khu vực
    │   │   ├── Sidebar.jsx     <-- Code thanh tìm kiếm, bộ lọc và danh sách di sản bên trái
    │   │   ├── HeritageCard.jsx<-- Code thiết kế từng thẻ di sản nhỏ trong danh sách
    │   │   └── ThreeDViewer.jsx<-- Code hiển thị mô hình 3D xoay 360 độ
    │   │
    │   ├── App.jsx             <-- File kết nối MapViewer, Sidebar... lại thành 1 màn hình hoàn chỉnh
    │   ├── main.jsx            <-- File gốc khởi chạy React
    │   └── index.css           <-- Nơi import Tailwind CSS v4 và Leaflet CSS
    │
    ├── index.html              <-- File HTML duy nhất của toàn bộ trang web
    ├── vite.config.js          <-- Cấu hình Vite & plugin Tailwind CSS
    └── package.json            <-- Quản lý thư viện frontend (react, leaflet, three...)