import os
import osmnx as ox
import networkx as nx

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..")
)

CACHE_DIR = os.path.join(BASE_DIR, "data", "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

ox.settings.use_cache = True
ox.settings.cache_folder = CACHE_DIR
ox.settings.requests_cache = True
ox.settings.requests_cache_folder = CACHE_DIR

GRAPH_FILE = os.path.join(CACHE_DIR, "road_graph.graphml")


def load_road_graph(place_name: str):
    if os.path.exists(GRAPH_FILE):
        print("Loading cached road graph...")
        return ox.load_graphml(GRAPH_FILE)

    print(f"Downloading road graph for {place_name}...")
    graph = ox.graph_from_place(
        place_name,
        network_type="drive",
        simplify=True
    )

    ox.save_graphml(graph, GRAPH_FILE)
    return graph


def get_nearest_node(G, lat, lng):
    return ox.distance.nearest_nodes(G, X=lng, Y=lat)


def shortest_route(G, start_lat, start_lng, end_lat, end_lng):
    start_node = get_nearest_node(G, start_lat, start_lng)
    end_node = get_nearest_node(G, end_lat, end_lng)

    route = nx.shortest_path(
        G,
        start_node,
        end_node,
        weight="length"
    )

    return route

def route_to_coordinates(G, route):
    coords = []
    for node in route:
        data = G.nodes[node]
        coords.append({
            "lat": data["y"],
            "lng": data["x"]
        })
    return coords

