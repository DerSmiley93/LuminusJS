import game from "../core/game.js";
import GameObject from "../core/game-object.js";
import Vector2 from "../math/vector2.js";

export class QuadTree {

}

export class QuadTreeNode {

    public halfWidth: number;
    public halfHeigth: number;

    private childNodes: QuadTreeNode[] = [];
    private objects: GameObject[] = [];

    constructor(public width: number, public height: number, public position: Vector2, private maxNumberOfObjects: number) {
        this.halfWidth = width / 2;
        this.halfHeigth = height / 2;
    }

    insetObject(gameObject: GameObject) {
        if (this.childNodes.length == 0) {
            if (this.objects.length + 1 > this.maxNumberOfObjects) {

                this.objects.push(gameObject);
                this.split();
            } else {
                this.objects.push(gameObject);
            }

        } else {
            const nodeInCharge = this.getNodeInCharge(gameObject);
            nodeInCharge.insetObject(gameObject);
        }
        return;
    }

    getNodeInCharge(gameObject: GameObject) {

        const relativePosition = gameObject.transform.worldPosition.subtract(this.position);

        if (
            relativePosition.x < 0 &&
            relativePosition.y < 0 &&
            relativePosition.x > -this.halfWidth &&
            relativePosition.y > -this.halfHeigth
        ) {
            
            return this.childNodes[0]
        } else if (
            relativePosition.x < 0 &&
            relativePosition.y > 0 &&
            relativePosition.x > -this.halfWidth &&
            relativePosition.y < this.halfHeigth
        ) {
            
            return this.childNodes[1]
        } else if (
            relativePosition.x > 0 &&
            relativePosition.y > 0 &&
            relativePosition.x < this.halfWidth &&
            relativePosition.y < this.halfHeigth
        ) {
            
            return this.childNodes[2]
        } else if (
            relativePosition.x > 0 &&
            relativePosition.y < 0 &&
            relativePosition.x < this.halfWidth &&
            relativePosition.y > -this.halfHeigth
        ) {
            
            return this.childNodes[3]
        } else if (relativePosition.x == 0 && relativePosition.y == 0) {
            return this.childNodes[Math.floor(Math.random() * this.childNodes.length)];
        }
        else {

            throw new Error("gameObject is out of Bounds: this should not happen");
        }

    }

    split() {
        this.childNodes = [
            new QuadTreeNode(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x - this.halfWidth / 2, this.position.y - this.halfHeigth / 2),
                this.maxNumberOfObjects
            ),
            new QuadTreeNode(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x - this.halfWidth / 2, this.position.y + this.halfHeigth / 2),
                this.maxNumberOfObjects
            ),
            new QuadTreeNode(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x + this.halfWidth / 2, this.position.y + this.halfHeigth / 2),
                this.maxNumberOfObjects
            ),
            new QuadTreeNode(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x + this.halfWidth / 2, this.position.y - this.halfHeigth / 2),
                this.maxNumberOfObjects
            )

        ]

        for (const object of this.objects) {
            const nodeInCharge = this.getNodeInCharge(object);
            nodeInCharge.insetObject(object);
        }
        this.objects = [];
    }

    show() {
        game.ctx.strokeRect(this.position.x - this.halfWidth, this.position.y - this.halfHeigth, this.width, this.height);
        this.childNodes.forEach(childNode => {
            childNode.show()
        })
    }

}