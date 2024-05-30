import Nanobus from 'nanobus';
import { MappedRecord } from '../types';
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

/**
 * @example
 *
 * ### Example on regular short message
 *
 * ```tsx
 * bus.emit('show-alert', { message: 'Hello this is message' });
 *```
 *<br>
 * ### Example on tsx
 *
 * ```tsx
 * bus.emit('show-alert', {
 *     message: (
 *       <>
 *         <H3>This is example title</H3>
 *         <br />
 *
 *         <CardList compact className="whitespace-nowrap max-h-64">
 *           {fileSizeLimitMessages.map(e => (
 *             <Card className="flex justify-between">
 *               <p>{e.name}</p>
 *               <p className="ml-3">{e.size}</p>
 *             </Card>
 *           ))}
 *         </CardList>
 *       </>
 *     ),
 *   });
 *```
 */
export const bus = BusContainer.instance.getBus<BusEvents>();
