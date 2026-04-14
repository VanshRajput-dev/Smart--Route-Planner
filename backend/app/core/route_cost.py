# core/route_cost.py

class RouteWeights:
    def __init__(self,
                 alpha=0.3,
                 beta=0.2,
                 gamma=0.3,
                 delta=0.1,
                 epsilon=0.05,
                 zeta=0.05,
                 f0=0.0002,
                 f1=0.001,
                 f2=0.0005):
        self.alpha = alpha
        self.beta = beta
        self.gamma = gamma
        self.delta = delta
        self.epsilon = epsilon
        self.zeta = zeta
        self.f0 = f0
        self.f1 = f1
        self.f2 = f2


def compute_edge_cost(edge, weights: RouteWeights):
    fuel = (
        weights.f0 * edge["distance"] +
        weights.f1 * edge["elevation_gain"] +
        weights.f2 * edge["traffic_density"] * edge["distance"]
    )

    score = (
        weights.alpha * edge["distance"] +
        weights.beta * edge["time"] +
        weights.gamma * fuel +
        weights.delta * edge["risk"] +
        weights.epsilon * (edge["curvature"] ** 2) -
        weights.zeta * edge["scenic"]
    )

    return score
