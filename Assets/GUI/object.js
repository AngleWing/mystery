#pragma strict
var style:GUIStyle;
var blood:GUIStyle;
var ice:GUIStyle;
var styleB:GUIStyle;
var box:GUIStyle;
var lab:GUIStyle;
var text:String;
var HP=10;//回血药
var numOfIce=0;//冰魄数量
private var windowRect:Rect=Rect(Screen.width/2-200,Screen.height/2-125,400,250);
var windowOpen:boolean=false;
var window:GUIStyle;

var inventory : ManInventory;

function Start() {
	if (!inventory)
	{
		inventory = GameObject.FindObjectOfType(ManInventory).GetComponent(ManInventory);
	}
	HP = inventory.GetItemCount(InventoryItem.HEALTH_POTION);
	numOfIce = inventory.GetItemCount(InventoryItem.CRYSTAL);
}

function OnWindowDraw(windowID:int){
if( GUI.Button(Rect(Screen.width/2-90,Screen.height/2,50,20),"close")){
  windowOpen=false;


		}
	
}
 

function OnGUI(){
 GUI.Box(Rect(Screen.width-120,10,30,30),"",box);
  GUI.Box(Rect(Screen.width-80,10,30,30),"",box);
   GUI.Box(Rect(Screen.width-40,10,30,30),"",box);
  
   
   
	HP = inventory.GetItemCount(InventoryItem.HEALTH_POTION);
	numOfIce = inventory.GetItemCount(InventoryItem.CRYSTAL);
   //点击图片回血药减少
   if(GUI.Button(Rect(Screen.width-117.5,12.5,25,25),"",blood)){
   	inventory.UseItem(InventoryItem.HEALTH_POTION);
   }
   //点击图片冰魄减少
   if(numOfIce>0){
   	GUI.Button(Rect(Screen.width-77.5,12.5,25,25),"",ice);
   }
   
  
   if( GUI.Button(Rect(Screen.width-37.5,12.5,25,25),"",styleB)){
  windowOpen=true;

		}
   
      GUI.Label(Rect(Screen.width-100,5,20,10)," "+HP,lab);
     GUI.Label(Rect(Screen.width-60,5,20,10)," "+numOfIce,lab);
     GUI.Label(Rect(Screen.width-120,40,30,20),"  回血",lab);
   GUI.Label(Rect(Screen.width-80,40,30,20),"  冰魄",lab);
   GUI.Label(Rect(Screen.width-40,40,30,20),"  帮助",lab);
   
 
  
		    if(windowOpen){
   windowRect = GUI.Window(0,windowRect,OnWindowDraw,"",window);	
 }
   
}
