export class LifecycleManager {
    mount(component, target) {
        component.__setMountTarget(target);
        component.update();
    }
}
