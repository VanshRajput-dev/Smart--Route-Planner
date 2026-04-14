# routing/osm_graph_adapter.py

import math


def estimate_traffic_density(highway_type):
    traffic_map = {
        "motorway": 0.9, "trunk": 0.8, "primary": 0.7,
        "secondary": 0.6, "tertiary": 0.5, "residential": 0.3
    }
    return traffic_map.get(highway_type, 0.4)


def estimate_risk(highway_type):
    risk_map = {
        "motorway": 0.8, "primary": 0.6,
        "secondary": 0.5, "residential": 0.3
    }
    return risk_map.get(highway_type, 0.4)


def estimate_scenic(highway_type):
    scenic_map = {
        "tertiary": 0.7,    # winding back roads — genuinely scenic
        "unclassified": 0.6,
        "secondary": 0.4,
        "residential": 0.2, # residential streets are not scenic
        "primary": 0.2,
        "motorway": 0.1
    }
    return scenic_map.get(highway_type, 0.3)


def estimate_curvature(G, u, v):
    """Compute real curvature from edge geometry instead of using length as proxy."""
    try:
        edge_data = G.edges[u, v, 0]
    except KeyError:
        return 0.1

    if "geometry" not in edge_data:
        return 0.1

    coords = list(edge_data["geometry"].coords)
    if len(coords) < 3:
        return 0.1

    total_bearing_change = 0
    for i in range(len(coords) - 2):
        b1 = math.atan2(
            coords[i+1][0] - coords[i][0],
            coords[i+1][1] - coords[i][1]
        )
        b2 = math.atan2(
            coords[i+2][0] - coords[i+1][0],
            coords[i+2][1] - coords[i+1][1]
        )
        change = abs(math.degrees(b2 - b1))
        total_bearing_change += min(change, 360 - change)

    # normalize: 0 = dead straight, 1 = very twisty
    return min(total_bearing_change / (len(coords) * 30), 1.0)


def build_custom_graph(osm_graph):
    graph = {}

    for u, v, data in osm_graph.edges(data=True):
        length  = data.get("length", 1)
        highway = data.get("highway", "residential")

        if isinstance(highway, list):
            highway = highway[0]

        edge = {
            "from":            u,
            "to":              v,
            "distance":        length,
            "time":            length / 13.8,
            "elevation_gain":  0,
            "traffic_density": estimate_traffic_density(highway),
            "risk":            estimate_risk(highway),
            "curvature":       estimate_curvature(osm_graph, u, v),  # real geometry
            "scenic":          estimate_scenic(highway)
        }

        if u not in graph:
            graph[u] = []
        graph[u].append(edge)

    return graph
