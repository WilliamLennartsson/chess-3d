import * as THREE from '../../../dependencies/three.module.js'
import Component from './component.js'

export default class Ground extends Component {
  constructor(gameObject, width, height) {
    super(gameObject)
    var geometry = new THREE.PlaneGeometry(width, height, 1 )
    var material = new THREE.MeshBasicMaterial( {color: 0x228B22, side: THREE.DoubleSide} )
    var plane = new THREE.Mesh( geometry, material )
    plane.rotation.x = Math.PI / 2
    gameObject.transform.add(plane)
  }
}