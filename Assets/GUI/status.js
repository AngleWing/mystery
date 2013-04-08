#pragma strict
var window:GUIStyle;//对话框窗口的样式
var styleLab1:GUIStyle;
var styleLab2:GUIStyle;
var blood_red:GUIStyle;
var top:GUIStyle;
var blood_black:GUIStyle;
var health : float[];
var maxHealth : float[];
var level : int[];

var sceneControll : SceneControll;

function Start() {
	if (!sceneControll)
	{
		sceneControll = GetComponent(SceneControll);
	}
	health = new float[2];
	health[0] = sceneControll.playerStatus.health;
	health[1] = sceneControll.enemyStatus.health;
	maxHealth = new float[2];
	maxHealth[0] = sceneControll.playerStatus.level.health;
	maxHealth[1] = sceneControll.enemyStatus.level.health;
	styleLab1.normal.background = sceneControll.playerStatus.potrait;
	styleLab2.normal.background = sceneControll.enemyStatus.potrait;
	level = new int[2];
	level[0] = sceneControll.playerStatus.level.levelNum;
	level[1] = sceneControll.enemyStatus.level.levelNum;
}

function OnWindow(winid:int){  

  GUI.color=Color.white; 
  GUI.DragWindow();
}

function OnGUI(){
GUI.Box(Rect(10,10,150,120),"",window);
GUI.Label(Rect(10,10,150,10),"        LEVEL        BLOOD",top);

	if (sceneControll.playerStatus)
	{
 		level[0] = sceneControll.playerStatus.level.levelNum;
		health[0] = sceneControll.playerStatus.health;
 	}
 	if (sceneControll.enemyStatus)
 	{
		level[1] = sceneControll.enemyStatus.level.levelNum;
		health[1] = sceneControll.enemyStatus.health;
	}
 GUI.Label(Rect(15,20,20,30),"",styleLab1);    
  GUI.Label(Rect(50,25,20,20),level[0].ToString()); 
  
  GUI.Label(Rect(15,60,20,30),"",styleLab2);
   GUI.Label(Rect(50,65,20,20),level[1].ToString());   


  //根据当前血量计算红色血条显示的宽度
  var blood_width = 80 * health[0]/maxHealth[0];
  //绘制黑色血条
  GUI.Button(Rect(70,30,80,8),"",blood_black);
  //绘制红色血条
  GUI.Button(Rect(70,30,blood_width,8),"",blood_red);
  //绘制黑色血条
  GUI.Button(Rect(70,70,80,8),"",blood_black);
  blood_width = 80 * health[1]/maxHealth[1];
  //绘制红色血条
  GUI.Button( Rect(70,70,blood_width,8),"",blood_red);


}




