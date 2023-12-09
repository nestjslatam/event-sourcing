import { EventClsRegistry } from '../es-helpers';

export const AutowiredEvent: ClassDecorator = (target: any) => {
  EventClsRegistry.add(target);
};
