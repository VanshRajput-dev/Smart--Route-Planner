import os
import osmnx as ox
import networkx as nx
import pickle
import osmium

BASE_DIR  = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE_DIR = os.path.join(BASE_DIR, "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

ox.settings.use_cache = True
ox.settings.cache_folder = CACHE_DIR

PBF_FILE = os.path.join(CACHE_DIR, "southern-zone-260411.osm.pbf")

WEST, SOUTH, EAST, NORTH = 78.598, 12.758, 78.612, 12.772

def _cache_paths(place_name: str):
    safe = place_name.lower().replace(" ", "_").replace(",", "")
    return (
        os.path.join(CACHE_DIR, f"{safe}.graphml"),
        os.path.join(CACHE_DIR, f"{safe}.pkl")
    )

class RoadHandler(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.nodes = {}
        self.ways = []
        self.needed_nodes = set()

    def way(self, w):
        if "highway" not in w.tags:
            return
        node_ids = [n.ref for n in w.nodes]
        if not node_ids:
            return
        self.ways.append({
            "id": w.id,
            "nodes": node_ids,
            "highway": w.tags.get("highway"),
            "name": w.tags.get("name", ""),
            "oneway": w.tags.get("oneway", "no"),
        })
        for nid in node_ids:
            self.needed_nodes.add(nid)

    def node(self, n):
        if n.location.valid():
            lat, lon = n.location.lat, n.location.lon
            if SOUTH <= lat <= NORTH and WEST <= lon <= EAST:
                self.nodes[n.id] = (lat, lon)


def build_graph_from_pbf():
    print("Pass 1 — reading ways...")
    handler = RoadHandler()
    handler.apply_file(PBF_FILE)

    print(f"Found {len(handler.ways)} road ways")
    print("Pass 2 — reading node locations...")

    class NodeLocator(osmium.SimpleHandler):
        def __init__(self, needed):
            super().__init__()
            self.needed = needed
            self.nodes = {}

        def node(self, n):
            if n.id in self.needed and n.location.valid():
                self.nodes[n.id] = (n.location.lat, n.location.lon)

    locator = NodeLocator(handler.needed_nodes)
    locator.apply_file(PBF_FILE, locations=True, idx="flex_mem")

    bbox_nodes = {
        nid: coords for nid, coords in locator.nodes.items()
        if SOUTH <= coords[0] <= NORTH and WEST <= coords[1] <= EAST
    }

    print(f"Found {len(bbox_nodes)} nodes in Yelagiri bbox")

    G = nx.DiGraph()
    for node_id, (lat, lon) in locator.nodes.items():
        G.add_node(node_id, y=lat, x=lon)

    for way in handler.ways:
        nodes = [n for n in way["nodes"] if n in locator.nodes]
        if len(nodes) < 2:
            continue
        first_in_bbox = any(n in bbox_nodes for n in nodes)
        if not first_in_bbox:
            continue
        for i in range(len(nodes) - 1):
            u, v = nodes[i], nodes[i+1]
            lat1, lon1 = locator.nodes[u]
            lat2, lon2 = locator.nodes[v]
            length = ((lat2-lat1)**2 + (lon2-lon1)**2) ** 0.5 * 111000
            G.add_edge(u, v, length=length, highway=way["highway"], name=way["name"])
            if way["oneway"] != "yes":
                G.add_edge(v, u, length=length, highway=way["highway"], name=way["name"])

    print(f"Graph: {len(G.nodes)} nodes, {len(G.edges)} edges")
    return G


def load_road_graph(place_name: str):
    GRAPH_FILE, PICKLE_FILE = _cache_paths(place_name)
    
    # Fixed pickle path so it always finds the cache
    FIXED_PICKLE = os.path.join(CACHE_DIR, "yelagiri_graph.pkl")

    if os.path.exists(FIXED_PICKLE):
        print("Loading from pickle cache (fast)...")
        with open(FIXED_PICKLE, "rb") as f:
            return pickle.load(f)

    print("Building graph from PBF...")
    graph = build_graph_from_pbf()

    with open(FIXED_PICKLE, "wb") as f:
        pickle.dump(graph, f)
    print("Done — saved to pickle.")
    return graph


def get_nearest_node(G, lat, lng):
    best = min(G.nodes, key=lambda n: (G.nodes[n]["y"]-lat)**2 + (G.nodes[n]["x"]-lng)**2)
    return best


def shortest_route(G, start_lat, start_lng, end_lat, end_lng):
    start_node = get_nearest_node(G, start_lat, start_lng)
    end_node   = get_nearest_node(G, end_lat, end_lng)
    try:
        route = nx.shortest_path(G, start_node, end_node, weight="length")
        return route
    except nx.NetworkXNoPath:
        raise ValueError("No path found between given coordinates")
    except nx.NodeNotFound as e:
        raise ValueError(f"Node not found in graph: {e}")


def route_to_coordinates(G, route):
    return [{"lat": G.nodes[n]["y"], "lng": G.nodes[n]["x"]} for n in route]
