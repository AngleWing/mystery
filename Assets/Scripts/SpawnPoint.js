#pragma strict

//最后一个激活的重生点
static var isActivePt : SpawnPoint;
var firstPt : SpawnPoint;

private var playerStatus : ManStatus;

function Start () {
	playerStatus = GameObject.FindWithTag("Player").GetComponent(ManStatus);
	isActivePt = firstPt;
	
	if (isActivePt == this)
	{
		BeActive();
	}
}

function OnTriggerEnter() {
	if (isActivePt != this) 
	{
		isActivePt.BeInactive();
		isActivePt = this;
		BeActive();
	}
}

function BeActive() {
	
}

function BeInactive() {
	
}