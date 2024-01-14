import { ISerializableEvent } from '@nestjslatam/ddd-lib';

export abstract class AbstractEventStore {
  abstract persist(
    eventOrEvents: ISerializableEvent | ISerializableEvent[],
  ): Promise<void>;
  abstract getEventsByStreamId(streamId: string): Promise<ISerializableEvent[]>;
}
