export type BusMessageType = string | number | JSX.Element;

export type BusEvents = {
  'show-alert': (params: { message: BusMessageType; onClose?: () => void }) => void;
};
