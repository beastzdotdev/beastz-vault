export type BusEvents = {
  'show-alert': (params: { message: string; onClose?: () => void }) => void;
};
