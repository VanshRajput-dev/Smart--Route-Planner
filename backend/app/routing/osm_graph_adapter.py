# routing/osm_graph_adapter.py

import networkx as nx
import math


def estimate_traffic_density(highway_type):
    traffic_map = {
        "motorway": 0.9,
        "trunk": 0.8,
        "primary": 0.7,
        "secondary": 0.6,
        "tertiary": 0.5,
        "residential": 0.3
    }
    return traffic_map.get(highway_type, 0.4)


def estimate_risk(highway_type):
    risk_map = {
        "motorway": 0.8,
        "primary": 0.6,
        "secondary": 0.5,
        "residential": 0.3
    }
    return risk_map.get(highway_type, 0.4)


def estimate_scenic(highway_type):
    if highway_type in ["residential", "tertiary"]:
        return 0.6
    return 0.2


def estimate_curvature(length):
    return min(length / 100, 1)


def build_custom_graph(osm_graph):

    graph = {}

    for u, v, data in osm_graph.edges(data=True):

        length = data.get("length", 1)
        highway = data.get("highway", "residential")

        if isinstance(highway, list):
            highway = highway[0]

        edge = {
            "from": u,
            "to": v,
            "distance": length,
            "time": length / 13.8,
            "elevation_gain": 0,
            "traffic_density": estimate_traffic_density(highway),
            "risk": estimate_risk(highway),
            "curvature": estimate_curvature(length),
            "scenic": estimate_scenic(highway)
        }

        if u not in graph:
            graph[u] = []

        graph[u].append(edge)

    return graph
