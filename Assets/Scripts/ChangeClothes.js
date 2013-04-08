#pragma strict

var clothes : Texture;
var face : Texture;

function Start () {
	renderer.materials[0].mainTexture = clothes;
	renderer.materials[1].mainTexture = clothes;
	renderer.materials[2].mainTexture = clothes;
	renderer.materials[3].mainTexture = face;
	renderer.materials[4].mainTexture = face;
}
