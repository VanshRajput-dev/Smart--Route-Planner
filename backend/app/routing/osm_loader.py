# routing/osm_loader.py

import osmnx as ox


ox.settings.use_cache = True
ox.settings.cache_folder = "data_cache"
ox.settings.log_console = True


def load_graph_from_place(place_name: str):
    graph = ox.graph_from_place(place_name, network_type="drive")
    return graph


def load_graph_from_bbox(north, south, east, west):
    graph = ox.graph_from_bbox(north, south, east, west, network_type="drive")
    return graph
