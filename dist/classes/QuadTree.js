import Rect from './shapes/Rect.js';
import Vector2 from './Vector2.js';
var QTnode;
(function (QTnode) {
    QTnode[QTnode["NorthEast"] = 0] = "NorthEast";
    QTnode[QTnode["NorthWest"] = 1] = "NorthWest";
    QTnode[QTnode["SouthWest"] = 2] = "SouthWest";
    QTnode[QTnode["SouthEast"] = 3] = "SouthEast";
})(QTnode || (QTnode = {}));
export default class QuadTree {
    bounds;
    max_objects;
    max_levels;
    level;
    objects;
    nodes;
    constructor(bounds, max_objects, max_levels, level) {
        this.bounds = bounds;
        this.max_objects = max_objects;
        this.max_levels = max_levels;
        this.level = level ?? 0;
        this.objects = new Array();
        this.nodes = null;
    }
    split() {
        const { width, height } = this.bounds;
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const neBounds = new Rect(this.bounds.position.clone().add(new Vector2(halfWidth, 0)), halfWidth, halfHeight);
        const nwBounds = new Rect(this.bounds.position.clone().add(new Vector2(0, 0)), halfWidth, halfHeight);
        const swBounds = new Rect(this.bounds.position.clone().add(new Vector2(0, halfHeight)), halfWidth, halfHeight);
        const seBounds = new Rect(this.bounds.position.clone().add(new Vector2(halfWidth, halfHeight)), halfWidth, halfHeight);
        this.nodes = new Array();
        this.nodes[QTnode.NorthEast] = new QuadTree(neBounds, this.max_objects, this.max_levels, this.level + 1);
        this.nodes[QTnode.NorthWest] = new QuadTree(nwBounds, this.max_objects, this.max_levels, this.level + 1);
        this.nodes[QTnode.SouthWest] = new QuadTree(swBounds, this.max_objects, this.max_levels, this.level + 1);
        this.nodes[QTnode.SouthEast] = new QuadTree(seBounds, this.max_objects, this.max_levels, this.level + 1);
        this.objects.forEach((obj) => {
            this.getNodes(obj._bounds).forEach((node) => {
                node.insert(obj, obj._bounds);
            });
        });
        this.objects = [];
    }
    getNodes(bounds) {
        if (!this.nodes)
            return [];
        const nodes = new Array();
        const { x: centerX, y: centerY } = this.bounds.getCenterPoint();
        const north = bounds.getTopY() < centerY;
        const south = bounds.getBottomY() > centerY;
        const west = bounds.getLeftX() < centerX;
        const east = bounds.getRightX() > centerX;
        if (north && east)
            nodes.push(this.nodes[QTnode.NorthEast]);
        if (north && west)
            nodes.push(this.nodes[QTnode.NorthWest]);
        if (south && west)
            nodes.push(this.nodes[QTnode.SouthWest]);
        if (south && east)
            nodes.push(this.nodes[QTnode.SouthEast]);
        return nodes;
    }
    insert(obj, bounds) {
        if (bounds)
            obj['_bounds'] = bounds;
        if (this.nodes) {
            this.getNodes(obj._bounds).forEach((node) => {
                node.insert(obj);
            });
            return;
        }
        this.objects.push(obj);
        if (this.objects.length > this.max_objects && this.level + 1 < this.max_levels)
            this.split();
    }
    query(queryBounds) {
        const queryRessultObjects = new Set();
        for (const obj of this.objects)
            queryRessultObjects.add(obj);
        if (this.nodes)
            for (const node of this.getNodes(queryBounds))
                for (const nestedQueryRessultObject of node.query(queryBounds))
                    queryRessultObjects.add(nestedQueryRessultObject);
        return Array.from(queryRessultObjects);
    }
    renderAt(ctx) {
        this.bounds.renderAt(ctx, `hsl(${(360 / this.max_levels) * this.level},50%,50%)`);
        if (this.nodes)
            for (const node of this.nodes)
                node.renderAt(ctx);
    }
}
//# sourceMappingURL=QuadTree.js.map