import * as THREE from '../../../dependencies/three.module.js'

import Component from './component.js'
import SkinInstance from './skinInstance.js'

const defaultProps = {
  model: null,
  position: new THREE.Vector3(0, 0, 0),
  type: "None"
}


export default class Piece extends Component {
  constructor(gameObject, props = defaultProps) {
    super(gameObject)
    props = Object.assign(defaultProps, props)
    gameObject.transform.position.x = props.position.x
    gameObject.transform.position.y = props.position.y
    gameObject.transform.position.z = props.position.z
    this.type = props.type

    this.skinInstance = gameObject.addComponent(SkinInstance, props.model)
  }

  update(deltaTime) {

  }
}