const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- SERVER LOGIC ---
app.get('/', (req, res) => {
    res.send(htmlTemplate); // Serving the frontend directly
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Broadcast drawing data to all other users
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    // Handle Signaling for Video (Simple Relay)
    socket.on('signal', (data) => {
        socket.broadcast.emit('signal', data);
    });
});

server.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
});

// --- FRONTEND HTML/JS/CSS ---
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <title>Task 4: Collaboration Suite</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; background: #f0f2f5; }
        #video-container { display: flex; gap: 10px; margin-bottom: 20px; }
        video { width: 300px; background: #000; border-radius: 8px; border: 2px solid #333; }
        #canvas-container { position: relative; border: 2px solid #000; background: #fff; cursor: crosshair; }
        canvas { display: block; }
        .controls { margin: 10px; }
        button { padding: 10px 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h2>Video Conference & Whiteboard</h2>
    
    <div id="video-container">
        <video id="localVideo" autoplay playsinline muted></video>
        <video id="remoteVideo" autoplay playsinline></video>
    </div>

    <div class="controls">
        <button onclick="startScreenShare()">Share Screen</button>
        <button onclick="clearCanvas()" style="background:#dc3545">Clear Board</button>
    </div>

    <div id="canvas-container">
        <canvas id="whiteboard" width="800" height="400"></canvas>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        const canvas = document.getElementById('whiteboard');
        const ctx = canvas.getContext('2d');
        const localVideo = document.getElementById('localVideo');
        let drawing = false;

        // --- 1. VIDEO LOGIC ---
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                localVideo.srcObject = stream;
            }).catch(err => console.error("Camera error:", err));

        // --- 2. SCREEN SHARE LOGIC ---
        async function startScreenShare() {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                localVideo.srcObject = screenStream;
            } catch (err) {
                console.error("Screen share error:", err);
            }
        }

        // --- 3. WHITEBOARD LOGIC ---
        canvas.addEventListener('mousedown', () => drawing = true);
        canvas.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
        canvas.addEventListener('mousemove', draw);

        function draw(e) {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const data = { x, y, color: '#000' };
            drawOnCanvas(data);
            socket.emit('drawing', data);
        }

        function drawOnCanvas(data) {
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = data.color;
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
        }

        socket.on('drawing', (data) => drawOnCanvas(data));

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    </script>
</body>
</html>
`;