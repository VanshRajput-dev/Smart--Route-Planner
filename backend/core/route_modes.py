# core/route_modes.py

from core.route_cost import RouteWeights


def get_mode_weights(mode: str):

    if mode == "eco":
        return RouteWeights(alpha=0.2, beta=0.2, gamma=0.5, delta=0.05, epsilon=0.03, zeta=0.02)

    if mode == "sport":
        return RouteWeights(alpha=0.2, beta=0.3, gamma=0.1, delta=0.05, epsilon=0.2, zeta=0.15)

    if mode == "safe":
        return RouteWeights(alpha=0.2, beta=0.3, gamma=0.2, delta=0.2, epsilon=0.05, zeta=0.05)

    return RouteWeights()
