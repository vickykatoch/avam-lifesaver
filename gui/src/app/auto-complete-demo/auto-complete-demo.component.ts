import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-auto-complete-demo",
  templateUrl: "./auto-complete-demo.component.html",
  styleUrls: ["./auto-complete-demo.component.scss"]
})
export class AutoCompleteDemoComponent implements OnInit {
  private searchResult = [
    "One",
    "Two",
    "three",
    "four",
    "five",
    "six",
    "seven"
  ];

  constructor() {}

  ngOnInit() {}
  onSearch(searchString: string): Observable<string[]> {
    return of(this.searchResult);
  }
  onItemSelected(item: string) {
    debugger;
    console.log(item);
  }
}
