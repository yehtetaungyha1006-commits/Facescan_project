const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({limit:"50mb"}));

// เปิดไฟล์ static
app.use(express.static(__dirname));

// route หน้าเว็บ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload",(req,res)=>{

const image = req.body.image;

const base64Data = image.replace(/^data:image\/\w+;base64,/,"");

const filename = "uploads/" + Date.now() + ".jpg";

fs.writeFileSync(filename, base64Data, "base64");

console.log("Saved:",filename);

res.send("saved");

});

app.listen(3000,()=>{
console.log("Server running on port 3000");
});