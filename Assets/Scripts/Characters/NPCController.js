#pragma strict

@script AddComponentMenu("NPC/NPCController")

private var nextPlayIdle = 0.0;
var waitTime = 8.0;
var standAnimationSpeed = 2.0;

private var playerController : ManController;
var player : Transform;

var minTalkDistance : float = 50.0;

function Start () {
	animation.Stop();
	
	var stand = animation["stand"];
	if (stand)
	{
		stand.speed *= standAnimationSpeed;
		stand.wrapMode = WrapMode.Loop;
		animation.Play("stand");
	}
	if (!player)
	{
		player = GameObject.FindGameObjectWithTag("Player").GetComponent(Transform);
	}
	playerController = player.GetComponent(ManController);
}

function Update () {
	if (Time.time > nextPlayIdle) {
		nextPlayIdle = Time.time + waitTime;
		animation.CrossFade("stand", 0.5);
	}
	else
	{
		nextPlayIdle = Time.time + waitTime;
	}
	Debug.Log(Vector3.Distance(player.position, transform.position));
	if (Vector3.Distance(player.position, transform.position) < minTalkDistance)
	{
		//检查人物方向是否正常
		var offset : Vector3 = transform.TransformDirection(Vector3.forward) - Vector3.forward;
		if (offset != Vector3.zero)
		{
			var direction = player.position;
			transform.LookAt(player.position);
			transform.rotation.x = 0.0;
			transform.rotation.z = 0.0;
		}
		GameObject.FindGameObjectWithTag("MainCamera").GetComponent(SceneControll).Talking();
	}
}