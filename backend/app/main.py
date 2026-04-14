import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.routing.graph import load_road_graph, shortest_route, route_to_coordinates
from app.api.routes import router
import threading
from tqdm import tqdm

PLACE_NAME = "Yelagiri Hills, Tamil Nadu, India"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

GRAPH = None
LOADING_STATUS = {"status": "idle", "message": "Not started", "progress": 0}


@app.on_event("startup")
def load_graph():
    global GRAPH, LOADING_STATUS

    def _load():
        global GRAPH, LOADING_STATUS
        try:
            steps = [
                "Connecting to OpenStreetMap...",
                "Downloading road graph (or loading cache)...",
                "Building node index...",
                "Finalizing graph...",
            ]

            with tqdm(total=100,
                      bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}]",
                      colour="green",
                      desc="Loading graph") as pbar:

                LOADING_STATUS = {"status": "loading", "message": steps[0], "progress": 10}
                pbar.set_description(steps[0])
                pbar.update(10)

                LOADING_STATUS = {"status": "loading", "message": steps[1], "progress": 30}
                pbar.set_description(steps[1])
                pbar.update(20)

                GRAPH = load_road_graph(PLACE_NAME)

                LOADING_STATUS = {"status": "loading", "message": steps[2], "progress": 70}
                pbar.set_description(steps[2])
                pbar.update(40)

                node_count = len(GRAPH.nodes)
                edge_count = len(GRAPH.edges)

                LOADING_STATUS = {"status": "loading", "message": steps[3], "progress": 90}
                pbar.set_description(steps[3])
                pbar.update(20)

                LOADING_STATUS = {
                    "status": "ready",
                    "message": f"Graph loaded — {node_count} nodes, {edge_count} edges",
                    "progress": 100
                }
                pbar.set_description(f"Done — {node_count} nodes, {edge_count} edges")
                pbar.update(10)

        except Exception as e:
            LOADING_STATUS = {"status": "error", "message": str(e), "progress": 0}
            print(f"Failed to load graph: {e}")

    thread = threading.Thread(target=_load)
    thread.daemon = True
    thread.start()


@app.get("/")
def health_check():
    return {"status": "ok", "graph": LOADING_STATUS}


@app.get("/status")
def get_status():
    return LOADING_STATUS


@app.get("/route/test")
def test_route():
    if GRAPH is None:
        return {"error": "Graph still loading", "status": LOADING_STATUS}
    route  = shortest_route(GRAPH, 12.78, 78.59, 12.76, 78.61)
    coords = route_to_coordinates(GRAPH, route)
    return {"preview_points": coords[:10], "total_points": len(coords)}
