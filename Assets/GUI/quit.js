#pragma strict
var pause:boolean=false;
function OnGUI(){
if(GUI.Button(Rect(10,Screen.height - 100,40,20),"开始")){
pause=false;
OnApplicationPause(pause);

}
if(GUI.Button(Rect(10,Screen.height - 70,40,20),"暂停")){
pause=true;
OnApplicationPause(pause);

}
if(GUI.Button(Rect(10,Screen.height - 40,40,20),"退出")){
Application.Quit();
}

}
function OnApplicationPause (pause : boolean) {
if(pause==true){
Time.timeScale = 0;
}
else
{
	Time.timeScale = 1;
}
} 
