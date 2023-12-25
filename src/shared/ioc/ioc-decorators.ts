import { decorate, inject, injectable } from 'inversify';
import { ioc } from './ioc';
import { GeneralClass } from '../types';

export const Singleton = <T>(cls: GeneralClass<T>) => {
  ioc.getContainer()?.bind(cls).toSelf().inSingletonScope();
  decorate(injectable(), cls);
};

export const Injectable = <T>(cls: GeneralClass<T>) => {
  ioc.getContainer()?.bind(cls).toSelf();
  decorate(injectable(), cls);
};

export const Inject = <T>(cls: GeneralClass<T>) => {
  return inject(cls);
};
