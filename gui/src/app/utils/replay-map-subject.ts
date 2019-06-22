import { ReplaySubject, SchedulerLike, Subject } from "rxjs";

export type ItemComparer<T> = (existingItem: T, newItem: T) => boolean;
export type VersionComparaer<T> = (prevItem: T, newItem: T) => boolean;
export type ShouldAction<T> = (item: T) => boolean;

export class ExtendedReplaySubject<T> extends ReplaySubject<T> {
  private deletedNotifier = new Subject<T[]>();
  public deleted$ = this.deletedNotifier.asObservable();
  private superNext: (value: T) => void;
  private events: T[];
  constructor(
    private itemComparer: ItemComparer<T>,
    private versionComparer: VersionComparaer<T>,
    bufferSize?: number,
    windowTime?: number,
    scheduler?: SchedulerLike
  ) {
    super(bufferSize, windowTime, scheduler);
    this.superNext = this.next;
    this.next = this.publish;
    this.events = this["_events"];
  }
  private publish(value: T) {
    let itemToPublish: T;
    const index = this.events.findIndex(evt => {
      return this.itemComparer(evt, value);
    });
    if (index >= 0) {
      const existingItem = this.events[index];
      const isVersionSame = this.versionComparer
        ? this.versionComparer(existingItem, value)
        : existingItem === value;
      if (!isVersionSame) {
        this.events.splice(index, 1);
        itemToPublish = value;
      }
    } else {
      itemToPublish = value;
    }
    itemToPublish && this.publishNext(itemToPublish);
  }
  private publishNext(value: T) {
    if (this.events.length > this["_bufferSize"]) {
      this.deletedNotifier.next([this.events.shift()]);
    }
    this.superNext(value);
  }
  public remove(itemOrComparer: T | ShouldAction<T>) {
    if (itemOrComparer instanceof Function) {
      const shallowCopy = [...this.events];
      const deletedItems = [];
      shallowCopy.forEach(ditem => {
        const isTrue = itemOrComparer(ditem);
        if (isTrue) {
          const index = this.events.findIndex(i => i === ditem);
          const delItems = this.events.splice(index, 1);
          deletedItems.push(delItems[0]);
        }
      });
      deletedItems.length &&
        this.deletedNotifier.observers.length &&
        this.deletedNotifier.next(deletedItems);
    } else {
      const index = this.events.findIndex(evt => {
        return this.itemComparer(evt, itemOrComparer);
      });
      if (index >= 0) {
        const existingItem = this.events[index];
        this.events.splice(index, 1);
        this.deletedNotifier.observers.length &&
          this.deletedNotifier.next([existingItem]);
      }
    }
  }
  public removeAll() {
    if (this.events.length) {
      const shallowCopy = [...this.events];
      this.events.length = 0;
      this.deletedNotifier.observers.length &&
        this.deletedNotifier.next(shallowCopy);
    }
  }
}
