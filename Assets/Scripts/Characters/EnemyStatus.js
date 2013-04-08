#pragma strict

@script AddComponentMenu("Enemies/EnemyStatus")

var health : float = 50;
var energy : float = 50;

var live : boolean = true;
var level : LevelStatus;

var potrait : Texture2D;
private var animationState : MasterAnimation;

//所带物品,死亡后掉落
var numHeldItemsMin = 1;
var numHeldItemsMax = 2;
var pickup : GameObject;

var isDestoryAfterDie : boolean = true;

var deathSound : AudioClip;

function Start () {
	animationState = GetComponent(MasterAnimation);
}

function ApplyDamage(damage : float) {
	Debug.Log(damage);
	if (health <=0)
	{
		return;
	}
	health -= damage - level.defence;
	animationState.PlayHit();
	if (live && health <= 0)
	{
		health = 0;
		live = false;
		Die();
	}
}

function Die() {
	Debug.Log("Enemy Die");
	live = false;
	if (deathSound)
	{
		audio.clip = deathSound;
		audio.Play();
	}
	animationState.PlayDie();
	if (isDestoryAfterDie)
	{
		Destroy(gameObject.GetComponent(MasterAIController));
	}
	else
	{
		gameObject.GetComponent(MasterAIController).SetStartMoving(false);
	}
	yield WaitForSeconds(animation["die"].length - 0.5);
	//掉落物品
	var itemLocation = transform.position;
	yield WaitForSeconds(0.5);
	var rewardItems = Random.Range(numHeldItemsMin, numHeldItemsMax);
	for (var i=0; i<rewardItems; i++)
	{
		var randomItemLocation = itemLocation;
		randomItemLocation.x += Random.Range(-20, 20);
		randomItemLocation.y += 50;
		randomItemLocation.z += Random.Range(-20, 20);
		
		Instantiate(pickup, randomItemLocation, pickup.transform.rotation);
	}
	if (isDestoryAfterDie)
	{
		Destroy(gameObject);
	}
	
	GameObject.FindGameObjectWithTag("MainCamera").GetComponent(SceneControll).ChangeMode();
}