from fastapi import APIRouter, HTTPException
from routing.graph import load_road_graph, get_nearest_node, shortest_route, route_to_coordinates
from routing.osm_graph_adapter import build_custom_graph
from routing.astar_smart import smart_astar
from core.route_modes import get_mode_weights

router = APIRouter()

_custom_graph_cache = {}

def get_custom_graph(place_name: str):
    if place_name not in _custom_graph_cache:
        osm_graph = load_road_graph(place_name)
        custom_graph = build_custom_graph(osm_graph)
        _custom_graph_cache[place_name] = (osm_graph, custom_graph)
    return _custom_graph_cache[place_name]


@router.post("/route")
def get_smart_route(request: dict):
    try:
        start_lat = request["start_lat"]
        start_lng = request["start_lng"]
        goal_lat  = request["goal_lat"]
        goal_lng  = request["goal_lng"]
        mode      = request.get("mode", "balanced")
        place     = request.get("place", "Yelagiri Hills, Tamil Nadu, India")

        osm_graph, custom_graph = get_custom_graph(place)

        start_node = get_nearest_node(osm_graph, start_lat, start_lng)
        goal_node  = get_nearest_node(osm_graph, goal_lat, goal_lng)

        weights    = get_mode_weights(mode)
        path, cost = smart_astar(custom_graph, start_node, goal_node, weights)

        if not path:
            raise HTTPException(status_code=404, detail="No route found")

        coordinates = [
            {"lat": osm_graph.nodes[n]["y"], "lng": osm_graph.nodes[n]["x"]}
            for n in path
        ]

        return {"mode": mode, "cost": round(cost, 4), "path": coordinates}

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field: {e}")