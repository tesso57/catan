import { Application } from "pixi.js";
import { Stage } from "./stage";
// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: "#1099bb", resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  const x = app.screen.width / 2;
  const y = app.screen.height / 2;
  const radius = 50;
  const level = 3;
  Stage(app, x, y, radius, level);
})();