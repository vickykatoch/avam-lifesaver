import { ReplaySubject, SchedulerLike, Subject } from 'rxjs';

export type ItemComparer<T> = (existingItem: T, newItem: T) => boolean;
export type VersionFilterFunc<T> = (prevItem: T, newItem: T) => boolean;

export class ExtendedReplaySubject<T> extends ReplaySubject<T> {
    private deletedNotifier = new Subject<T[]>();
    public deleted$ = this.deletedNotifier.asObservable();

    constructor(private comparer: ItemComparer<T>, private versionFilter: VersionFilterFunc<T>,
        bufferSize?: number, windowTime?: number, scheduler?: SchedulerLike) {
        super(bufferSize, windowTime, scheduler);
    }
    public next(value: T) {
        const index = super['_events'].findIndex((evt) => {
            return this.comparer(evt, value);
        });
        if (index >= 0)  {
            const existingItem = super['_events'][index];
            const isVersionSame = this.versionFilter ? this.versionFilter(existingItem, value) : existingItem === value;
            if (!isVersionSame) {
                super['_events'].splice(index, 1);
                super.next(value);
            }
        } else {
            super.next(value);
        }
    }
    public remove(item: T) {
        const index = super['_events'].findIndex((evt) => {
            return this.comparer(evt, item);
        });
        if (index >= 0) {
            const existingItem = super['_events'][index];
            super['_events'].splice(index, 1);
            this.deletedNotifier.observers.length && this.deletedNotifier.next([existingItem]);
        }
    }
    removeAll() {
        if (super['_events'].length) {
            const shallowClone = [...super['_events']];
            super['_events'].length = 0;
            this.deletedNotifier.observers.length && this.deletedNotifier.next(shallowClone);
        }
    }
}
