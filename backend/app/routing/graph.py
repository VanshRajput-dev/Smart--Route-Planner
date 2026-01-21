import os
import osmnx as ox
 

ox.settings.use_cache = True
ox.settings.cache_folder = "data/cache"
DATA_DIR = "data/cache"
GRAPH_FILE = os.path.join(DATA_DIR, "road_graph.graphml")

def load_road_graph(place_name: str):
    os.makedirs(DATA_DIR, exist_ok=True)

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
