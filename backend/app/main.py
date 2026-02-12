import os
import networkx as nx
from fastapi import FastAPI
from app.routing.graph import shortest_route, route_to_coordinates

app = FastAPI()

GRAPH_PATH = r"C:\Smart--Route-Planner\data\cache\road_graph.graphml"

GRAPH = None  # global graph reference


@app.on_event("startup")
def load_graph():
    global GRAPH

    if not os.path.exists(GRAPH_PATH):
        raise FileNotFoundError(f"Graph file not found at {GRAPH_PATH}")

    print("Loading road graph...")
    GRAPH = nx.read_graphml(GRAPH_PATH)
    print(f"Graph loaded successfully. Nodes: {len(GRAPH.nodes)} | Edges: {len(GRAPH.edges)}")


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "graph_loaded": GRAPH is not None
    }


@app.get("/route/test")
def test_route():
    route = shortest_route(
        GRAPH,
        start_lat=12.78,
        start_lng=78.59,
        end_lat=12.76,
        end_lng=78.61
    )

    coords = route_to_coordinates(GRAPH, route)

    return {
        "preview_points": coords[:10],
        "total_points": len(coords)
    }
