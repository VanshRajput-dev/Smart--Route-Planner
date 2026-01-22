from app.routing.graph import load_road_graph
import networkx as nx

if __name__ == "__main__":
    G = load_road_graph("Nilavoor, Tamil Nadu, India")
    print("Nodes:", len(G.nodes))
    print("Edges:", len(G.edges))
    

largest_cc = max(nx.connected_components(G.to_undirected()), key=len)
print("Largest connected component size:", len(largest_cc))
print("Connectivity ratio:", len(largest_cc) / len(G.nodes))
