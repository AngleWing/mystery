#pragma strict

@script AddComponentMenu("Enemies/MasterAnimation")

private var nextPlayIdle = 0.0;
var waitTime = 8.0;

var playerController : MasterAIController;

var walkAnimationSpeed = 2.5;
var runAnimationSpeed = 1.5;
var standAnimationSpeed = 2.0;

function Start () {
	playerController = GetComponent(MasterAIController);
	animation.Stop();
	
	//默认所有动画只播放一次
	animation.wrapMode = WrapMode.ClampForever;
	
	//设置动画层次即优先级，有利于分开各种其他动作
	if (animation["hurt"])
	{
		animation["hurt"].layer = 7;
	}
	
	if (animation["hit"])
	{
		animation["hit"].layer = 8;
	}
	
	var die = animation["die"];
	die.wrapMode = WrapMode.ClampForever;
	die.layer = 10;
	var attack = animation["attack"];
	attack.layer = 3;
	attack.wrapMode = WrapMode.Loop;
	
	var run = animation["run"];
	if (run)
	{
		run.speed *= runAnimationSpeed;
		run.layer = 1;
		run.wrapMode = WrapMode.Loop;
	}
	
	var walk = animation["walk"];
	if (walk)
	{
		walk.speed *= walkAnimationSpeed;
		walk.layer = 1;
		walk.wrapMode = WrapMode.Loop;
	}
	
	var stand = animation["stand"];
	if (stand)
	{
		stand.speed *= standAnimationSpeed;
		stand.wrapMode = WrapMode.Loop;
		animation.Play("stand");
	}
}

function Update () {
	if (playerController.IsMoving()) {
		if (!animation["walk"] || playerController.IsRunning()) {
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
		animation.Blend("attack", 0.0, 0.3);
		if (animation["walk"])
		{
			animation.Blend("walk", 0.0, 0.3);
		}
		animation.Blend("run", 0.0, 0.3);
		if (Time.time > nextPlayIdle) {
			nextPlayIdle = Time.time + waitTime;
			animation.CrossFade("stand", 0.5);
		}
	}
}

function PlayAttack() {
	animation.CrossFade("attack", 0.2);
//	yield WaitForSeconds(animation["attack"].length-0.2);
//	animation.Stop("attack");
}

function PlayHit() {
	animation.CrossFade("hit", 0.2);
	yield WaitForSeconds(animation["hit"].length-0.2);
	animation.Stop("hit");
}

function PlayHurt() {
	animation.CrossFade("hurt", 0.2);
}

function PlayDie() {
	animation.CrossFade("die", 0.2);
}

