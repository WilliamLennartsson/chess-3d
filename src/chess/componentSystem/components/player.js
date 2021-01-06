import * as THREE from '../../../dependencies/three.module.js'

import Component from './component.js'
import SkinInstance from './skinInstance.js'

const defaultProps = {
  model: null,
  keyboardInputManager: null,
  moveSpeed: 20,
  turnSpeed: 4,
  runAnimation: null,
  IdleAnimation: null
}

export default class Player extends Component {
  constructor(gameObject, config) {
    super(gameObject);
    const props = Object.assign(defaultProps, config)
    props.model.gltf.scene.scale.set(props.model.scale.x, props.model.scale.y, props.model.scale.z)

    this.skinInstance = gameObject.addComponent(SkinInstance, props.model)
    this.skinInstance.setAnimation('Run')

    this.keyboardInputManager = props.keyboardInputManager

    this.moveSpeed = props.moveSpeed
    this.turnSpeed = props.turnSpeed
    this.forward = new THREE.Vector3(0, 0, 1)

    this.idle = false
  }

  update(deltaTime) {
    // const {transform} = this.gameObject
    // // console.log(this.keyboardInputManager)
    // const { left, right, up, down, aKey, sKey, wKey,dKey } = this.keyboardInputManager.keys

    // const delta = (left.down || aKey.down ? 1 : 0) + (right.down || dKey.down ? -1 : 0)
    // if (down.justPressed || sKey.justPressed && !this.idle) {
    //   this.idle = true
    //   this.skinInstance.setAnimation('Survey')
    // } else if ((up.justPressed || wKey.justPressed) && this.idle) {
    //   this.idle = false
    //   this.skinInstance.setAnimation('Run')
    // }

    // if (!this.idle) {
    //   this.gameObject.transform.translateOnAxis(this.forward, this.moveSpeed * deltaTime)
    // }
    // this.gameObject.transform.rotation.y += this.turnSpeed * delta * deltaTime;
  }
}