import { Injectable, Type } from '@nestjs/common';

import { ISerializableEvent } from '../es-serializers';
import { EventClsRegistry } from '../es-helpers';
import { Event } from '../es-store';

@Injectable()
export class EventDeserializer {
  deserialize<T>(event: Event): ISerializableEvent<T> {
    const eventCls = this.getEventClassByType(event.type);
    return {
      ...event,
      data: this.instantiateSerializedEvent(eventCls, event.data),
    };
  }

  getEventClassByType(type: string) {
    return EventClsRegistry.get(type);
  }

  instantiateSerializedEvent<T extends Type>(
    eventCls: T,
    data: Record<string, any>,
  ) {
    return Object.assign(Object.create(eventCls.prototype), data);
  }
}
