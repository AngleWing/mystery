#pragma strict

@script AddComponentMenu("Players/HeroAnimation")

private var nextPlayIdle = 0.0;
var waitTime = 8.0;

var playerController : ManController;

var walkAnimationSpeed = 2.5;
var runAnimationSpeed = 1.5;
var attackTime;
private var status : ManStatus;

function Start () {
	playerController = GetComponent(ManController);
	status = GetComponent(ManStatus);
	animation.Stop();
	
	//默认所有动画只播放一次
	animation.wrapMode = WrapMode.ClampForever;
	
	//设置动画层次即优先级，有利于分开各种其他动作
	var attack1 = animation["attack1"];
	attack1.layer = 3;
//	attack1.wrapMode = WrapMode.Loop;
	
	var attack2 = animation["attack2"];
	attack2.layer = 3;
//	attack2.wrapMode = WrapMode.Loop;
//	animation["hurt"].layer = 7;
	animation["hit1"].layer = 8;
	animation["hit2"].layer = 8;
	
	animation["die"].layer = 10;
	
	var run = animation["run"];
	run.speed *= runAnimationSpeed;
	run.layer = 1;
	run.wrapMode = WrapMode.Loop;
	
	var walk = animation["walk"];
	if (walk)
	{
		walk.speed *= walkAnimationSpeed;
		walk.layer = 1;
		walk.wrapMode = WrapMode.Loop;
	}
	
	animation["stand"].wrapMode = WrapMode.Loop;
	animation.Play("stand");
}

function Update () {
//	Debug.Log(animation.IsPlaying("attack1"));
//	Debug.Log(animation.IsPlaying("attack2"));
	if (playerController.IsMoving()) {
//		Debug.Log("move");
		if (!status.IsAttacking())
		{
//			Debug.Log("attack out");
			animation.Stop("attack1");
			animation.Stop("attack2");
		}
		if (playerController.IsRunning())
		{
			animation.CrossFade("run");
		}
		else
		{
			animation.CrossFade("walk");
		}
		nextPlayIdle = Time.time + waitTime;
	}
	else
	{
		Debug.Log("stand");
		if (!status.IsAttacking())
		{
//			Debug.Log("attack out");
			animation.Stop("attack1");
			animation.Stop("attack2");
		}
		animation.Blend("walk", 0.0, 0.3);
		animation.Blend("run", 0.0, 0.3);
		if (Time.time > nextPlayIdle) {
			nextPlayIdle = Time.time + waitTime;
			animation.CrossFade("stand", 0.5);
		}
	}
}

function PlayAttack() {
//	Debug.Log("attack in");
	if (Random.value > 0.5)
	{
//		animation.CrossFade("attack1", 0.2);
		animation.CrossFadeQueued("attack1", 0.1, QueueMode.PlayNow);
		attackTime = animation["attack1"].length;
	}
	else
	{
//		animation.CrossFade("attack2", 0.2);
		animation.CrossFadeQueued("attack2", 0.1, QueueMode.PlayNow);
		attackTime = animation["attack2"].length;
	}
}

function PlayHit() {
	var ani;
	if (Random.value > 0.5)
	{
		animation.CrossFade("hit1", 0.2);
		ani = "hit1";
	}
	else
	{
		animation.CrossFade("hit2", 0.2);
		ani = "hit2";
	}
	yield WaitForSeconds(animation[ani].length-0.2);
	animation.Stop(ani);
}

function PlayHurt() {
	animation.CrossFade("hurt", 0.2);
}

function PlayDie() {
	animation.CrossFade("die", 0.2);
}