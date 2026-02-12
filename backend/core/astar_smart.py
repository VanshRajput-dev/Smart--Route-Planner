# routing/astar_smart.py

import heapq
from core.route_cost import compute_edge_cost


def smart_astar(graph, start, goal, weights):
    pq = []
    heapq.heappush(pq, (0, start))

    came_from = {}
    cost_so_far = {start: 0}

    while pq:
        _, current = heapq.heappop(pq)

        if current == goal:
            break

        for edge in graph[current]:
            next_node = edge["to"]

            new_cost = cost_so_far[current] + compute_edge_cost(edge, weights)

            if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                cost_so_far[next_node] = new_cost
                heapq.heappush(pq, (new_cost, next_node))
                came_from[next_node] = current

    return reconstruct_path(came_from, start, goal), cost_so_far.get(goal)


def reconstruct_path(came_from, start, goal):
    node = goal
    path = []

    while node != start:
        path.append(node)
        node = came_from[node]

    path.append(start)
    path.reverse()
    return path
