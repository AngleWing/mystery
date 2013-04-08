#pragma strict

@script AddComponentMenu("Players/ManAttack");

var attackTime = 0.5;
var attackPosition : Vector3 = new Vector3(0.0, 1.0, 0.0);
var attackRadius = 30;
private var status : ManStatus;

private var busy : boolean = false;
private var attackLocation : Vector3;
var enemy : GameObject;
private var enemyStatus : EnemyStatus;
private var enemyController : CharacterController;
private var animationState : HeroAnimation;

private var controller : ManController;

var attackSound : AudioClip;

function Start () {
	status = GetComponent(ManStatus);
	animationState = GetComponent(HeroAnimation);
	controller = GetComponent(ManController);
	if (enemy)
	{
		enemyStatus = enemy.GetComponent(EnemyStatus);
		enemyController = enemy.GetComponent(CharacterController);
	}
}

function Update () {
	var changed = GUI.changed;
	if (controller.isControllable && !busy && !changed
		 && Input.GetButton("Attack") && controller.IsGrounded() && !controller.IsMoving())
	{
		DidAttack();
		busy = true;
	}
}

function DidAttack() {
	Debug.Log("person attack");
	status.SetIsAttacking(true);
	if (attackSound)
	{
		audio.clip = attackSound;
		audio.Play();
	}
	animationState.PlayAttack();
	yield WaitForSeconds(animationState.attackTime);
	attackLocation = transform.TransformPoint(attackPosition);
	
	//敌人位置偏移
	var enemyOffset = enemyController.center;
	enemyOffset.y = 0;
	Debug.Log(Vector3.Distance(enemy.transform.position+enemyOffset, attackLocation));
	if (Vector3.Distance(enemy.transform.position+enemyOffset, attackLocation)
			 < attackRadius + enemyController.radius)
	{
//		Debug.Log(status.level.damage);
		enemyStatus.ApplyDamage(status.level.damage);
	}
	status.SetIsAttacking(false);
	yield WaitForSeconds(attackTime);
	busy = false;
}