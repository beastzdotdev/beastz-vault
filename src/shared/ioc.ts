import { Container } from 'inversify';

class IocContainer {
  private static _instance: IocContainer;
  private iocContainer: Container;

  private constructor() {
    this.iocContainer = new Container();
  }

  public static get instance() {
    if (!IocContainer._instance) {
      IocContainer._instance = new IocContainer();
    }

    return IocContainer._instance;
  }

  public getContainer() {
    return this.iocContainer;
  }
}

export const ioc = IocContainer.instance;
