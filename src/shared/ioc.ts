import { Container } from 'inversify';
import { decorate, injectable } from 'inversify';
import { GeneralClass } from '../models/general';

export class IocContainer {
  private static _IocContainer: Container = new Container();

  public static getContainer() {
    return this._IocContainer;
  }
}

export function Singleton<T>(cls: GeneralClass<T>) {
  IocContainer.getContainer()?.bind(cls).toSelf().inSingletonScope();
  decorate(injectable(), cls);
}

export function Injectable<T>(cls: GeneralClass<T>) {
  IocContainer.getContainer()?.bind(cls).toSelf();
  decorate(injectable(), cls);
}
