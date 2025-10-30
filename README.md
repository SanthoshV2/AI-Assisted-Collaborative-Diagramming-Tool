# 🧠 AI-Assisted Collaborative Diagramming Tool

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![WebSocket](https://img.shields.io/badge/RealTime-WebSocket-blue)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🧾 Overview

**AI-Assisted Collaborative Diagramming Tool** is a web-based platform designed to let multiple users collaboratively create, edit, and enhance diagrams in real-time.  
It integrates **AI-powered diagram suggestions**, **real-time WebSocket communication**, and **intuitive drawing tools** to streamline brainstorming and visualization.

Users can sign in using **Clerk authentication**, create or join shared rooms, and collaborate visually on a shared canvas — making it ideal for **teams**, **educators**, and **designers**.

---

## 🚀 Features

- 🎨 **Interactive Drawing Tools** – Pencil, shapes, arrows, sticky notes, and text.
- ⚡ **Real-time Collaboration** – Live multi-user editing using WebSockets.
- 🧑‍🤝‍🧑 **Room-based Sessions** – Users can create or join rooms to collaborate.
- 🧠 **AI Assistance** – Generate diagram elements or ideas via AI prompts.
- 🧩 **Persistent Data** – Saved diagrams accessible from your dashboard.
- 🔒 **User Authentication** – Secure sign-in & session handling with Clerk.
- 🧰 **Clean UI** – Built with TailwindCSS for a smooth, responsive interface.

---

## 🏗️ System Architecture

The system follows a **client-server model**:
```
[Frontend: React + Tailwind + Clerk]
⇅ (REST + WebSocket)
[Backend: FastAPI + WebSocket Manager]
⇅
[Database / Persistent Storage]

```

📘 *See the architecture diagram:*  
<img width="1536" height="1024" alt="AD" src="https://github.com/user-attachments/assets/448cc707-37eb-46e1-9cc0-eb8c9b399d09" />

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | React, Vite, TailwindCSS |
| Backend | FastAPI, Python |
| Realtime | WebSockets |
| Authentication | Clerk |
| AI Layer | OpenAI / Placeholder for future AI model |
| Storage | Supabase / PostgreSQL |
| Version Control | Git & GitHub |

---
## 🚀 Installation & Setup

### 1.Clone the Repository
```bash
git clone https://github.com/SanthoshV2/AI-Assisted-Collaborative-Diagramming-Tool.git
```
### 2.⚙️ Backend Setup
```bash
#Move to backend
cd server

#Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # (Windows)
source venv/bin/activate  # (Mac/Linux)

#Install dependencies
pip install -r requirements.txt

#Run the server
uvicorn main:app --reload
```
---

### 3.🧩 Frontend Setup 
```bash
#Move to frontend
cd client

#Install dependencies
npm install

#Start development server
npm run dev
```
---

## 🧠 How It Works

***User Authentication*** – User logs in via Clerk (frontend).

***Room Creation*** – User creates or joins a room with a unique code.

***WebSocket Connection*** – FastAPI manages real-time data flow.

***Collaborative Drawing*** – All user actions (draw, erase, add notes) are synced instantly.

***AI Assistance*** – Users can prompt the AI to generate diagram ideas.

---

### 🔮 Future Enhancements

💾 Save and restore diagrams from the database

✏️ Multi-layer editing and object grouping

🗺️ Zooming, panning, and export options

🧠 Integration with real AI model (e.g., GPT-based diagram generation)

📈 User analytics and room insights

---

### ⭐ Support

If you like this project, don’t forget to star 🌟 the repository on GitHub!





