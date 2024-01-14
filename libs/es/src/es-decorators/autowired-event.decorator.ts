import { DomainEventClsRegistry } from '@nestjslatam/ddd-lib';

export const EsAutowiredEvent: ClassDecorator = (target: any) => {
  DomainEventClsRegistry.add(target);
};
