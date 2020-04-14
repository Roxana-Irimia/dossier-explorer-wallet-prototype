const EVENT_TYPE = "SignOutEvent";
const EVENT_NAME = "sign-out";
const DEFAULT_EVENT_OPTIONS = {
  bubbles: true,
  cancelable: true,
  composed: true,
};

export default class SignOutEvent extends CustomEvent {
  getEventType = function () {
    return EVENT_TYPE;
  };

  constructor(eventData, eventOptions = DEFAULT_EVENT_OPTIONS) {
    super(EVENT_NAME, eventOptions);

    this.data = eventData;
  }
}
