import { Component, OnInit } from "@angular/core";
import {
  ExtendedReplaySubject,
  ItemComparer,
  VersionFilterFunc
} from "../utils/replay-map-subject";

interface Emp {
  id: number;
  name: string;
  v: string;
}
const empComparer: ItemComparer<Emp> = (existing: Emp, current: Emp) =>
  existing.id === current.id;
const versionComparer: VersionFilterFunc<Emp> = (existing: Emp, current: Emp) =>
  existing.v === current.v;

@Component({
  selector: "app-ext-replay-subject-tester",
  templateUrl: "./ext-replay-subject-tester.component.html",
  styleUrls: ["./ext-replay-subject-tester.component.scss"]
})
export class ExtReplaySubjectTesterComponent implements OnInit {
  private xreplayMap = new ExtendedReplaySubject<Emp>(
    empComparer,
    undefined,
    10
  );
  private emps: Emp[] = [];
  constructor() {}

  ngOnInit() {
    this.xreplayMap.subscribe(e => {
      console.log(`New Emp Received : ${JSON.stringify(e)}`);
    });
    this.xreplayMap.deleted$.subscribe(emps => {
      this.emps = this.emps.filter(em => !emps.some(e => e.id === em.id));
      console.log(
        `Employee deleted : ${JSON.stringify(emps)}, Length : ${
          this.emps.length
        }`
      );
    });
  }
  start() {
    const emp = this.newEmp();
    this.emps.push(emp);
    this.xreplayMap.next(emp);
  }
  delete() {
    const idx = Math.floor(Math.random() * this.emps.length);
    const emp = this.emps[idx];
    this.xreplayMap.remove(emp);
  }
  duplicate() {
    debugger;
    const idx = Math.floor(Math.random() * this.emps.length);
    const emp = this.emps[idx];
    this.xreplayMap.next(Object.assign({}, emp));
  }
  private newEmp(): Emp {
    const id = this.randomNum();
    return {
      id,
      name: `Emp ${id}`,
      v: id.toString()
    };
  }
  private randomNum(): number {
    return Math.floor(Math.random() * 1e5);
  }
}
