import GameObject from './gameObject.js'
import SafeArray from './safeArray.js';

export default class GameObjectManager {
  constructor() {
    this.gameObjects = new SafeArray();
  }
  createGameObject(parent, name) {
    const gameObject = new GameObject(parent, name);
    this.gameObjects.add(gameObject);
    return gameObject;
  }
  removeGameObject(gameObject) {
    this.gameObjects.remove(gameObject);
  }
  findGameObjectByName(name) {
    const gameObjects = this.gameObjects.find(gameObject => gameObject.name === name)
    if (gameObjects.length > 0) return gameObjects[0]
    else return null
  }
  update(delta) {
    this.gameObjects.forEach(gameObject => gameObject.update(delta));
  }
}