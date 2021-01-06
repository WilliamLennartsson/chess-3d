import { PointerLockControls } from '../../dependencies/PointerLockControls.js'

export default class MouseControlManager {

  constructor(scene, camera) {

    const controls = new PointerLockControls( camera, document.body )
    var blocker = document.getElementById( 'blocker' )
    var instructions = document.getElementById( 'instructions' )

    instructions.addEventListener( 'click', function () {
        controls.lock()
    }, false )

    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none'
        blocker.style.display = 'none'
    } )

    controls.addEventListener( 'unlock', function () {
        blocker.style.display = 'block'
        instructions.style.display = ''

    } )
  
   scene.add( controls.getObject() ) 
  }
}
