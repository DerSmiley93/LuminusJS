import Component from "./component.js";
import Transform from "../math/transform.js";

export default class GameObject {
    name: string;
    components: Component[];
    transform: Transform;
    zIndex: number; // Z index for rendering order

    constructor(name: string, components: Component[], transform: Transform,zIndex = 0) {
        this.name = name;
        this.components = components;
        this.transform = transform;
        this.zIndex = zIndex;
        
        for (const component of components) {
            component.transform = this.transform;
        }

    }

    start(): void {
        this.transform.gameObject = this;
        for (const component of this.components) {
            component.start();
        }
    }

    update(): void {
        for (const component of this.components) {
            component.update();
        }
    }

    addComponent(component: Component): void {
        // Make sure that a game object can only have one instance of a component

        for (const existingComponent of this.components) {
            if (existingComponent.constructor === component.constructor) {
                console.warn(`Component of type ${component.constructor.name} already exists on GameObject ${this.name}.`);
                return;
            }
        }

        this.components.push(component);
        component.transform = this.transform; // Set the gameObject reference in the component
    }

    removeComponent(component: Component): void {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
        }

    }

    hasComponent<T extends Component>(componentType: new (...args: any[]) => T): boolean {
        for (const component of this.components) {
            if (component instanceof componentType) {
                return true;
            }
        }
        return false;
    }

    getComponent<T extends Component>(componentType: new (...args: any[]) => T): T | undefined {
        for (const component of this.components) {
            if (component instanceof componentType) {
                return component as T;
            }
        }
        return undefined;
    }
}