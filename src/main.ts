import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { GameScene } from "./game";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 375, // Logical width and height in game pixels
  height: 667,
  displayMode: DisplayMode.FitScreenAndFill, // Display mode tells excalibur how to fill the window
  pixelArt: false, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    start: GameScene,
  },
  backgroundColor: Color.fromHex("#262626"), // Background color of the game
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

game
  .start("start", {
    // name of the start scene 'start'
    loader, // Optional loader (but needed for loading images/sounds)
    inTransition: new FadeInOut({
      // Optional in transition
      duration: 1000,
      direction: "in",
      color: Color.fromHex("#262626"),
    }),
  })
  .then(() => {
    // Do something after the game starts
  });
