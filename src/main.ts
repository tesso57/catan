import { Application, Graphics, Text } from "pixi.js";
import { Stage } from "./stage";
import { Slider } from "@pixi/ui";
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
	const level = 2;
	const stage = new Stage(x, y, radius, level);
	app.stage.addChild(stage.container);
	stage.Create(x, y);

	const width = 200;
	const height = 20;
	const bg = new Graphics().roundRect(0, 0, width, height).fill(0x000000);
	const fill = new Graphics().roundRect(0, 0, width, height).fill(0x00ff00);
	const slider = new Graphics().circle(0, 0, height / 2).fill(0xffffff);

	const singleSlider = new Slider({
		bg: bg,
		fill: fill,
		slider: slider,
		min: 0,
		max: 15,
		value: level,
	});
	singleSlider.x = 10;
	singleSlider.y = 10;
	const sliderText = new Text({
		text: `Value: ${singleSlider.value.toFixed(2)}`,
		style: { fill: 0x000000 },
		anchor: {
			x: 0,
			y: 0.1,
		},
	});

	sliderText.x = 30 + width;
	sliderText.y = 10;
	app.stage.addChild(singleSlider, sliderText);
	let time = 0;
	app.ticker.add((ticker) => {
		time += ticker.deltaMS;
		sliderText.text = `Value: ${singleSlider.value.toFixed(2)}`;
		if (time > 100) {
			time = 0;
			stage.level = Math.floor(singleSlider.value);
		}
	});
})();
