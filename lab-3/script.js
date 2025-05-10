// Node class representing each cell in the grid
class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.isWeight = false;
        this.weight = 1;
        this.isVisited = false;
        this.isPath = false;
        this.previousNode = null;
        this.distance = Infinity;
        this.heuristic = Infinity;
        this.totalCost = Infinity;
    }

    resetPathfinding() {
        this.isStart = false;
        this.isEnd = false;
        this.isVisited = false;
        this.isPath = false;
        this.previousNode = null;
        this.distance = Infinity;
        this.heuristic = Infinity;
        this.totalCost = Infinity;
    }
}

// Algorithm base class
class PathfindingAlgorithm {
    constructor(grid) {
        this.grid = grid;
        this.visitedNodes = [];
        this.nodesToVisit = [];
    }

    async findPath(visualizeSpeed) {
        throw new Error("findPath method must be implemented by subclass");
    }

    async reconstructPath(endNode, visualizeSpeed) {
        const path = [];
        let currentNode = endNode;
        
        while (currentNode !== this.grid.startNode) {
            path.unshift(currentNode);
            currentNode = currentNode.previousNode;
            if (!currentNode) return false;
        }

        for (const node of path) {
            if (!node.isStart && !node.isEnd) {
                node.isPath = true;
                this.grid.updateCellVisuals(node);
                if (visualizeSpeed > 0) {
                    await new Promise(resolve => setTimeout(resolve, visualizeSpeed * 2));
                }
            }
        }
        
        return true;
    }

    getNeighbors(node) {
        const neighbors = [];
        const { row, col } = node;
        const { rows, cols } = this.grid;

        if (row > 0) neighbors.push(this.grid.nodes[row - 1][col]);
        if (row < rows - 1) neighbors.push(this.grid.nodes[row + 1][col]);
        if (col > 0) neighbors.push(this.grid.nodes[row][col - 1]);
        if (col < cols - 1) neighbors.push(this.grid.nodes[row][col + 1]);

        return neighbors.filter(neighbor => !neighbor.isWall);
    }
}

// Dijkstra's Algorithm implementation
class DijkstraAlgorithm extends PathfindingAlgorithm {
    async findPath(visualizeSpeed) {
        this.grid.resetPathfinding();
        this.visitedNodes = [];
        this.nodesToVisit = [];

        // Initialize all nodes
        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.cols; col++) {
                this.nodesToVisit.push(this.grid.nodes[row][col]);
            }
        }

        // Set start node distance to 0
        this.grid.startNode.distance = 0;

        while (this.nodesToVisit.length > 0) {
            // Sort nodes by distance
            this.nodesToVisit.sort((a, b) => a.distance - b.distance);
            const closestNode = this.nodesToVisit.shift();

            // Skip walls
            if (closestNode.isWall) continue;

            // If we're stuck (infinite distance), no path exists
            if (closestNode.distance === Infinity) {
                return false;
            }

            // Mark as visited
            closestNode.isVisited = true;
            this.visitedNodes.push(closestNode);

            // Visualize visited node
            if (!closestNode.isStart && !closestNode.isEnd) {
                this.grid.updateCellVisuals(closestNode);
                if (visualizeSpeed > 0) {
                    await new Promise(resolve => setTimeout(resolve, visualizeSpeed));
                }
            }

            // If we reached the end, reconstruct path
            if (closestNode === this.grid.endNode) {
                return await this.reconstructPath(closestNode, visualizeSpeed);
            }

            // Update distances to neighbors
            this.updateNeighbors(closestNode);
        }

        return false;
    }

    updateNeighbors(node) {
        const neighbors = this.getNeighbors(node);
        for (const neighbor of neighbors) {
            if (neighbor.isVisited) continue;
            
            const newDistance = node.distance + neighbor.weight;
            if (newDistance < neighbor.distance) {
                neighbor.distance = newDistance;
                neighbor.previousNode = node;
            }
        }
    }
}

// A* Algorithm implementation
class AStarAlgorithm extends PathfindingAlgorithm {
    async findPath(visualizeSpeed) {
        this.grid.resetPathfinding();
        this.visitedNodes = [];
        this.nodesToVisit = [];

        // Calculate heuristic for all nodes
        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.cols; col++) {
                const node = this.grid.nodes[row][col];
                node.heuristic = this.calculateHeuristic(node);
                node.totalCost = Infinity;
            }
        }

        // Set start node
        this.grid.startNode.distance = 0;
        this.grid.startNode.totalCost = this.grid.startNode.heuristic;
        this.nodesToVisit.push(this.grid.startNode);

        while (this.nodesToVisit.length > 0) {
            // Sort nodes by total cost
            this.nodesToVisit.sort((a, b) => a.totalCost - b.totalCost);
            const currentNode = this.nodesToVisit.shift();

            // Skip walls
            if (currentNode.isWall) continue;

            // If we're stuck (infinite cost), no path exists
            if (currentNode.totalCost === Infinity) {
                return false;
            }

            // Mark as visited
            currentNode.isVisited = true;
            this.visitedNodes.push(currentNode);

            // Visualize visited node
            if (!currentNode.isStart && !currentNode.isEnd) {
                this.grid.updateCellVisuals(currentNode);
                if (visualizeSpeed > 0) {
                    await new Promise(resolve => setTimeout(resolve, visualizeSpeed));
                }
            }

            // If we reached the end, reconstruct path
            if (currentNode === this.grid.endNode) {
                return await this.reconstructPath(currentNode, visualizeSpeed);
            }

            // Update neighbors
            this.updateNeighbors(currentNode);
        }

        return false;
    }

    calculateHeuristic(node) {
        // Manhattan distance
        return Math.abs(node.row - this.grid.endNode.row) + Math.abs(node.col - this.grid.endNode.col);
    }

    updateNeighbors(node) {
        const neighbors = this.getNeighbors(node);
        for (const neighbor of neighbors) {
            if (neighbor.isVisited) continue;
            
            const tentativeDistance = node.distance + neighbor.weight;
            if (tentativeDistance < neighbor.distance) {
                neighbor.previousNode = node;
                neighbor.distance = tentativeDistance;
                neighbor.totalCost = neighbor.distance + neighbor.heuristic;
                
                if (!this.nodesToVisit.includes(neighbor)) {
                    this.nodesToVisit.push(neighbor);
                }
            }
        }
    }
}

// Grid class managing the visual representation and state
class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.nodes = this.createNodes();
        this.startNode = null;
        this.endNode = null;
        this.mode = 'wall';
        this.algorithm = 'dijkstra';
        this.visualizeSpeed = 20;
        this.setupEventListeners();
        this.setupMessageListeners();
        this.renderGrid();
        this.updateStats();
    }

    createNodes() {
        const nodes = [];
        for (let row = 0; row < this.rows; row++) {
            nodes[row] = [];
            for (let col = 0; col < this.cols; col++) {
                nodes[row][col] = new Node(row, col);
            }
        }
        return nodes;
    }

    setupEventListeners() {
        document.getElementById('algorithm-select').addEventListener('change', (e) => {
            this.algorithm = e.target.value;
            this.updateStats();
        });

        document.getElementById('grid-size').addEventListener('change', (e) => {
            this.resizeGrid(parseInt(e.target.value));
            this.updateStats();
        });

        document.getElementById('speed').addEventListener('change', (e) => {
            this.visualizeSpeed = parseInt(e.target.value);
        });

        document.getElementById('start-btn').addEventListener('click', () => {
            this.mode = 'start';
            this.updateActiveButton();
        });

        document.getElementById('end-btn').addEventListener('click', () => {
            this.mode = 'end';
            this.updateActiveButton();
        });

        document.getElementById('wall-btn').addEventListener('click', () => {
            this.mode = 'wall';
            this.updateActiveButton();
        });

        document.getElementById('weight-btn').addEventListener('click', () => {
            this.mode = 'weight';
            this.updateActiveButton();
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearWalls();
            this.updateStats();
        });

        document.getElementById('find-path-btn').addEventListener('click', () => {
            this.findPath();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGrid();
            this.updateStats();
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGrid();
        });

        document.getElementById('load-btn').addEventListener('click', () => {
            this.loadGrid();
        });

        document.getElementById('clear-save-btn').addEventListener('click', () => {
            this.clearSavedGrid();
        });
    }

    setupMessageListeners() {
        document.getElementById('message-close').addEventListener('click', () => {
            document.getElementById('message-overlay').classList.remove('active');
        });
    }

    updateActiveButton() {
        document.querySelectorAll('.controls button').forEach(btn => {
            btn.classList.remove('active');
        });

        switch (this.mode) {
            case 'start':
                document.getElementById('start-btn').classList.add('active');
                break;
            case 'end':
                document.getElementById('end-btn').classList.add('active');
                break;
            case 'wall':
                document.getElementById('wall-btn').classList.add('active');
                break;
            case 'weight':
                document.getElementById('weight-btn').classList.add('active');
                break;
        }
    }

    renderGrid() {
        const gridElement = document.getElementById('grid');
        gridElement.innerHTML = '';
        gridElement.style.gridTemplateColumns = `repeat(${this.cols}, 30px)`;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                cell.addEventListener('mouseenter', (e) => {
                    if (e.buttons === 1) {
                        this.handleCellClick(row, col);
                    }
                });
                
                gridElement.appendChild(cell);
                this.updateCellVisuals(this.nodes[row][col]);
            }
        }
    }

    handleCellClick(row, col) {
        const node = this.nodes[row][col];
        
        switch (this.mode) {
            case 'start':
                if (this.startNode) {
                    this.startNode.isStart = false;
                    this.updateCellVisuals(this.startNode);
                }
                node.isStart = true;
                this.startNode = node;
                this.updateCellVisuals(node);
                break;
                
            case 'end':
                if (this.endNode) {
                    this.endNode.isEnd = false;
                    this.updateCellVisuals(this.endNode);
                }
                node.isEnd = true;
                this.endNode = node;
                this.updateCellVisuals(node);
                break;
                
            case 'wall':
                node.isWall = !node.isWall;
                node.isWeight = false;
                node.weight = 1;
                this.updateCellVisuals(node);
                break;
                
            case 'weight':
                if (!node.isStart && !node.isEnd && !node.isWall) {
                    node.isWeight = !node.isWeight;
                    node.weight = node.isWeight ? 5 : 1;
                    this.updateCellVisuals(node);
                }
                break;
        }
        this.updateStats();
    }

    updateCellVisuals(node) {
        const cellElement = this.getCellElement(node.row, node.col);
        if (!cellElement) return;
        
        cellElement.className = 'cell';
        cellElement.textContent = '';
        
        if (node.isStart) {
            cellElement.classList.add('start');
            cellElement.textContent = 'S';
        } else if (node.isEnd) {
            cellElement.classList.add('end');
            cellElement.textContent = 'E';
        } else if (node.isWall) {
            cellElement.classList.add('wall');
        } else if (node.isWeight) {
            cellElement.classList.add('weight');
            cellElement.textContent = node.weight;
        } else if (node.isPath) {
            cellElement.classList.add('path');
        } else if (node.isVisited) {
            cellElement.classList.add('visited');
        }
    }

    getCellElement(row, col) {
        return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }

    clearWalls() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.nodes[row][col];
                node.isWall = false;
                node.isWeight = false;
                node.weight = 1;
                this.updateCellVisuals(node);
            }
        }
    }

    resetPathfinding() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.nodes[row][col];
                if (node !== this.startNode && node !== this.endNode) {
                    node.resetPathfinding();
                }
            }
        }
    }

    resetGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.nodes[row][col];
                node.resetPathfinding();
                if (node !== this.startNode && node !== this.endNode) {
                    node.isWall = false;
                    node.isWeight = false;
                    node.weight = 1;
                }
                this.updateCellVisuals(node);
            }
        }
        this.startNode = null;
        this.endNode = null;
    }

    resizeGrid(newSize) {
        this.rows = newSize;
        this.cols = newSize;
        this.nodes = this.createNodes();
        this.startNode = null;
        this.endNode = null;
        this.renderGrid();
    }

    async findPath() {
        if (!this.startNode || !this.endNode) {
            this.showMessage('Error', 'Please set both start and end points', false);
            return;
        }
        
        this.resetPathfinding();
        this.toggleControls(false);
        
        let pathFound = false;
        const startTime = performance.now();
        
        let algorithm;
        if (this.algorithm === 'dijkstra') {
            algorithm = new DijkstraAlgorithm(this);
        } else {
            algorithm = new AStarAlgorithm(this);
        }
        
        pathFound = await algorithm.findPath(this.visualizeSpeed);
        
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        
        if (pathFound) {
            this.showMessage('Success', `Path found in ${duration}ms using ${this.algorithm.toUpperCase()}`);
            this.updateStats(`Path found in ${duration}ms`, true);
        } else {
            this.showMessage('No Path', `No path found (${duration}ms)`, false);
            this.updateStats(`No path found (${duration}ms)`, false);
        }
        
        this.toggleControls(true);
    }

    toggleControls(enable) {
        const buttons = document.querySelectorAll('.controls button, .controls select');
        buttons.forEach(button => {
            button.disabled = !enable;
        });
    }

    updateStats(message = 'Ready', isSuccess = true) {
        document.getElementById('status-message').textContent = message;
        document.getElementById('status-message').className = isSuccess ? 'stat-value success' : 'stat-value danger';
        document.getElementById('algorithm-name').textContent = 
            this.algorithm === 'dijkstra' ? "Dijkstra's" : "A* Search";
        document.getElementById('grid-dimensions').textContent = `${this.rows}×${this.cols}`;
        document.getElementById('start-position').textContent = 
            this.startNode ? `(${this.startNode.row},${this.startNode.col})` : 'Not set';
        document.getElementById('end-position').textContent = 
            this.endNode ? `(${this.endNode.row},${this.endNode.col})` : 'Not set';
    }

    showMessage(title, content, isSuccess = true) {
        const overlay = document.getElementById('message-overlay');
        const messageTitle = document.getElementById('message-title');
        const messageContent = document.getElementById('message-content');
        
        messageTitle.textContent = title;
        messageContent.textContent = content;
        
        overlay.classList.add('active');
        overlay.style.backgroundColor = isSuccess 
            ? 'rgba(67, 160, 71, 0.9)' 
            : 'rgba(229, 57, 53, 0.9)';
    }

    saveGrid() {
        if (!this.startNode || !this.endNode) {
            this.showMessage('Error', 'Please set both start and end points before saving', false);
            return;
        }
        
        const gridData = {
            rows: this.rows,
            cols: this.cols,
            nodes: [],
            startNode: { row: this.startNode.row, col: this.startNode.col },
            endNode: { row: this.endNode.row, col: this.endNode.col }
        };
        
        for (let row = 0; row < this.rows; row++) {
            gridData.nodes[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const node = this.nodes[row][col];
                gridData.nodes[row][col] = {
                    isWall: node.isWall,
                    isWeight: node.isWeight,
                    weight: node.weight
                };
            }
        }
        
        localStorage.setItem('savedGrid', JSON.stringify(gridData));
        this.showMessage('Success', 'Grid saved successfully!');
    }

    loadGrid() {
        const savedGrid = localStorage.getItem('savedGrid');
        if (!savedGrid) {
            this.showMessage('Error', 'No saved grid found', false);
            return;
        }
        
        try {
            const gridData = JSON.parse(savedGrid);
            this.rows = gridData.rows;
            this.cols = gridData.cols;
            this.nodes = this.createNodes();
            
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const nodeData = gridData.nodes[row][col];
                    const node = this.nodes[row][col];
                    
                    node.isWall = nodeData.isWall;
                    node.isWeight = nodeData.isWeight;
                    node.weight = nodeData.weight;
                }
            }
            
            this.startNode = this.nodes[gridData.startNode.row][gridData.startNode.col];
            this.startNode.isStart = true;
            
            this.endNode = this.nodes[gridData.endNode.row][gridData.endNode.col];
            this.endNode.isEnd = true;
            
            this.renderGrid();
            this.showMessage('Success', 'Grid loaded successfully!');
            this.updateStats();
        } catch (error) {
            console.error('Error loading grid:', error);
            this.showMessage('Error', 'Failed to load saved grid', false);
        }
    }

    clearSavedGrid() {
        localStorage.removeItem('savedGrid');
        this.showMessage('Info', 'Saved grid cleared');
    }
}

// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const initialSize = parseInt(document.getElementById('grid-size').value);
    new Grid(initialSize, initialSize);
});