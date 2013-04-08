#pragma strict

@script AddComponentMenu("Enemies/MasterAIController")

var startMoving : boolean = false;

var walkSpeed = 80.0;
var runSpeed = 170.0;
var gravity = 20.0;
var rotateSpeed = 18.0;
//动作流畅性
var speedSmothing = 40.0;
var rotationSmothing = 10.0;

//活动范围
var bounds : Rect;
//游荡时间
var directionTravelTime = 2.0;
var idleTime = 1.5;
//检测到攻击距离
var attackDistance = 100.0;
//攻击距离
var minAttackDistance = 50.0;

var viewAngle = 20.0;
//攻击区域大小
var attackRadius = 20.0;
//攻击时间
var attackTime : float;
//攻击位置
var attackPosition : Vector3 = new Vector3(0, 1, 0);
//攻击对象
var target : Transform;

private var status : EnemyStatus;

private var speed = Vector3.zero;
private var direction = Vector3.zero;
private var grounded : boolean = true;
private var isMoving : boolean = false;
private var isRunning : boolean = false;
private var velocity : Vector3;

private var isAttacking : boolean = false;
private var lastAttackTime : float = 0.0;
//攻击之间有个暂停时间，供玩家反击
private var nextPauseTime : float = 0.0;
private var distanceToPlayer : Vector3;
//改变方向时间
private var timeToNewDirection = 0.0;

private var controller : CharacterController;
private var animationState : MasterAnimation;

var attackSound : AudioClip;

function Awake () {
	controller = GetComponent(CharacterController);
	status = GetComponent(EnemyStatus);
	animationState = GetComponent(MasterAnimation);
}

function Start() {
	if (!target)
	{
		target = GameObject.FindWithTag("Player").transform;
	}
	
	yield WaitForSeconds(idleTime);
	
	Running();
}

function Idle() {
	while (!isAttacking) {
		animation.Blend("attack", 0.0, 0.3);
		if (Time.time > timeToNewDirection)
		{
			isMoving = false;
			yield WaitForSeconds(idleTime);
//			Debug.Log("ChangeDir");
			if (Random.value > 0.5)
			{
				transform.Rotate(Vector3(0, 50, 0), rotationSmothing);
			}
			else 
			{
				transform.Rotate(Vector3(0, -50, 0), rotationSmothing);
			}
			timeToNewDirection = Time.time + directionTravelTime;
		}
		var walkForward = transform.TransformDirection(-Vector3.forward);
		var direction = walkForward * walkSpeed;
//		Debug.Log(walkForward);
		var goalPosition = transform.position + direction;
		//活动范围控制
		if (goalPosition.x > bounds.xMax)
		{
			direction.x = bounds.xMax - transform.position.x;
		}
		else if (goalPosition.x < bounds.xMin)
		{
			direction.x = bounds.xMin - transform.position.x;
		}
		if (goalPosition.z > bounds.yMax)
		{
			direction.z = bounds.yMax - transform.position.z;
		}
		else if (goalPosition.z < bounds.yMin)
		{
			direction.z = bounds.yMin - transform.position.z;
		}
//		Debug.Log("move");
		var distance = goalPosition - target.position;
//		Debug.Log(distance.magnitude);
		if (distance.magnitude > minAttackDistance) {
//			Debug.Log("move");
//			Debug.Log(transform.position);
			isMoving = true;
			controller.SimpleMove(direction);
//			Debug.Log(transform.position);
		}
		
		distanceToPlayer = transform.position - target.position;
//		Debug.Log(distanceToPlayer.magnitude);
		if (distanceToPlayer.magnitude < attackDistance) {
			return;
		}
		yield;
	}
}

function Attack() {
	isAttacking = true;
	if (attackSound)
	{
		audio.clip = attackSound;
		audio.Play();
	}
	animationState.PlayAttack();
	
	//使面向玩家并向玩家移动
	var angle = 0.0;
	var time = 0.0;
	var direction : Vector3;
	while (angle > viewAngle || time < attackTime) 
	{
		time += Time.deltaTime;
		angle = Mathf.Abs(FacePlayer());
		Debug.Log(angle);
		Debug.Log(time);
		var move = Mathf.Clamp01(Mathf.Abs(90-angle)/90);
		//调整动画的速度及混合权重
		animation["attack"].weight = animation["attack"].speed = move;
//		var distance = transform.position - target.position;
//		if (distance.magnitude )
		direction = transform.TransformDirection((-Vector3.forward)*runSpeed*move);
//		isMoving = true;
		var goalPosition = transform.position + direction;
		//活动范围控制
		if (goalPosition.x > bounds.xMax)
		{
			direction.x = bounds.xMax - transform.position.x;
		}
		else if (goalPosition.x < bounds.xMin)
		{
			direction.x = bounds.xMin - transform.position.x;
		}
		if (goalPosition.z > bounds.yMax)
		{
			direction.z = bounds.yMax - transform.position.z;
		}
		else if (goalPosition.z < bounds.yMin)
		{
			direction.z = bounds.yMin - transform.position.z;
		}
		var distance = goalPosition - target.position;
//		Debug.Log(distance.magnitude);
		if (distance.magnitude > minAttackDistance) {
//			Debug.Log("move");
//			Debug.Log(transform.position);
			controller.SimpleMove(direction);
//			Debug.Log(transform.position);
		}
		yield;
	}
	
	//使能看到玩家
	var lostSight = false;
	while (!lostSight) 
	{
		Debug.Log("sight");
		angle = Mathf.Abs(FacePlayer());
//		Debug.Log(angle);
		if (Mathf.Abs(angle-180) > viewAngle)
		{
			Debug.Log("lose sight");
			lostSight = true;
		}
		if (lostSight)
		{
			break;
		}
		
		//检查玩家是否还在攻击范围内
		var positionOffset = controller.center;
		positionOffset.y = 0;
		var location = transform.TransformPoint(attackPosition) + positionOffset - target.position;
		Debug.Log(location.magnitude);
		if (Time.time > lastAttackTime + 1.0 && location.magnitude < attackRadius + minAttackDistance)
		{
			target.SendMessage("ApplyDamage", status.level.damage);
			lastAttackTime = Time.time;
		}
		
		if (location.magnitude > attackRadius)
		{
			break;
		}
		//检查有没有碰到其他东西
		if (controller.velocity.magnitude < runSpeed * 0.3)
		{
			break;
		}
		yield;
	}
	isAttacking = false;
}

function Running() {
	while (startMoving)
	{
		yield Idle();
		Debug.Log("attack");
		yield Attack();
	}
}

function SetStartMoving(moving : boolean) {
	startMoving = moving;
	if (moving) {
		yield Running();
	}
}

function FacePlayer() : float {
	var relativeLocation = transform.InverseTransformPoint(target.position);
	//旋转角度
	var angle = Mathf.Atan2(relativeLocation.x, relativeLocation.z)*Mathf.Rad2Deg;
	//控制最大旋转
	var maxRotation = rotateSpeed * Time.deltaTime;
	var clampedAngle = Mathf.Clamp(angle, -maxRotation, maxRotation);
	Debug.Log("rotate");
	transform.Rotate(0, -clampedAngle, 0);
	
	return angle;
}

function GetVelocity() {
	return velocity;
}

function IsMoving() {
	return isMoving;
}

function IsRunning() {
	return isRunning;
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
