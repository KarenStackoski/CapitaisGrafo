const fs = require('fs');
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

class Graph {
  constructor() {
    this.vertices = {};
  }

  addVertex(city, toll) {
    if (!this.vertices[city]) {
      this.vertices[city] = { toll, neighbors: {} };
    }
  }

  addEdge(city1, city2, distance) {
    if (!this.vertices[city1]) this.addVertex(city1, 0);
    if (!this.vertices[city2]) this.addVertex(city2, 0);

    this.vertices[city1].neighbors[city2] = distance;
    this.vertices[city2].neighbors[city1] = distance;
  }


  loadFromJSON(path) {
    const data = JSON.parse(fs.readFileSync(path));

    for (const capitalObj of data) {
      const [city, info] = Object.entries(capitalObj)[0];
      this.addVertex(city, info.toll);
    }

    for (const capitalObj of data) {
      const [city, info] = Object.entries(capitalObj)[0];
      for (const [neighbor, dist] of Object.entries(info.neighbors)) {
        this.addEdge(city, neighbor, dist);
      }
    }
  }

  showGraph() {
    for (const city in this.vertices) {
      console.log(`${city} (${this.vertices[city].toll}) =>`, this.vertices[city].neighbors);
    }
  }

  findCheapestPath(start, end, fuelPrice, autonomy) {
    const costs = {};
    const previous = {};
    const visited = new Set();
    const pq = new MinPriorityQueue();

    for (const city in this.vertices) {
      costs[city] = Infinity;
    }

    costs[start] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
      const { element: current } = pq.dequeue();
      if (visited.has(current)) continue;
      visited.add(current);

      for (const [neighbor, distance] of Object.entries(this.vertices[current].neighbors)) {
        const fuelCost = (distance / autonomy) * fuelPrice;
        const tollCost = this.vertices[neighbor].toll;
        const totalCost = fuelCost + tollCost;
        const newCost = costs[current] + totalCost;

        if (newCost < costs[neighbor]) {
          costs[neighbor] = newCost;
          previous[neighbor] = current;
          pq.enqueue(neighbor, newCost);
        }
      }
    }

    if (!previous[end]) return null;

    const path = [];
    let curr = end;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }

    return { path, cost: costs[end].toFixed(2) };
  }
}

module.exports = Graph;