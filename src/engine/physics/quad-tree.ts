import game from "../core/game.js";
import collider from "../core/game-object.js";
import Vector2 from "../math/vector2.js";
import Collider2D from "../default-components/collider-2d.js";

export class QuadTree {

    public halfWidth: number;
    public halfHeigth: number;

    private childNodes: QuadTree[] = [];
    private colliders: Collider2D[] = [];

    constructor(public width: number, public height: number, public position: Vector2, private maxNumberOfObjects: number) {
        this.halfWidth = width / 2;
        this.halfHeigth = height / 2;
    }

    insertObject(collider: Collider2D) {

        if (this.childNodes.length == 0) {
            if (this.colliders.length + 1 > this.maxNumberOfObjects) {
                this.colliders.push(collider);
                this.split();
            } else {
                this.colliders.push(collider);
            }

        } else {
            const nodeInCharge = this.getNodeInCharge(collider);
            nodeInCharge.insertObject(collider);
        }
        return;
    }

    getNodeInCharge(collider: Collider2D) {

        const relativePosition = collider.colliderShape.transform.worldPosition.subtract(this.position);

        if (
            relativePosition.x < 0 &&
            relativePosition.y < 0 &&
            relativePosition.x >= -this.halfWidth &&
            relativePosition.y >= -this.halfHeigth
        ) {

            return this.childNodes[0]
        } else if (
            relativePosition.x < 0 &&
            relativePosition.y > 0 &&
            relativePosition.x >= -this.halfWidth &&
            relativePosition.y <= this.halfHeigth
        ) {

            return this.childNodes[1]
        } else if (
            relativePosition.x > 0 &&
            relativePosition.y > 0 &&
            relativePosition.x <= this.halfWidth &&
            relativePosition.y <= this.halfHeigth
        ) {

            return this.childNodes[2]
        } else if (
            relativePosition.x > 0 &&
            relativePosition.y < 0 &&
            relativePosition.x <= this.halfWidth &&
            relativePosition.y >= -this.halfHeigth
        ) {

            return this.childNodes[3]
        } else if (relativePosition.x == 0 && relativePosition.y == 0) {
            return this.childNodes[2];
        }
        else {
            throw new Error("collider is out of Bounds: this should not happen");
        }

    }

    query(collider: Collider2D): Collider2D[] {

        let result: Collider2D[] = [];

        const boundingBox = collider.colliderShape.getBoundingBox()

        const isIntersecting = this.intersects(
            boundingBox.halfWidth * 4,
            boundingBox.halfHeight * 4,
            collider.colliderShape.transform.worldPosition
        )

        if (isIntersecting && this.childNodes.length > 0) {
            this.childNodes.forEach(node => {
                
                result = result.concat(node.query(collider));
                
            });
        } else if (isIntersecting) {
            result = result.concat(this.colliders);
        }
        return result;
    }

    private intersects(width: number, height: number, boundingPosition: Vector2): boolean {

        if (
            boundingPosition.x - width / 2 < this.position.x + this.halfWidth &&
            boundingPosition.x + width / 2 > this.position.x - this.halfWidth &&
            boundingPosition.y - height / 2 < this.position.y + this.halfHeigth &&
            boundingPosition.y + height / 2 > this.position.y - this.halfHeigth
        ) {
            return true;
        }

        return false;
    }

    split() {
        this.childNodes = [
            new QuadTree(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x - this.halfWidth / 2, this.position.y - this.halfHeigth / 2),
                this.maxNumberOfObjects
            ),
            new QuadTree(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x - this.halfWidth / 2, this.position.y + this.halfHeigth / 2),
                this.maxNumberOfObjects
            ),
            new QuadTree(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x + this.halfWidth / 2, this.position.y + this.halfHeigth / 2),
                this.maxNumberOfObjects
            ),
            new QuadTree(
                this.halfWidth,
                this.halfHeigth,
                new Vector2(this.position.x + this.halfWidth / 2, this.position.y - this.halfHeigth / 2),
                this.maxNumberOfObjects
            )

        ]

        for (const object of this.colliders) {
            const nodeInCharge = this.getNodeInCharge(object);
            nodeInCharge.insertObject(object);
        }
        this.colliders = [];
    }

    show() {
        game.ctx.strokeRect(this.position.x - this.halfWidth, this.position.y - this.halfHeigth, this.width, this.height);
        this.childNodes.forEach(childNode => {
            childNode.show()
        })
    }

}