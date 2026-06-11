import { ProxyHandlerFactory } from './proxyHandler.js';

export class StateFactory {
    constructor(handlerFactoryClass = ProxyHandlerFactory) {
        this.handlerFactoryClass = handlerFactoryClass;
    }

    create(initialState = {}, options = {}) {
        const handlerFactory = new this.handlerFactoryClass(options);
        return new Proxy(initialState, handlerFactory.create());
    }
}
