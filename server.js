const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

app.post("/upload", async (req, res) => {
  try {
    const image = req.body.image;
    if (!image) return res.status(400).send("No image provided");

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const filename = path.join(uploadDir, Date.now() + ".jpg");

    await fs.promises.writeFile(filename, base64Data, "base64");

    console.log("File exists:", fs.existsSync(filename)); // ตรวจสอบไฟล์

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