from fastapi import APIRouter
from routing.osm_loader import load_graph_from_bbox
from routing.astar_smart import smart_astar
from core.route_modes import get_mode_weights
import osmnx as ox

router = APIRouter()


@router.post("/osm-smart-route")
def get_osm_smart_route(request: dict):

    north = request["north"]
    south = request["south"]
    east = request["east"]
    west = request["west"]

    start_lat = request["start_lat"]
    start_lng = request["start_lng"]
    goal_lat = request["goal_lat"]
    goal_lng = request["goal_lng"]

    mode = request.get("mode", "eco")

    osm_graph = load_graph_from_bbox(north, south, east, west)

    start_node = ox.distance.nearest_nodes(osm_graph, start_lng, start_lat)
    goal_node = ox.distance.nearest_nodes(osm_graph, goal_lng, goal_lat)

    weights = get_mode_weights(mode)

    path, cost = smart_astar(osm_graph, start_node, goal_node, weights)

    coordinates = [
        {
            "lat": osm_graph.nodes[node]["y"],
            "lng": osm_graph.nodes[node]["x"]
        }
        for node in path
    ]

    return {
        "mode": mode,
        "cost": cost,
        "path": coordinates
    }
