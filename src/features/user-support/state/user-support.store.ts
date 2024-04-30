import { makeAutoObservable } from 'mobx';
import { Singleton } from '../../../shared/ioc';
import { UserSupport } from '../model/user-support.model';
import { UserSupportMessage } from '../model/user-support-message.model';

@Singleton
export class UserSupportStore {
  private _ticket: UserSupport[] = [];
  private _singleData: UserSupport;
  private _messages: UserSupportMessage[];

  constructor() {
    makeAutoObservable(this);
  }

  get isEmpty(): boolean {
    return this._ticket.length === 0;
  }

  get data(): UserSupport[] {
    return this._ticket;
  }

  get singleData(): UserSupport {
    return this._singleData;
  }

  get messages(): UserSupportMessage[] {
    return this._messages;
  }

  //====================================================
  // Chose methods for setter instead of set keyword
  //====================================================
  setData(value: UserSupport[]) {
    this._ticket = value;
  }

  setSingleData(value: UserSupport) {
    this._singleData = value;
  }

  setMessages(value: UserSupportMessage[]) {
    this._messages = value;
  }

  replaceById(id: number, newData: UserSupport) {
    const index = this._ticket.findIndex(e => e.id === id);

    if (index !== -1) {
      this._ticket[index] = newData;
      return;
    }
  }
}
