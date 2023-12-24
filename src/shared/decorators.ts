import { decorate, inject, injectable } from 'inversify';
import { GeneralClass } from '../models/general';
import { ioc } from './ioc';

export function Singleton<T>(cls: GeneralClass<T>) {
  ioc.getContainer()?.bind(cls).toSelf().inSingletonScope();
  decorate(injectable(), cls);
}

export function Injectable<T>(cls: GeneralClass<T>) {
  ioc.getContainer()?.bind(cls).toSelf();
  decorate(injectable(), cls);
}

export function Inject<T>(cls: GeneralClass<T>) {
  return inject(cls);
}
