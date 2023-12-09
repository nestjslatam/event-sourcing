/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DomainAggregateRoot,
  IDomainEvent,
  IDomainEventHandler,
} from '@nestjslatam/ddd-lib';
import { Type } from '@nestjs/common';

import { ISerializableEvent } from './es-serializers';

const VERSION = Symbol('version');
const IS_AUTOCOMMIT_ENABLED = Symbol();

export abstract class EsDomainAggregateRoot<
  TProps,
  TDomainEventBase extends IDomainEvent = IDomainEvent,
> extends DomainAggregateRoot<TProps> {
  // #region Properties ---------------------------------------------------------
  protected [IS_AUTOCOMMIT_ENABLED] = false;
  protected [VERSION] = 0;
  // #endregion

  // #region Constructor --------------------------------------------------------
  constructor(id, props: TProps, trackingProps) {
    super({ id, props, trackingProps });

    this.setVersion(0);
  }
  // #endregion ----------------------------------------------------------------

  // #region Getters and setters -------------------------------------------------
  public get version(): number {
    return this[VERSION];
  }

  set autoCommit(value: boolean) {
    this[IS_AUTOCOMMIT_ENABLED] = value;
  }

  get autoCommit(): boolean {
    return this[IS_AUTOCOMMIT_ENABLED];
  }

  // #endregion ------------------------------------------------------------------

  // #region Behavior ------------------------------------------------------
  protected abstract businessRules(props: any);

  protected setVersion(version: number): void {
    this[VERSION] = version;
  }

  public loadFromHistory(history: ISerializableEvent[]): void {
    const domainEvents = history.map((event) => event.data);
    domainEvents.forEach((event) => this.apply(event, true));

    const lastEvent = history[history.length - 1];
    this.setVersion(lastEvent.position);
  }

  /**
   * Applies an event.
   * If auto commit is enabled, the event will be published immediately (note: must be merged with the publisher context in order to work).
   * Otherwise, the event will be stored in the internal events array, and will be published when the commit method is called.
   * Also, the corresponding event handler will be called (if exists).
   * For example, if the event is called UserCreatedEvent, the "onUserCreatedEvent" method will be called.
   *
   * @param event The event to apply.
   * @param isFromHistory Whether the event is from history.
   */
  apply<T extends TDomainEventBase = TDomainEventBase>(
    event: T,
    isFromHistory?: boolean,
  ): void;

  /**
   * Applies an event.
   * If auto commit is enabled, the event will be published immediately (note: must be merged with the publisher context in order to work).
   * Otherwise, the event will be stored in the internal events array, and will be published when the commit method is called.
   * Also, the corresponding event handler will be called (if exists).
   * For example, if the event is called UserCreatedEvent, the "onUserCreatedEvent" method will be called.
   *
   * @param event The event to apply.
   * @param options The options.
   */
  apply<T extends TDomainEventBase = TDomainEventBase>(
    event: T,
    options?: { fromHistory?: boolean; skipHandler?: boolean },
  ): void;
  apply<T extends TDomainEventBase = TDomainEventBase>(
    event: T,
    optionsOrIsFromHistory:
      | boolean
      | { fromHistory?: boolean; skipHandler?: boolean } = {},
  ): void {
    const isFromHistory =
      (typeof optionsOrIsFromHistory === 'boolean'
        ? optionsOrIsFromHistory
        : optionsOrIsFromHistory.fromHistory) ?? false;
    const skipHandler =
      typeof optionsOrIsFromHistory === 'boolean'
        ? false
        : optionsOrIsFromHistory.skipHandler;

    if (!isFromHistory && !this.autoCommit) {
      this.addDomainEvent(event);
    }
    this.autoCommit && this.publish(event);

    if (!skipHandler) {
      const handler = this.getEventHandler(event);
      handler && handler.call(this, event);
    }
  }

  protected getEventHandler<T extends TDomainEventBase = TDomainEventBase>(
    event: T,
  ): Type<IDomainEventHandler> | undefined {
    const handler = `on${this.getEventName(event)}`;
    return this[handler];
  }

  protected getEventName(event: any): string {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name as string;
  }

  // #endregion ------------------------------------------------------------------
}
