import Component from "../engine/core/component.js";
import GameObject from "../engine/core/game-object.js";
import game from "../engine/core/game.js";
import { Rect2D } from "../engine/types/rect2d.js";
import ShapeRenderer2D from "../engine/default-components/shape-renderer.js";
import Transform from "../engine/math/transform.js";
import { QuadTreeNode } from "../engine/physics/quad-tree.js";
import Vector2 from "../engine/math/vector2.js";


export default class Spinn implements Component {
    transform!: Transform;
    quadTree: QuadTreeNode = new QuadTreeNode(1000, 1000, new Vector2(0, 0), 10)
    testObjects: GameObject[] = [];

    start(): void {
        for (let i = 0; i < 500; i++) {
            const tobj = new GameObject(
                "testObject:" + i,
                [
                    new ShapeRenderer2D(new Rect2D(10, 10, "red", "blue", true, false, 1))
                ],
                new Transform(
                    new Vector2(
                        Math.random() * this.quadTree.width / 2 - this.quadTree.halfWidth / 2,
                        Math.random() * this.quadTree.height / 2 - this.quadTree.halfHeigth / 2
                    )
                ),
                1
            );

            tobj.transform.setParent(this.transform);
            this.testObjects.push(tobj);
            game.scene?.addGameObject(tobj);
            this.quadTree.insetObject(tobj);
        }
    }

    update(): void {
        this.transform.rotation += 1 * game.deltaTime;
        this.quadTree = new QuadTreeNode(1000,1000,new Vector2(0,0),10);
        this.testObjects.forEach(obj => {
            this.quadTree.insetObject(obj);
        })

        this.quadTree.show()

    }
}