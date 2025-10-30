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
[Frontend: React + Tailwind + Clerk]
⇅ (REST + WebSocket)
[Backend: FastAPI + WebSocket Manager]
⇅
[Database / Persistent Storage]

📘 *See the architecture diagram:*  
`/docs/architecture_diagram.png`

