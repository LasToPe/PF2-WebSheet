class CalcNode {
  constructor(key, computeFn = null, dependencies = []) {
    this.key = key;
    this.value = 0;
    this.computeFn = computeFn;     // null for user inputs
    this.dependencies = dependencies; // keys this node depends on
    this.dependents = new Set();    // keys that depend on this node
  }
}

export class CalculationEngine {
  constructor() {
    this.nodes = new Map();
    this.subscribers = new Map(); // key -> callback (for DOM updates)
  }

  _getOrCreateNode(key) {
    let node = this.nodes.get(key);
    if (!node) {
      node = new CalcNode(key);
      this.nodes.set(key, node);
    }
    return node;
  }

  registerSource(key, initialValue = 0) {
    const node = this._getOrCreateNode(key);
    node.value = initialValue;
  }

  registerFormula(key, dependencies, computeFn) {
    const node = this._getOrCreateNode(key);
    node.computeFn = computeFn;
    node.dependencies = dependencies;

    // Register reverse dependencies
    dependencies.forEach(depKey => {
      const depNode = this._getOrCreateNode(depKey);
      depNode.dependents.add(key);
    });

    // Run initial computation
    node.value = computeFn(this.getValues(dependencies));
  }

  get(key) {
    return this.nodes.get(key)?.value ?? 0;
  }

  getValues(keys) {
    const values = {};
    for (const k of keys) values[k] = this.get(k);
    return values;
  }

  updateSource(key, newValue) {
    const node = this._getOrCreateNode(key);
    if (!node || node.value === newValue) return;

    node.value = newValue;
    this.notify(key, newValue);

    // Recalculate only dependents (breadth-first or topological order)
    this.propagate(node);
  }

  propagate(startNode) {
    const order = this._getTopologicalOrder(startNode);
    if (order.length === 0) return;

    // Nodes marked dirty need recalculation
    const dirty = new Set(startNode.dependents);

    for (const key of order) {
      if (!dirty.has(key)) continue;

      const currentNode = this.nodes.get(key);
      if (!currentNode || !currentNode.computeFn) continue;

      const oldVal = currentNode.value;
      const newVal = currentNode.computeFn(this.getValues(currentNode.dependencies));

      if (oldVal !== newVal) {
        currentNode.value = newVal;
        this.notify(key, newVal);

        // Downstream dependents are now dirty
        currentNode.dependents.forEach(dep => dirty.add(dep));
      }
    }
  }

  /**
   * Kahn's Algorithm / Subgraph topological sort
   */
  _getTopologicalOrder(startNode) {
    // 1. Collect all reachable downstream nodes
    const reachable = new Set();
    const stack = Array.from(startNode.dependents);

    while (stack.length > 0) {
      const key = stack.pop();
      if (!reachable.has(key)) {
        reachable.add(key);
        const node = this.nodes.get(key);
        if (node) {
          node.dependents.forEach(dep => stack.push(dep));
        }
      }
    }

    if (reachable.size === 0) return [];

    // 2. Calculate in-degrees strictly within the reachable subgraph
    const inDegree = new Map();
    reachable.forEach(key => inDegree.set(key, 0));

    reachable.forEach(key => {
      const node = this.nodes.get(key);
      if (node) {
        node.dependencies.forEach(depKey => {
          if (reachable.has(depKey)) {
            inDegree.set(key, inDegree.get(key) + 1);
          }
        });
      }
    });

    // 3. Process nodes with 0 in-degrees first
    const queue = [];
    inDegree.forEach((degree, key) => {
      if (degree === 0) queue.push(key);
    });

    const ordered = [];
    while (queue.length > 0) {
      const key = queue.shift();
      ordered.push(key);

      const node = this.nodes.get(key);
      if (node) {
        node.dependents.forEach(depKey => {
          if (reachable.has(depKey)) {
            const nextDegree = inDegree.get(depKey) - 1;
            inDegree.set(depKey, nextDegree);
            if (nextDegree === 0) {
              queue.push(depKey);
            }
          }
        });
      }
    }

    return ordered;
  }

  subscribe(key, domUpdateFn) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(domUpdateFn);
  }

  notify(key, value) {
    const listeners = this.subscribers.get(key) || [];
    listeners.forEach(fn => fn(value));
  }
}