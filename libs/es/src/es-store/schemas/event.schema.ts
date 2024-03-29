import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DomainEvent } from '@nestjslatam/ddd-lib';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type EventDocument = HydratedDocument<DomainEvent>;

@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Event {
  @Prop()
  aagregateId: string;

  @Prop()
  type: string;

  @Prop()
  position: number;

  @Prop({
    type: SchemaTypes.Mixed,
  })
  data: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ aagregateId: 1, position: 1 }, { unique: true });
