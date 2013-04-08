#pragma strict

@script AddComponentMenu("Props/PickupItem")

var itemType : InventoryItem;
var itemAmount = 1;

private var pickedUp : boolean = false;

function Reset () {
	if (collider == null)
	{
		gameObject.AddComponent(CapsuleCollider);
	}
	collider.isTrigger = true;
}

function OnTriggerEnter(collider : Collider) {
	var playerStatus : ManStatus = collider.GetComponent(ManStatus);
	if (playerStatus == null)
	{
		return;
	}
	if (pickedUp)
	{
		return;	
	}
	var manInventory = collider.GetComponent(ManInventory);
	manInventory.GetItem(itemType, itemAmount);
	pickedUp = true;
	Debug.Log("pickup");
	Destroy(gameObject);
}

