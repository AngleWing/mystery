//#pragma strict

private var isTalking : boolean;
var talkID : int = 0;
private var talkingTime = 0.0;
var conversation;

function Start () {
	conversation = gameObject.GetComponent("ReadXml");
}

function Update() {
	conversation = gameObject.GetComponent("ReadXml");
	if (isTalking && talkingTime > 0)
	{
		talkingTime += Time.time;
		if (talkingTime > 0.5 && !conversation.WindowOpen())
		{
			GetComponent(SceneControll).ChangeMode();
		}
	}
}

function SetIsTalking(talking : boolean) {
	if (isTalking == talking)
	{
		return;
	}
	isTalking = talking;
	if (talking)
	{
		//与c#文件交互
//		gameObject.SendMessage("SetTalkID", talkID);
//		gameObject.SendMessage("SetWindowOpen");
		conversation.SetTalkID(talkID);
		conversation.SetWindowOpen(true);
		talkingTime = 0.1;
	}
}
