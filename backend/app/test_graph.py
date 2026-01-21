from app.routing.graph import load_road_graph

if __name__ == "__main__":
    G = load_road_graph("Tamil Nadu, India")
    print("Nodes:", len(G.nodes))
    print("Edges:", len(G.edges))
