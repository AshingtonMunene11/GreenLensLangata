# GreenLens Lang`ata

**GreenLens** is a full-stack web application that combines environmental awareness, community interaction, and spatial visualization.  
Built using **Next.js (Frontend)**, **Flask (Backend)**, and **Leaflet.js (Mapping)**, the project aims to help users explore and contribute to environmental development initiatives.

---
## Authors - Project Developers 
1. Akumu Omolo
2. Brian Cheruiyot
3. Ashington Munene
   
---


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Models](#api-models)
- [Requirements](#requirements)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview

GreenLens provides an interactive platform for environmental monitoring and awareness.  
Users can explore sustainability projects, engage with community discussions, and visualize data on interactive maps powered by **Leaflet.js**.

---
## Preview
<img width="1365" height="682" alt="image" src="https://github.com/user-attachments/assets/0ddc56c4-e1d7-4527-87ff-924edfd30e9d" />

---

## Features

- Interactive maps with **Leaflet.js**
- User Authentication (Signup/Login)
- Community Forum for Discussions
- Environmental Project Exploration
- Data Visualization Dashboards
- RESTful Flask API Integration
- Responsive design with Tailwind CSS

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | Next.js (React Framework) |
| **Styling** | Tailwind CSS |
| **Icons** | lucide-react |
| **Mapping** | Leaflet.js |
| **Backend** | Flask (Python) |
| **Database** | SQLite / PostgreSQL |
| **API Handling** | Flask-RESTful |
| **Package Management** | npm (frontend) / pip (backend) |

---

## Folder Structure

```bash
GreenLens/
│
├── client/                 # Frontend - Next.js
│   ├── public/             # Static assets (images, logo.svg, icons)
│   ├── src/
│   │   ├── app/            # Pages and routes
│   │   ├── components/     # Reusable components (Navbar, Footer, MapView)
│   │   └── lib/            # Utility modules and configurations
│   ├── package.json
│   └── README.md
│
├── server/                 # Backend - Flask
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── __init__.py         # App initialization
│   ├── run.py              # Flask entry point
│   └── requirements.txt
│
└── README.md
```
## License
&copy; 2025 — Moringa School.

## Support

For support, create an issue in the repository.
