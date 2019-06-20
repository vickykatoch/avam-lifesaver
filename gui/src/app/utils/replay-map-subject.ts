import { ReplaySubject, SchedulerLike, Subject } from "rxjs";

export type ItemComparer<T> = (existingItem: T, newItem: T) => boolean;
export type VersionFilterFunc<T> = (prevItem: T, newItem: T) => boolean;

export class ExtendedReplaySubject<T> extends ReplaySubject<T> {
  private deletedNotifier = new Subject<T[]>();
  public deleted$ = this.deletedNotifier.asObservable();
  private superNext: Function;
  private events: T[];
  constructor(
    private comparer: ItemComparer<T>,
    private versionFilter: VersionFilterFunc<T>,
    bufferSize?: number,
    windowTime?: number,
    scheduler?: SchedulerLike
  ) {
    super(bufferSize, windowTime, scheduler);
    this.superNext = super.next;
    this.next = this.publish;
    this.events = this["_events"];
  }
  private publish(value: T) {
    let itemToPublish: T;
    debugger;
    const index = this.events.findIndex(evt => {
      return this.comparer(evt, value);
    });
    if (index >= 0) {
      const existingItem = this.events[index];
      const isVersionSame = this.versionFilter
        ? this.versionFilter(existingItem, value)
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
    this.events.push(value);
    if (this.events.length > this["_bufferSize"]) {
      this.deletedNotifier.next([this.events.shift()]);
    }
    this.superNext(value);
  }
  public remove(item: T) {
    const index = this["_events"].findIndex(evt => {
      return this.comparer(evt, item);
    });
    if (index >= 0) {
      const existingItem = this["_events"][index];
      this["_events"].splice(index, 1);
      this.deletedNotifier.observers.length &&
        this.deletedNotifier.next([existingItem]);
    }
  }
  public removeAll() {
    if (this["_events"].length) {
      const shallowCopy = [...this["_events"]];
      this["_events"].length = 0;
      this.deletedNotifier.observers.length &&
        this.deletedNotifier.next(shallowCopy);
    }
  }
}
