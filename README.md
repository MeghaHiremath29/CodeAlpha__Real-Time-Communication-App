# CodeAlpha__Real-Time-Communication-App


# 🌐 Real-Time Video Collaboration Suite

This project is a full-stack web application developed as part of **Task 4**. It provides a unified platform for video conferencing, real-time screen sharing, and a collaborative whiteboard. It is designed to run efficiently within a **Node.js** environment using **WebRTC** and **Socket.io**.

## 🚀 Key Features

* **Real-Time Video:** Instant camera and microphone streaming using the browser's Media Devices API.
* **Screen Sharing:** Built-in capability to present your desktop or specific windows to other participants.
* **Collaborative Whiteboard:** A shared drawing canvas where multiple users can sketch and brainstorm simultaneously.
* **Real-Time Sync:** Powered by WebSockets to ensure near-zero latency for drawing and signaling.

---

## 🛠️ Technical Stack

| Component | Technology |
| --- | --- |
| **Backend** | Node.js & Express.js |
| **Communication** | Socket.io (WebSockets) |
| **Video/Audio** | WebRTC API |
| **Canvas** | HTML5 Canvas API |
| **Frontend** | Vanilla JavaScript & CSS3 |

---

## 💻 Installation & Setup

Follow these steps to run the project in **VS Code**:

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Folder Setup

Create a new folder and open it in VS Code:

```bash
mkdir video-collab-task
cd video-collab-task

```

### 3. Install Dependencies

Run the following command in your VS Code terminal:

```bash
npm init -y
npm install express socket.io

```

### 4. Create the Server File

Create a file named `server.js` and paste the "One Code" solution provided previously.

### 5. Start the Application

Run the server:

```bash
node server.js

```

### 6. Access the App

Open your browser and navigate to:
**`http://localhost:3000`**

---

## 📖 How It Works

### **1. Signaling (Socket.io)**

WebRTC requires a "handshake" to connect two people. The Node.js server acts as a **Signaling Server**, relaying connection details and drawing coordinates between users so they can communicate directly.

### **2. Video Streaming**

The app uses `navigator.mediaDevices.getUserMedia` to access your local hardware. This stream is then injected into the HTML `<video>` elements.

### **3. Whiteboard Sync**

When a user draws on the canvas, the `(x, y)` coordinates are captured and sent to the server via the `drawing` event. The server then broadcasts these coordinates to every other connected client, who renders the line on their own canvas.

---

## ⚠️ Important Notes

* **Camera Permissions:** Your browser will ask for camera/mic access. You must click **Allow** for the video to work.
* **Testing:** To see the collaboration in action, open `http://localhost:3000` in **two different browser tabs** side-by-side.
