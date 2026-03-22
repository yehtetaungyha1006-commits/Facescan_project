const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

app.post("/upload", async (req, res) => {
  try {
    const image = req.body.image;
    if (!image) return res.status(400).send("No image provided");

    // แปลง base64 เป็นไฟล์จริง
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const filename = path.join(uploadDir, Date.now() + ".jpg");

    // ใช้ async write เพื่อไม่บล็อก server
    await fs.promises.writeFile(filename, base64Data, "base64");

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    // เตรียม form-data สำหรับ Telegram
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", fs.createReadStream(filename));

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    res.send("Saved locally and sent to Telegram ✅");
  } catch (err) {
    console.error("Upload error:", err.response ? err.response.data : err);
    res.status(500).send("Error uploading/sending image ❌");
  }
});