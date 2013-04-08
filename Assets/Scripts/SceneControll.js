#pragma strict
//场景模式
enum Mode {
	FIGHT,
	TALK,
	END
}

var bounds : Rect;
var colliderThickness = 10.0;
var colliderHight = 500.0;

var player : Transform;
var playerStatus : ManStatus;
var playerController : ManController;

var enemy : Transform;
var enemyStatus : EnemyStatus;
var enemyController : MasterAIController;

var npc : Transform;
var npcController : NPCController;

var talkControll : TalkControll;
//当前模式
var modeIndex : int = -1;
//模式序列
var mode : Mode[] = new Mode[4];
//下一场景名字
var nextSceneName : String;

function Awake () {
	CreateBoundary();
	if (player == null)
	{
		player = GameObject.FindGameObjectWithTag("Player").GetComponent(Transform);
	}
	playerStatus = player.GetComponent(ManStatus);
	playerController = player.GetComponent(ManController);
	if (enemy == null)
	{
		enemy = GameObject.FindGameObjectWithTag("Enemy").GetComponent(Transform);
	}
	enemyStatus = enemy.GetComponent(EnemyStatus);
	enemyController = enemy.GetComponent(MasterAIController);
	if (npc == null) 
	{
		if (GameObject.FindGameObjectWithTag("NPC"))
			npc = GameObject.FindGameObjectWithTag("NPC").GetComponent(Transform);
	}
	if (npc)
		npcController = npc.GetComponent(NPCController);
	
	talkControll = GetComponent(TalkControll);
	ChangeMode();
}

function ChangeMode() {
	modeIndex++;
	if (mode[modeIndex] == Mode.END)
	{
		Application.LoadLevel(nextSceneName);
	}
	else if (mode[modeIndex] == Mode.FIGHT)
	{
		talkControll.SetIsTalking(false);
		playerController.isControllable = true;
		enemyController.SetStartMoving(true);
	}
	else
	{
		if (enemyController != null)
		{
			enemyController.SetStartMoving(false);
		}
		talkControll.talkID++;
		if (npc == null)
		{
			npc = GameObject.FindGameObjectWithTag("NPC").GetComponent(Transform);
			if (npc == null)
			{
				Talking();
			}
		}
	}
}

function Talking() {
	talkControll.SetIsTalking(true);
	playerController.isControllable = false;
	playerController.animation.Stop();
}

function OnDrawGizmos () {
	Gizmos.color = Color (1.00, 0.00, 0.00, 1.0);
	var lowerLeft = Vector3 (bounds.xMin, 0, bounds.yMax);
	var upperLeft = Vector3 (bounds.xMin, 0, bounds.yMin);
	var lowerRight = Vector3 (bounds.xMax, 0, bounds.yMax);
	var upperRight = Vector3 (bounds.xMax, 0, bounds.yMin);
	
	Gizmos.DrawLine (lowerLeft, upperLeft);
	Gizmos.DrawLine (upperLeft, upperRight);
	Gizmos.DrawLine (upperRight, lowerRight);
	Gizmos.DrawLine (lowerRight, lowerLeft);
}

function GetBounds () {
	return bounds;
}

function CreateBoundary() {
	var createdBoundaries = new GameObject("CreateBoundaries");
	createdBoundaries.transform.parent = transform;
	
	var boxCollider : BoxCollider;

	var leftBoundary = new GameObject("LeftBoundary");
	leftBoundary.transform.parent = createdBoundaries.transform;
	boxCollider = leftBoundary.AddComponent(BoxCollider);
	boxCollider.size = Vector3(colliderThickness, colliderHight, bounds.height + colliderThickness * 2.0);
	boxCollider.center = Vector3(bounds.xMin - colliderThickness * 0.5, colliderThickness * 0.5, bounds.y + bounds.height * 0.5);
	
	var rightBoundary = new GameObject("RightBoundary");
	rightBoundary.transform.parent = createdBoundaries.transform;
	boxCollider = rightBoundary.AddComponent(BoxCollider);
	boxCollider.size = Vector3(colliderThickness, colliderHight, bounds.height + colliderThickness * 2.0);
	boxCollider.center = Vector3(bounds.xMax + colliderThickness * 0.5, colliderThickness * 0.5, bounds.y + bounds.height * 0.5);
	
	var topBoundary = new GameObject("TopBoundary");
	topBoundary.transform.parent = createdBoundaries.transform;
	boxCollider = topBoundary.AddComponent(BoxCollider);
	boxCollider.size = Vector3(bounds.width + colliderThickness * 2.0, colliderHight, colliderThickness);
	boxCollider.center = Vector3(bounds.x + bounds.width * 0.5, colliderThickness * 0.5, bounds.yMax + colliderThickness * 0.5);
	
	var bottomBoundary = new GameObject("BottomBoundary");
	bottomBoundary.transform.parent = createdBoundaries.transform;
	boxCollider = bottomBoundary.AddComponent(BoxCollider);
	boxCollider.size = Vector3(bounds.width + colliderThickness * 2.0, colliderHight, colliderThickness);
	boxCollider.center = Vector3(bounds.x + bounds.width * 0.5, colliderThickness * 0.5, bounds.yMin - colliderThickness * 0.5);
	
	var bottom = new GameObject("Bottom");
	bottom.transform.parent = createdBoundaries.transform;
	boxCollider = bottom.AddComponent(BoxCollider);
	boxCollider.size = Vector3(bounds.width + colliderThickness*2.0, colliderThickness, bounds.height + colliderThickness*2.0);
	boxCollider.center = Vector3(bounds.x+bounds.width*0.5+colliderThickness, colliderThickness*0.5, bounds.y+bounds.height*0.5+colliderThickness);
}