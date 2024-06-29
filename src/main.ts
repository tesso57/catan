import { Application, PI_2 } from "pixi.js";
import { Hexagon } from "./hexagon";
import { Stage } from "./stage";
// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();

  // Intialize the application.
  await app.init({ background: "#1099bb", resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  const x = 400;
  const y = 400;
  const radius = 100;
  const cnt = 2;
  Stage(app, x, y, radius);
  // const p1 = Hexagon(x, y, radius);
  // const p2 = Hexagon(x, y, radius);
  // p2.pivot.set(radius * Math.cos(-PI_2 / 4), radius * Math.sin(-PI_2 / 4));
  // p2.rotation = (-PI_2 / 6) * 2;
  // p2.y -= radius;
  // app.stage.addChild(p1, p2);
  // for (let i = 0; i < cnt; i++) {
  //   // const angle = (i * PI_2) / cnt;
  //   // const nx = radius * Math.cos(angle);
  //   // const ny = radius * Math.sin(angle);
  //   const p = Pentagon(x, y, radius);
  //   app.stage.addChild(p);
  // }
})();
