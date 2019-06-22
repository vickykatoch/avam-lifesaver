import { Component, OnInit } from "@angular/core";
import {
  ExtendedReplaySubject,
  ItemComparer,
  VersionComparaer
} from "../utils/replay-map-subject";
const MAX_ITEMS = 100000;
const DEPTS = ["HR", "FINANCE", "CORP", "MARKETING", "SALES"];
interface Emp {
  id: number;
  name: string;
  dept: string;
  v: string;
}
const empComparer: ItemComparer<Emp> = (existing: Emp, current: Emp) =>
  existing.id === current.id;
const versionComparer: VersionComparaer<Emp> = (existing: Emp, current: Emp) =>
  existing.v === current.v;

@Component({
  selector: "app-ext-replay-subject-tester",
  templateUrl: "./ext-replay-subject-tester.component.html",
  styleUrls: ["./ext-replay-subject-tester.component.scss"]
})
export class ExtReplaySubjectTesterComponent implements OnInit {
  private xreplayMap = new ExtendedReplaySubject<Emp>(
    empComparer,
    versionComparer,
    MAX_ITEMS
  );
  private emps: Emp[] = [];
  constructor() {}

  ngOnInit() {
    this.xreplayMap.subscribe(e => {
      this.emps.push(e);
      console.log(`Collection Count : `, this.emps.length);
    });
    this.xreplayMap.deleted$.subscribe(emps => {
      emps.forEach(e => {
        this.emps = this.emps.filter(i => i.id !== e.id);
      });
      console.log(`Collection Count : `, this.emps.length);
    });
  }
  start() {
    const emp = this.newEmp();
    this.xreplayMap.next(emp);
  }
  delete() {
    const idx = Math.floor(Math.random() * this.emps.length);
    const emp = this.emps[idx];
    this.xreplayMap.remove(emp);
  }
  deleteOfType() {
    this.xreplayMap.remove(item => {
      return item.dept === "HR";
    });
  }
  deleteAll() {
    this.xreplayMap.removeAll();
  }
  duplicate() {
    const idx = Math.floor(Math.random() * this.emps.length);
    const emp = this.emps[idx];
    this.xreplayMap.next(Object.assign({}, emp));
  }
  subscribe() {
    let items = [];
    this.xreplayMap.subscribe(e => {
      items.push(e);
      console.log("Another Sub Count : ", items.length);
    });
    this.xreplayMap.deleted$.subscribe(emps => {
      emps.forEach(e => {
        items = items.filter(i => i.id !== e.id);
      });
      console.log("Another Sub Count : ", items.length);
    });
  }
  send50() {
    let ctr = 1;
    const handle = setInterval(() => {
      this.start();
      ctr++;
      ctr === 51 && clearInterval(handle);
    }, 50);
  }
  sendBulk() {
    let ctr = 1;
    const handle = setInterval(() => {
      this.start();
      ctr++;
      ctr === 1001 && clearInterval(handle);
      console.log(ctr - 1);
    }, 5);
  }
  private newEmp(): Emp {
    const id = this.randomNum();
    const idx = Math.floor(Math.random() * DEPTS.length);
    return {
      id,
      name: `Emp ${id}`,
      dept: DEPTS[idx],
      v: id.toString()
    };
  }
  private randomNum(): number {
    return Math.floor(Math.random() * 1e7);
  }
}
