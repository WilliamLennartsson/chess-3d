import * as THREE from '../../../dependencies/three.module.js'

import Component from './component.js'
import SkinInstance from './skinInstance.js'

export default class Entity extends Component {
  constructor(gameObject, model) {
    super(gameObject);
    model.gltf.scene.scale.set(model.scale.x, model.scale.y, model.scale.z)
    this.skinInstance = gameObject.addComponent(SkinInstance, model);
    //this.skinInstance.setAnimation()
  }

  update(deltaTime) {
    // // const {transform} = this.gameObject
    // // // console.log(this.keyboardInputManager)
    
    // const {left, right} = this.keyboardInputManager.keys
    // // console.log('left, right :>> ', left, right)
    
    // const delta = (left.down  ?  1 : 0) +
    //               (right.down ? -1 : 0)
    // // this.gameObject.transform.rotation.y += 0.001 // this.turnSpeed * delta * deltaTime
    // // this.gameObject.transform.translateOnAxis(this.)
    // this.gameObject.transform.rotation.y += this.turnSpeed * delta * deltaTime;
    // this.gameObject.transform.translateOnAxis(this.forward, this.moveSpeed * deltaTime)
  }
}