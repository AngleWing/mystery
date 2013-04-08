#pragma strict

//追踪对象
var target : Transform;
//camera距对象距离
var distance = -300.0;
//camera距对象高度
var heightOffset = 200.0;
//camera移动速度
var springiness = 5.0;
//鼠标控制camera速度
var xSpeed = 120.0;
var ySpeed = 120.0;

var minX = -360.0;
var maxX = 360.0;
var minY = -20.0;
var maxY = 60.0;

private var x = 0.0;
private var y = 0.0;
private var sceneControll : SceneControll;
private var spaceBounds : Rect;
private var angle = 0.0;
private var axis = Vector3.zero;

function Awake () {
	sceneControll = FindObjectOfType(SceneControll);
	spaceBounds = sceneControll.GetBounds();
	transform.position = GetGoalPosition();
}

function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	//让刚体不要旋转
   	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function LateUpdate () {	
	if (Input.GetMouseButton(1) && target)
	{
		x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
 		
 		y = Mathf.Clamp(y, minY, maxY);
 		
        var rotation = Quaternion.Euler(y, x, 0);
        var position = rotation * Vector3(0, heightOffset, distance) + target.position;
        
//        Debug.Log(rotation);
        transform.rotation = rotation;
        rotation.ToAngleAxis(angle, axis);
//        Debug.Log(angle);
//        Debug.Log("axis");
//        Debug.Log(axis);
//        Debug.Log("pos");
//        Debug.Log(position);
//        Debug.Log("target");
//        Debug.Log(target.position);
        transform.position = position;
//        transform.LookAt(target);
	}
	else
	{
		var goalPosition = GetGoalPosition();
		transform.position = Vector3.Lerp(transform.position, goalPosition, Time.deltaTime * springiness);	
	}
}

function GetGoalPosition () {
	if (!target)
	{
		return transform.position;
	}
	
	//camera移动速度常数
	var velocityLookAhead = 0.15;
	var maxLookAhead = Vector3 (3.0, 3.0);

//	var forward = transform.TransformDirection(Vector3.forward);
//	forward.y = 0;
//	forward = forward.normalized;
//	var goalPosition = target.position + forward*distance + Vector3(0.0, heightOffset, 0.0);
	var goalPosition = target.position + transform.rotation*Vector3(0.0, heightOffset, distance);
//	Debug.Log(goalPosition);
	
	var targetVelocity = Vector3.zero;
	
	//检测目标是否是rigidbody
	var targetRigidbody = target.GetComponent (Rigidbody);
	if (targetRigidbody)
		targetVelocity = targetRigidbody.velocity;
	
	var targetPlatformerController = target.GetComponent(ManController);
	if (targetPlatformerController)
		targetVelocity = targetPlatformerController.GetVelocity();
	
	var lookAhead = targetVelocity * velocityLookAhead;
	
	// 边界检测
	lookAhead.x = Mathf.Clamp(lookAhead.x, -maxLookAhead.x, maxLookAhead.x);
	lookAhead.y = 0.0;
	lookAhead.z = Mathf.Clamp(lookAhead.z, -maxLookAhead.y, maxLookAhead.y);
	
	goalPosition += lookAhead;
	
	var clampOffset = Vector3.zero;
	
	var cameraPositionSave = transform.position;
	transform.position = goalPosition;
	
	//target在viewport中的位置
	var targetViewportPosition = camera.WorldToViewportPoint(target.position);
	//viewport右上角在world坐标中的位置
	var upperRightCameraInWorld = camera.ViewportToWorldPoint(Vector3(1.0, 1.0, targetViewportPosition.z));
	//边界偏移控制
	clampOffset.x = Mathf.Min((spaceBounds.xMax - upperRightCameraInWorld.x), 0.0);
	clampOffset.y = Mathf.Min((spaceBounds.yMax - upperRightCameraInWorld.y), 0.0);
	
	goalPosition += clampOffset;
	
	transform.position = goalPosition;
	//viewport左下角在world坐标中的位置
	var lowerLeftCameraInWorld = camera.ViewportToWorldPoint (Vector3 (0.0, 0.0, targetViewportPosition.z));
	
	clampOffset.x = Mathf.Max((spaceBounds.xMin - lowerLeftCameraInWorld.x), 0.0);
	clampOffset.y = Mathf.Max((spaceBounds.yMin - lowerLeftCameraInWorld.y), 0.0);
	
	goalPosition += clampOffset;
	
	transform.position = cameraPositionSave;
	
	return goalPosition;
}
