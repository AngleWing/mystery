#pragma strict
//添加到Component列表中Players->ManController中
@script AddComponentMenu("Players/ManController")

var walkSpeed = 60.0;
var runSpeed = 130.0;
var gravity = 20.0;
var rotateSpeed = 4.0;
//动作流畅性
var speedSmothing = 40.0;
var rotationSmothing = 10.0;

var isControllable : boolean = true;
private var status : ManStatus;

private var speed = 0.0;
private var direction = Vector3.zero;
private var grounded : boolean = true;
private var isMoving : boolean = false;
private var isRunning : boolean = false;
private var velocity : Vector3;

private var controller : CharacterController;
private var lastY : float = 0.0;

function Awake () {
	controller = GetComponent(CharacterController);
	status = GetComponent(ManStatus);
}

//用于处理rigidbody和物理计算
function SmoothMove() {
	if (!isControllable)
	{
		Input.ResetInputAxes();
	}
	else
	{
		var cameraTransform = Camera.main.transform;
		
		//相对于照相机的forward向量	
		var forward = cameraTransform.TransformDirection(Vector3.forward);
		forward.y = 0;
		forward = forward.normalized;
//		Debug.Log(forward);
	
		//与forward向量正交的右向量
		var right = Vector3(forward.z, 0, -forward.x);
					
		var xOffset = Input.GetAxisRaw("Horizontal");
		var zOffset = Input.GetAxisRaw("Vertical");
		var currentTransform : Vector3 = Vector3.zero;
		if (grounded)
		{
			isMoving = (Mathf.Abs(xOffset) > 0.1) || (Mathf.Abs(zOffset) > 0.1);
			//相对于照相机的位置
			var targetDirection = xOffset * right + zOffset * forward;
			if (isMoving && targetDirection != Vector3.zero) {
//				Debug.Log(targetDirection);
//				Debug.Log(cameraTransform.position);
				direction = targetDirection.normalized;	
				direction.y = lastY;
			}

			//使	速度平滑变化
			var nowSmooth = speedSmothing * Time.deltaTime;
			var targetSpeed = Mathf.Min(targetDirection.magnitude, 1.0);;
			targetSpeed *= walkSpeed;
			if (Input.GetButton("Run"))
			{
				targetSpeed *= runSpeed / walkSpeed;
				isRunning = true;
			}
				
			speed = Mathf.Lerp(speed, targetSpeed, nowSmooth);
			var lastPosition = transform.position;
//			Debug.Log(direction);
			currentTransform = direction * speed;
//			Debug.Log(currentTransform);
			if (Input.GetButtonUp("Run"))
			{
				isRunning = false;
			}
		}
		direction.y -= gravity * Time.deltaTime;
		lastY = direction.y;
//		Debug.Log(direction.y);
		currentTransform.y = direction.y;
//		currentTransform += Vector3(0.0, -gravity*Time.deltaTime, 0.0);
		currentTransform *= Time.deltaTime;

		//flags是碰撞参数，保存碰撞的地方
//		var change = currentTransform-transform.position;
//		Debug.Log(change);
//		Debug.Log(currentTransform);
		var flags = controller.Move(currentTransform);
//		Debug.Log(transform.position);
//		var change1 = transform.position - lastPosition;
//		Debug.Log(change1);
		velocity = (transform.position - lastPosition) / Time.deltaTime;
		var dir : Vector3 = new Vector3(direction.x, 0, direction.z);
		if (dir.sqrMagnitude > 0.01) {
			transform.rotation = Quaternion.Slerp(transform.rotation, 
													Quaternion.LookRotation(dir), 
													Time.deltaTime * rotationSmothing);	
		}
	}
}

function FixedUpdate() {
	SmoothMove();
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

function IsGrounded() {
	return grounded;
}