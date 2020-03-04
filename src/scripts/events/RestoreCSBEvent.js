const EVENT_TYPE = "RestoreCSBEvent";

export default class RestoreCSBEvent extends CustomEvent {
    getEventType = function () {
        return EVENT_TYPE;
    };

    constructor(eventName, eventData, eventOptions) {
        if (!eventOptions) {
            eventOptions = {bubbles: true, cancelable: true, composed: true}
        }
        super(eventName, eventOptions);
        this.data = eventData;
    }
}
