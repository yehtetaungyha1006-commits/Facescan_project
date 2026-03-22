require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use("/uploads", express.static(uploadDir));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", async (req, res) => {
  try {
    const image = req.body.image;
    if (!image) return res.status(400).send("No image provided");

    // แปลง base64 เป็นไฟล์
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const filename = path.join(uploadDir, Date.now() + ".jpg");
    await fs.promises.writeFile(filename, base64Data, "base64");

    console.log("File exists:", fs.existsSync(filename));

    // ส่งรูปไป Telegram
    const form = new FormData();
    form.append("chat_id", process.env.CHAT_ID);
    form.append("photo", fs.createReadStream(filename));

    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log("Telegram response:", response.data);
    res.send("Saved and sent to Telegram ✅");
  } catch (err) {
    console.error("Upload error:", err.response ? err.response.data : err);
    res.status(500).send("Error uploading/sending image ❌");
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));