import * as THREE from 'three';
const PointerLockControls = require('three-pointerlock');

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();


var controls;
export function initController(camera, setNeedsToRender) {

    controls = new PointerLockControls(camera);

    var onKeyDown = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function (event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    return controls;

}


let prevPosition = new THREE.Vector3();
let prevRocation = new THREE.Vector3();

export function updateController(onObject) {

    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveLeft) - Number(moveRight);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {

        velocity.y = Math.max(0, velocity.y);
        canJump = true;

    }
    controls.is
    controls.getObject().translateX(velocity.x * delta);
    controls.getObject().translateY(velocity.y * delta);
    controls.getObject().translateZ(velocity.z * delta);

    if (controls.getObject().position.y < 10) {

        velocity.y = 0;
        controls.getObject().position.y = 10;

        canJump = true;

    }

    prevTime = time;
    let isUpdate = false;
    let distace = prevPosition.distanceTo(controls.getObject().position);

    let rotation = new THREE.Vector3().subVectors(new THREE.Vector3(controls.getObject().rotation.x,
        controls.getObject().rotation.y,
        controls.getObject().rotation.z),
        new THREE.Vector3(prevRocation.x,
            prevRocation.y,
            prevRocation.z));

    if (distace > Number.EPSILON || Math.abs(rotation.x) > Number.EPSILON
        || Math.abs(rotation.y) > Number.EPSILON
        || Math.abs(rotation.z) > Number.EPSILON) {  
        
        isUpdate = true;
    }


    prevPosition = controls.getObject().position.clone();
    prevRocation = controls.getObject().rotation.clone();




    return isUpdate;
}