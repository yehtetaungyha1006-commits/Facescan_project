const FormData = require("form-data");

app.post("/upload", async (req, res) => {
  try {
    const image = req.body.image;
    if (!image) return res.status(400).send("No image provided");

    // Remove base64 prefix and save locally
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const filename = path.join(uploadDir, Date.now() + ".jpg");
    fs.writeFileSync(filename, base64Data, "base64");

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    // Prepare form-data for Telegram
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", fs.createReadStream(filename));

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
      headers: form.getHeaders(),
    });

    res.send("saved and sent to Telegram");
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).send("error");
  }
});