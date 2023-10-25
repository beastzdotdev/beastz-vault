import Nanobus from 'nanobus';
import { MappedRecord } from '../../models/general';
import { BusEvents } from './bus.schema';

class BusContainer {
  private static _instance: BusContainer;
  private bus: Nanobus;

  private constructor() {
    this.bus = new Nanobus();
  }

  public static get instance() {
    if (!BusContainer._instance) {
      BusContainer._instance = new BusContainer();
    }

    return BusContainer._instance;
  }

  public getBus<T extends MappedRecord<T>>() {
    return this.bus as Nanobus<T>;
  }
}

export const bus = BusContainer.instance.getBus<BusEvents>();
