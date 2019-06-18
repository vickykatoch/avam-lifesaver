import { Component, OnInit } from "@angular/core";
import { fromEvent, interval } from "rxjs";
import { scan, switchMapTo, takeUntil, startWith, mapTo } from "rxjs/operators";
import { memoize } from "./utils/mem";

const sum = (a: number, b: number): number => {
  return a + b;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  location = "top";
  memoizedSum = memoize(sum, 1000, (a: number, b: number) => {
    return `${a}.${b}`;
  });
  ngOnInit(): void {
    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");

    const start$ = fromEvent(startButton, "click");
    const stop$ = fromEvent(stopButton, "click");
    const intervalThatStops$ = interval(1000).pipe(takeUntil(stop$));

    const data = { count: 0 };
    const inc = acc => ({ count: acc.count + 1 });
    const reset = acc => data;

    // start$
    //   .pipe(
    //     switchMapTo(intervalThatStops$),
    //     mapTo(inc),
    //     startWith(data),
    //     scan((acc, curr) => {
    //       debugger;
    //       return curr(acc);
    //     })
    //   )
    //   .subscribe(evt => {
    //     debugger;
    //     console.log(evt);
    //   });
  }
  title = "avam-lifesaver";
  start() {
    let x = this.memoizedSum(3, 4);
    console.log(x);
    x = this.memoizedSum(30, 4);
    x = this.memoizedSum(40, 4);
    x = this.memoizedSum(3, 4);
    x = this.memoizedSum(23, 4);
    x = this.memoizedSum(3, 4);
  }
  stop() {
    const x = this.memoizedSum(13, 24);
    console.log(x);
  }
}
