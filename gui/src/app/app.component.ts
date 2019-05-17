import { Component, OnInit } from "@angular/core";
import { fromEvent, interval } from "rxjs";
import { scan, switchMapTo, takeUntil, startWith, mapTo } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  location = 'top';
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
}
