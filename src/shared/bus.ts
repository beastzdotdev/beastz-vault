import Nanobus from 'nanobus';

type Listener = (...args: any[]) => void;
type Events = { [eventName: string]: Listener };

class BusContainer<E extends Events = Events> {
  private static _instance: BusContainer;
  private bus: Nanobus<E>;

  private constructor() {
    this.bus = new Nanobus();
  }

  public static get instance() {
    if (!BusContainer._instance) {
      BusContainer._instance = new BusContainer();
    }

    return BusContainer._instance;
  }

  public getBus() {
    return this.bus;
  }
}

//TODO resume here !!!! nanobus types are needed
type X = { sds: (x: { mesage: string }) => void };

export const bus = BusContainer.instance;

// const x = new Nanobus<{ sds: (x: { mesage: string }) => void }>();

// x.emit('sds', { mesage: 123 });

// x.emit('adad', { x: 123 });
// x.on<{ m: string }>('adad', e => {});
