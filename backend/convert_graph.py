# convert_graph.py

import os
import networkx as nx

BASE_DIR  = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CACHE_DIR = os.path.join(BASE_DIR, "data", "cache")

GRAPHML_PATH = os.path.join(CACHE_DIR, "road_graph.graphml")
PICKLE_PATH  = os.path.join(CACHE_DIR, "road_graph.pkl")

if not os.path.exists(GRAPHML_PATH):
    print(f"GraphML file not found at: {GRAPHML_PATH}")
    exit(1)

print("Loading GraphML...")
G = nx.read_graphml(GRAPHML_PATH)

print("Saving as Pickle...")
nx.write_gpickle(G, PICKLE_PATH)

print("Done!")
print(f"Nodes: {len(G.nodes)}")
print(f"Edges: {len(G.edges)}")