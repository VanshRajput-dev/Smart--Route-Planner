import networkx as nx

GRAPHML_PATH = r"C:\Smart--Route-Planner\data\cache\road_graph.graphml"
PICKLE_PATH = r"C:\Smart--Route-Planner\data\cache\road_graph.pkl"

print("Loading GraphML...")
G = nx.read_graphml(GRAPHML_PATH)

print("Saving as Pickle...")
nx.write_gpickle(G, PICKLE_PATH)

print("Done!")
print(f"Nodes: {len(G.nodes)}")
print(f"Edges: {len(G.edges)}")
