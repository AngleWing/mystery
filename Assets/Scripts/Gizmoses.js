#pragma strict

function Start () {

}

function OnDrawGizmos () {
	Gizmos.color = Color (1.00, 0.00, 0.00, 0.2);
	var bounds : Bounds = collider.bounds;
	
	Gizmos.DrawCube(bounds.center, bounds.size);
}
