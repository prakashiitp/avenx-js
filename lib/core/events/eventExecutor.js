export class EventExecutor {
    constructor(runHandler) {
        this.runHandler = runHandler;
    }

    execute(source, event = null) {
        return this.runHandler(source, event);
    }
}
