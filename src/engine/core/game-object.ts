import Component from "./component.js";
import Transform from "../math/transform.js";

export default class GameObject {
    name: string; // Name of the game object
    components: Component[] = []; // List of attached components
    renderComponents:Component[] = [];
    transform: Transform; // Transform defining position, rotation, and scale
    zIndex: number; // Rendering order

    constructor(name: string, components: Component[], transform: Transform, zIndex = 0) {
        this.name = name;
        
        this.transform = transform;
        this.zIndex = zIndex;

        for (const componentA of components) {
            componentA.transform = this.transform;
            
            
            if(componentA.isRender){
                this.renderComponents.push(componentA);
            }else{
                this.components.push(componentA);
            }

            //TODO: Remove the duplicate Removal

            // Remove duplicate components of the same type
            for (const componentB of components) {
                if (componentA !== componentB && componentA.constructor === componentB.constructor) {
                    const duplicateIndex = components.indexOf(componentB);
                    components.splice(duplicateIndex, 1);
                }
            }
        }
    }

    start(): void {
        this.transform.gameObject = this; // Link the transform to this GameObject
        for (const component of this.components) {
            component.start(); // Initialize each component
        }
        for (const component of this.renderComponents){
            component.start();
        }
    }

    update(): void {
        for (const component of this.components) {
            component.update(); // Update each component
        }
    }

    render(){
        for(const component of this.renderComponents){
            component.update();
        }
    }

    addComponent(component: Component): void {

        //TODO: Remove the duplicate Removal

        // Prevent adding duplicate components of the same type
        for (const existingComponent of this.components) {
            if (existingComponent.constructor === component.constructor) {
                console.warn(`Component of type ${component.constructor.name} already exists on GameObject ${this.name}.`);
                return;
            }
        }

        this.components.push(component);
        component.transform = this.transform; // Link the new component to the GameObject's transform
    }

    removeComponent(component: Component): void {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1); // Remove the component if it exists
        }else{
            throw new Error(`component: ${component.constructor.name} dose not exsistt on: ${this.name}`);
        }
    }

    hasComponent<T extends Component>(componentType: new (...args: any[]) => T): boolean {
        // Check if a component of the specified type exists
        return this.components.some(component => component instanceof componentType);
    }

    getComponent<T extends Component>(componentType: new (...args: any[]) => T): T | undefined {
        // Retrieve a component of the specified type, if it exists
        return this.components.find(component => component instanceof componentType) as T | undefined;
    }
}
