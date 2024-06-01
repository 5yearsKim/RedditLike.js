type ListenerT<ArgT> = (arg: ArgT) => void;

export class GlobalEvent<ArgT> {
  listeners = new Map<string, ListenerT<ArgT>>();

  emit(arg: ArgT): void {
    this.listeners.forEach((lst) => {
      lst(arg);
    });
  }

  addListener(key: string, listener: ListenerT<ArgT>): void {
    this.listeners.set(key, listener);
  }

  removeListener(key: string): void {
    this.listeners.delete(key);
  }
}
