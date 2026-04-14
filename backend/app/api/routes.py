# api/routes.py

from fastapi import APIRouter, HTTPException
from app.routing.graph import load_road_graph
from app.routing.osm_graph_adapter import build_custom_graph
from app.routing.astar_smart import smart_astar
from app.core.route_modes import get_mode_weights
import osmnx as ox

router = APIRouter()

# Cache the converted graph in memory so it's built once per server run
_custom_graph_cache = {}

def get_custom_graph(place_name: str):
    if place_name not in _custom_graph_cache:
        osm_graph = load_road_graph(place_name)
        _custom_graph_cache[place_name] = (osm_graph, build_custom_graph(osm_graph))
    return _custom_graph_cache[place_name]


@router.post("/osm-smart-route")
def get_osm_smart_route(request: dict):
    try:
        start_lat = request["start_lat"]
        start_lng = request["start_lng"]
        goal_lat  = request["goal_lat"]
        goal_lng  = request["goal_lng"]
        mode      = request.get("mode", "eco")
        place     = request.get("place", "Yelagiri Hills, Tamil Nadu, India")

        osm_graph, custom_graph = get_custom_graph(place)

        start_node = ox.distance.nearest_nodes(osm_graph, start_lng, start_lat)
        goal_node  = ox.distance.nearest_nodes(osm_graph, goal_lng,  goal_lat)

        weights    = get_mode_weights(mode)
        path, cost = smart_astar(custom_graph, start_node, goal_node, weights)

        if path is None:
            raise HTTPException(status_code=404, detail="No route found between given coordinates")

        coordinates = [
            {"lat": osm_graph.nodes[n]["y"], "lng": osm_graph.nodes[n]["x"]}
            for n in path
        ]

        return {"mode": mode, "cost": round(cost, 4), "path": coordinates}

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field: {e}")
//im gay