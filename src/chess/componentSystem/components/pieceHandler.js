

import * as THREE from '../../../dependencies/three.module.js'
import Component from './component.js';
import Piece from './Piece.js';

const defaultProps = {
  models: null,
}

export default class PieceHandler extends Component {
  constructor(gameObject, config) {
    super(gameObject)
    const props = Object.assign(defaultProps, config)

    this.gameObject = gameObject

    // gameObject.addComponent(Piece, { model: props.models.duck, type: 'Knight', position: new THREE.Vector3(1, 1, 1) })
    // gameObject.addComponent(Piece, { model: props.models.duck, type: 'Rook', position: new THREE.Vector3(1, 1, 1) })
    const pieces = gameObject.getComponentsByType(Piece)
    console.log('pieces :>> ', pieces)
  }
  update(deltaTime) {
  }
}
