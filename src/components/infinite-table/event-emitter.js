export default class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  addEvent(event, callback) {
    let eventListeners;
    if (!this.listeners.has(event)) {
      eventListeners = new Set();
      this.listeners.set(event, eventListeners);
    }
    eventListeners = this.listeners.get(event);
    eventListeners.add(callback);
  }

  removeEvent(event, callback) {
    if (this.listeners.has(event)) {
      const eventListeners = this.listeners.get(event);
      return eventListeners.delete(callback);
    }
    return false;
  }

  removeAllListeners(event) {
    this.listeners.delete(event);
  }

  dispatch(event, payload) {
    if (this.listeners.has(event)) {
      const eventListeners = this.listeners.get(event);
      eventListeners.forEach((callback) => {
        callback(payload);
      });
    }
  }
}
