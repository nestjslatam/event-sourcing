import { EventClsRegistry } from '../infrastructure';

export const AutowiredEvent: ClassDecorator = (target: any) => {
  EventClsRegistry.add(target);
};
