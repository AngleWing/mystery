#pragma strict

@script AddComponentMenu("Players/ManStatus")

var health : float = 10.0;
var energy : float = 10.0;
var live : boolean = true;

var level : LevelStatus;
var potrait : Texture2D;
private var playerController : ManController;
private var animationState : HeroAnimation;
private var isAttacking : boolean = false;

var hitSound : AudioClip;
var deathSound : AudioClip;

function Start () {
	playerController = GetComponent(ManController);
	animationState = GetComponent(HeroAnimation);
}

function AddHealth (boost : float) {
	health += boost;
	if (health >= level.health)
	{
		health = level.health;
	}
}

function AddEnergy (boost : float) {
	energy += boost;
	if (energy >= level.energy)
	{
		energy = level.energy;
	}
}

function ApplyDamage (damage: float) {
	if (health <=0)
	{
		return;
	}
	Debug.Log(damage);
	health -= damage - level.defence;
	if (hitSound)
	{
		audio.clip = hitSound;
		audio.Play();
	}
	animationState.PlayHit();
	if (live && health <= 0)
	{
		health = 0;
		live = false;
		Die();
	}
}

function Die() {
	Debug.Log("Player Die");
	live = false;
	playerController.isControllable = false;
	if (deathSound)
	{
		audio.clip = deathSound;
		audio.Play();
	}
	
	animationState.PlayDie();
	yield WaitForSeconds(animation["die"].length - 0.2);
	
	HideMan();
	yield WaitForSeconds(1);
	if (SpawnPoint.isActivePt)
	{
		playerController.transform.position = SpawnPoint.isActivePt.transform.position;
		//防止卡在地面中
		playerController.transform.position.y += 15;
	}
	ShowMan();
	live = true;
	health = level.health;
	energy = level.energy;
}

function HideMan() {
	animation.Stop();
	GameObject.Find("ms_01").GetComponent(SkinnedMeshRenderer).enabled = false;
	playerController.isControllable = false;
}

function ShowMan() {
	GameObject.Find("ms_01").GetComponent(SkinnedMeshRenderer).enabled = true;
	playerController.isControllable = true;
}

function SetIsAttacking(attacking : boolean){
	isAttacking = attacking;
}

function IsAttacking() {
	return isAttacking;
}