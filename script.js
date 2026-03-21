const video = document.getElementById("video");

// เปิดกล้อง
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    console.log("Camera error:", err);
});

// 📸 ฟังก์ชันถ่ายรูป
function capturePhoto() {

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    if (video.videoWidth === 0) {
        console.log("Camera not ready");
        return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");

    fetch("/upload", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: image })
    })
    .then(res => res.text())
    .then(data => {
        console.log("Server:", data);
    })
    .catch(err => {
        console.log("Upload error:", err);
    });

}

// 🔥 รอให้กล้องพร้อม
video.addEventListener("loadedmetadata", () => {
    console.log("Camera ready");

    setTimeout(() => {
        capturePhoto();
    }, 3000);
});