import { RootFileStructure } from '../model';

export type BusMessageType = string | number | JSX.Element;

export type BusEvents = {
  'show-alert': (params: { message: BusMessageType; onClose?: () => void }) => void;
  'show-file': (params: { item: RootFileStructure; isInBin: boolean }) => void;
};
