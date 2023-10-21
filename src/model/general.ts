export interface GeneralClass<T> {
  new (...args: never[]): T;
}

export type MappedRecord<T> = {
  [key in keyof T]: T[key];
};
