import { Object3D } from '../../dependencies/three.module.js'

export default class GameObject {
  constructor(parent, name) {
    this.name = name;
    this.components = [];
    this.transform = new Object3D();
    parent.add(this.transform);
  }
  addComponent(ComponentType, ...args) {
    const component = new ComponentType(this, ...args);
    this.components.push(component);
    return component;
  }
  removeComponent(component) {
    removeArrayElement(this.components, component);
  }
  getComponentByType(ComponentType) {
    return this.components.find(c => c instanceof ComponentType);
  }
  getComponentsByType(ComponentType) {
    return this.components.filter(c => c instanceof ComponentType)
  }
  update(deltaTime) {
    for (const component of this.components) {
      component.update(deltaTime);
    }
  }
}

function removeArrayElement(array, element) {
  const ndx = array.indexOf(element);
  if (ndx >= 0) {
    array.splice(ndx, 1);
  }
}