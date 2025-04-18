# LuminusJS

A lightweight, TypeScript-based 2D game engine that runs in the browser.

## Features

- **Component-Based Architecture**: Build games using reusable components
- **Scene Management**: Easily manage different game scenes
- **Asset Management**: Efficient handling of sprites and sprite atlases
- **Camera System**: Flexible camera controls with zoom and rotation support
- **Shape Rendering**: Built-in support for 2D shapes with customizable fill and stroke
- **Sprite Rendering**: Support for individual sprites and sprite atlases
- **Transform System**: Hierarchical transform system with position, rotation, and scale
- **Math Utilities**: Comprehensive vector and geometry utilities
- **Debug Tools**: Built-in profiler for performance monitoring

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/LuminusJS.git
```

2. Install the required packages:
```bash
npm install
```
```bash
npm install
```

3. Run the TypeScript compiler in watch mode:
```bash
npm run watch
```

4. Serve `index.html` using a lightweight development server. For example, you can use `lite-server`:

    Install `lite-server` globally:
    ```bash
    npm install -g lite-server
    ```

    Run the server:
    ```bash
    lite-server
    ```

    Alternatively, you can use `http-server`:
    ```bash
    npx http-server
    ```

## Creating a Basic Scene

```typescript
import Scene from "./engine/core/scene.js";
import GameObject from "./engine/core/game-object.js";
import Transform from "./engine/math/transform.js";
import Camera from "./engine/default-components/camera.js";

// Create a camera
const mainCamera = new GameObject('MainCamera', [
    new Camera(1) // zoom level of 1
], new Transform());

// Create your scene
const myScene = new Scene([
    mainCamera,
    // Add more game objects here
]);

// Load the scene
game.loadScene(myScene);
```

## Components

LuminusJS uses a component-based architecture. Some built-in components include:

- `Camera`: Handles view rendering
- `ShapeRenderer2D`: Renders basic 2D shapes
- `SpriteRenderer`: Renders sprites
- `Transform`: Handles position, rotation, and scale

## Asset Management

The engine includes an asset management system for handling:
- Individual sprites
- Sprite atlases (sprite sheets)
- Future asset types can be easily added

## Project Structure

```
src/
  ├── engine/              # Core engine components
  │   ├── core/           # Core functionality (Scene, GameObject, etc.)
  │   ├── math/           # Math utilities (Vector2, Transform, etc.)
  │   ├── debug/          # Debugging tools
  │   └── external/       # Asset management and external resources
  └── components/         # Your custom game components
```

## Contributing

This project is open source. Feel free to contribute by:
1. Forking the repository
2. Creating your feature branch
3. Committing your changes
4. Opening a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
