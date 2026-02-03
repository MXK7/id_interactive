import type { Scene } from "../types";

export const SCENES: Scene[] = [
	{
		id: "landing",
		type: "landing",
		title: "SAN ANDREAS",
		subtitle: "2026",
		tagline: "LA VILLE OÙ TOUT EST À PRENDRE",
	},
	{
		id: "intro",
		type: "hero",
		title: "VI",
		subtitle: "",
		quote: '"THE ONLY THING THAT MATTERS IS WHO YOU KNOW AND WHAT YOU GOT."',
		background: "/Lucia_Caminos_Video_Clip.mp4",
		isVideo: true,
	},
	{
		id: "scene-1",
		type: "parallax",
		title: "LEONIDA",
		subtitle: "VICE CITY • 2026",
		text: "Une ville de néons et de mensonges. Où le soleil brûle aussi fort que les ambitions.",
		background: "/test1.png",
	},
	{
		id: "scene-2",
		type: "split",
		title: "LUCIA",
		subtitle: "THE SURVIVOR",
		text: "Proin eget laoreet magna. Curabitur fermentum accumsan dictum. Donec eleifend metus sit amet nisl ultricies, et pharetra turpis facilisis. Curabitur pulvinar malesuada accumsan. Nam condimentum urna et laoreet scelerisque. Aliquam feugiat accumsan erat, sit amet pulvinar sapien sodales eu. Nulla varius ac nunc vitae rutrum. Nam quis nunc porttitor, facilisis velit in, rutrum sem. Aliquam pulvinar purus tellus, sed pulvinar ante posuere eleifend. Nunc leo metus, rutrum eget ornare nec, sollicitudin et nibh. Aenean congue magna scelerisque magna tempus dapibus. Nam feugiat pulvinar imperdiet. Vestibulum arcu enim, sodales eu malesuada ut, volutpat in sapien. Fusce vitae purus et nibh faucibus imperdiet. Pellentesque interdum, ipsum et hendrerit convallis, urna libero blandit purus, in interdum odio mauris ullamcorper purus. Fusce ullamcorper justo vel lectus pretium, in imperdiet enim cursus.",
		side: "left",
		image: "/43-2.png",
	},
	{
		id: "scene-3",
		type: "parallax",
		title: "THE STREETS",
		subtitle: "REMEMBER EVERYTHING",
		text: "Chaque corner a une histoire. Chaque deal a un prix.",
		background: "https://i.redd.it/h796v3fl7br21.png",
	},
	{
		id: "scene-4",
		type: "split",
		title: "POWER",
		subtitle: "COMES AT A COST",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lectus eros, suscipit non mauris non, blandit vulputate ligula. Quisque iaculis magna sed dui mollis, nec pellentesque enim laoreet. Ut et ultricies massa. Nunc feugiat nibh sit amet luctus vestibulum. Curabitur aliquet justo eget erat facilisis dignissim. Sed elit quam, vestibulum nec mi at, molestie tristique nisl. Vivamus rhoncus, quam consequat fermentum auctor, ipsum justo faucibus lacus, quis dapibus lectus purus vel arcu. Praesent accumsan velit et metus tristique, nec sollicitudin ex malesuada. Fusce consequat lacinia commodo. Donec congue maximus quam, et cursus leo lobortis eget. Sed id tellus vitae ipsum efficitur bibendum sed eu neque. Etiam sollicitudin volutpat magna ut mollis.",
		side: "right",
		image: "https://i.pinimg.com/1200x/65/17/60/6517605f120f04db1292c37da63b7460.jpg",
	},
	{
		id: "scene-5",
		type: "fullscreen-text",
		words: ["EVERY", "CHOICE", "HAS", "CONSEQUENCES"],
	},
	{
		id: "finale",
		type: "finale",
		title: "YOUR STORY",
		subtitle: "BEGINS NOW",
		text: "Bienvenue à Vice City.",
	},
];

export type SceneType = Scene["type"];
