#pragma strict

@script AddComponentMenu("Players/ManInventory")

enum InventoryItem{
	HEALTH_POTION,
	ENERGY_POTION,
	CRYSTAL,		//最后的冰魄
	COUNT		//背包物品数
}

//背包
var manInventory : int[];

var playerStatus : ManStatus;

//恢复物品恢复值
private var healthHealAmt = 20.0;
private var energyHealAmt = 20.0;

function Awake () {
	playerStatus = GetComponent(ManStatus);
	manInventory = new int[InventoryItem.COUNT];
	for (var item in manInventory)
	{
		manInventory[item] = 0;
	}
	
	manInventory[InventoryItem.HEALTH_POTION] = 1;
	manInventory[InventoryItem.ENERGY_POTION] = 1; 
}

//获得物品
function GetItem(item : InventoryItem, amount : int) {
	manInventory[item] += amount; 
}

//使用物品
function UseItem(item : InventoryItem) {
	if (manInventory[item] <= 0)
	{
		return;
	}
	manInventory[item] -= 1;
	switch(item){
		case InventoryItem.HEALTH_POTION:
			playerStatus.AddHealth(healthHealAmt);
			break;
		case InventoryItem.ENERGY_POTION:
			playerStatus.AddEnergy(energyHealAmt);
			break;
	}
}

//物品数
function GetItemCount(item : InventoryItem) {
	return manInventory[item];
}