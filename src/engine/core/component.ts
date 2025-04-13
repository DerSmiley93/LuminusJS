import Transform from "../math/transform.js";
import GameObject from "./game-object.js";

export default interface Component {
    transform: Transform;
    start(): void;
    update(): void;
}