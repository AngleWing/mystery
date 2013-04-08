#pragma strict

import System.Reflection; 

class LevelStatus{
	var levelNum : int;
	var health : float;
	var energy : float;
	var damage : float;
	var defence : float;
	var exp : float;
}

enum LevelConstant {
	LEVELNUM,
	HEALTH,
	ENERGY,
	DAMAGE,
	DEFENCE
} 

static var levels : LevelStatus[];
var levelStr : Component;

function Start () {
	levelStr = GetComponent("ReadLevel");
//	var filedInfo : FiledInfo = levelStr.GetType().GetField("levelStatus");
//	var x : String[][] = new string[5][5];
//	x = filedInfo.GetValue(levelStr);
	levels = new LevelStatus[5];
//	for (var i=0; i<5; i++)
//	{
//		levels[i].levelNum = i;
//		var str;
//		levelStr.SendMessage("GetValue", i, str);
//		levels[i].health = float.Parse(str);
//		str = levelStr.GetValue(i, LevelConstant.ENERGY);
//		levels[i].energy = float.Parse(str);
//		str = levelStr.GetValue(i, LevelConstant.DAMAGE);
//		levels[i].damage = float.Parse(str);
//		str = levelStr.GetValue(i, LevelConstant.DEFENCE);
//		levels[i].defence = float.Parse(str);
//	}
}
