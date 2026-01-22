from fastapi import FastAPI
from app.routing.graph import load_road_graph, shortest_route
from app.routing.graph import route_to_coordinates

app = FastAPI(title="Smart Route Planner")

GRAPH = None

@app.on_event("startup")
def load_graph_on_startup():
    global GRAPH
    print("Loading road graph at startup...")
    GRAPH = load_road_graph("Yelagiri Hills, Tamil Nadu, India")
    print("Graph loaded and ready.")

@app.get("/")
def health_check():
    return {"status": "ok", "graph_loaded": GRAPH is not None}

@app.get("/route/test")
def test_route():
    route = shortest_route(
        GRAPH,
        start_lat=12.9716,
        start_lng=79.1588,
        end_lat=12.6237,
        end_lng=80.1945
    )
    return {
        "route_nodes": len(route)
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
        "points": coords[:10],  # preview
        "total_points": len(coords)
    }
