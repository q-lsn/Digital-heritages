const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// 1. IMPORT ROUTER CHATBOT
const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 2. SỬ DỤNG ROUTER
app.use("/api/chat", chatRoutes);

const CSV_PATH = path.join(__dirname, "data", "new-heritages.csv");

function readHeritagesFromCSV() {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          id: Number(row.id),
          name: row.name,
          category: row.category,
          province: row.province,
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          image: row.image,
          description: row.description,
          model3d: row.model3d,
        });
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

app.get("/", (req, res) => {
  res.json({
    message: "Digital Heritage API is running",
    endpoint: "/api/heritages",
  });
});

app.get("/api/heritages", async (req, res) => {
  try {
    const data = await readHeritagesFromCSV();
    const q = (req.query.q || "").toLowerCase().trim();
    const category = (req.query.category || "all").toLowerCase().trim();

    const filtered = data.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.province.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      const matchCategory =
        category === "all" || item.category.toLowerCase() === category;

      return matchSearch && matchCategory;
    });

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot read heritage CSV data",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});