 🏍️ Smart Route Planner (Backend)

A backend system for a motorcycle-focused smart route planning application that prioritizes ride quality, safety, and rider experience over simple shortest-distance navigation.

This project uses OpenStreetMap data and graph-based routing to build a foundation for advanced features like:

Bike-aware routing

Scenic and safe route selection

Fuel, hospital, and rest-stop discovery

Multi-stop route planning

📌 Project Status (Current Progress)

✅ Backend environment setup
✅ OpenStreetMap road graph download & caching
✅ Graph validation (nodes, edges, connectivity)
✅ GPS → road snapping
✅ Shortest-path routing (distance-based)
🚧 Bike-aware scoring (next)
🚧 POI attachment (next)
🚧 API layer (next)

🧠 Core Idea

Traditional navigation apps optimize for cars and shortest time.

This project is designed for motorbike riders, where:

Road type matters

Ride quality matters

Safety stops matter

Scenic detours matter

The backend is built to support custom scoring and intelligence, not just distance.

🧱 Project Structure
Smart--Route-Planner/
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point (future)
│   │   ├── test_graph.py        # Routing + graph tests
│   │   │
│   │   ├── routing/
│   │   │   ├── graph.py         # Graph loading, caching, routing
│   │   │   ├── score.py         # Bike-aware scoring (future)
│   │   │   └── multi_stop.py    # Multi-stop routing (future)
│   │   │
│   │   ├── bikes/
│   │   │   └── bikes.json       # Bike model database
│   │   │
│   │   ├── poi/
│   │   │   ├── fetch.py         # POI fetching (future)
│   │   │   └── attach.py        # Attach POIs to route (future)
│   │   │
│   │   └── utils/
│   │
│   ├── data/
│   │   └── cache/               # Cached map & API data (ignored by git)
│   │
│   ├── route_env/               # Python virtual environment
│   ├── requirements.txt
│   └── README.md
│
└── frontend/                    # (planned)

⚙️ Tech Stack

Python 3.11+

OSMnx – OpenStreetMap data & graph creation

NetworkX – Graph algorithms (routing)

FastAPI – API framework (planned)

Uvicorn – ASGI server

OpenStreetMap – Map data source

🚀 Setup Instructions (Windows – CMD)
1️⃣ Clone the repository
git clone <repo-url>
cd Smart--Route-Planner

2️⃣ Go to backend
cd backend

3️⃣ Create virtual environment
python -m venv route_env

4️⃣ Activate virtual environment (CMD)
route_env\Scripts\activate


You should see:

(route_env)

5️⃣ Install dependencies
pip install -r requirements.txt

🗺️ Map Data Setup
⚠️ IMPORTANT

Downloading large regions (like an entire state) takes time and memory.

For development, use a small region.

Example: Load a development region

Edit app/test_graph.py:

G = load_road_graph("Yelagiri Hills, Tamil Nadu, India")

Run graph loader & routing test
python -m app.test_graph


First run:

Downloads OSM data

Builds graph

Saves road_graph.graphml

Subsequent runs:

Loading cached road graph...


This is expected and desired.

🧠 How Routing Works (Current)

Load cached OpenStreetMap road graph

Snap GPS coordinates to nearest road nodes

Compute shortest path using edge length

Return list of route nodes

⚠️ Current routing is distance-based only
Bike-aware scoring is planned next.

📦 Caching Strategy

Two types of cache are used:

Graph cache (road_graph.graphml)

HTTP request cache (multiple .json files)

All cache is stored in:

backend/data/cache/


Cache is:

Ignored by Git

Regenerable

Required for performance

🧪 How to Run Any File Correctly
Rule:

Always run from backend/ using python -m

Examples:

python -m app.test_graph
python -m app.main


❌ Do NOT run files directly with python file.py

🛑 Performance Note (Important)

Routing on very large graphs (entire states) is slow with NetworkX.

Development strategy:

Small region for development

Large region only for final demo or production optimization

This is a design decision, not a bug.

📜 License

This project is licensed under the MIT License.

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

🔮 Next Planned Features

Bike-aware edge scoring (fun vs safety)

Fuel, hospital, and rest-stop discovery

Multi-stop route planning

FastAPI /route endpoint

Mobile app integration

🧠 Final Note

This backend is designed as a foundation, not a shortcut.

The hard problems (data, routing, caching) are already solved.