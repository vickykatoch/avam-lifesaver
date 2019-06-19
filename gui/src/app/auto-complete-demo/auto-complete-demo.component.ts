import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { Observable, of, interval } from "rxjs";
import { switchMap, filter, map } from "rxjs/operators";

interface AutoCompleteProps {
  multiSelect: boolean;
  customTemplate: boolean;
  resultLocation: string;
  maxHeight: number;
  widthOffset: number;
  displayProp: string;
}

@Component({
  selector: "app-auto-complete-demo",
  templateUrl: "./auto-complete-demo.component.html",
  styleUrls: ["./auto-complete-demo.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoCompleteDemoComponent implements OnInit {
  private dataSet = [
    { id: 1, name: "Balwinder Katoch", region: "NA" },
    { id: 2, name: "Aryan Katoch", region: "NA" },
    { id: 3, name: "Aadi Katoch", region: "NA" },
    { id: 4, name: "Mamta Katoch", region: "NA" },
    { id: 5, name: "Rahul Katoch", region: "IN" },
    { id: 6, name: "Andille Phelukwaya Junior Year", region: "SA" },
    { id: 6, name: "Dale Styen", region: "SA" },
    { id: 7, name: "Eon Morgan", region: "EU" },
    { id: 8, name: "Jonny Bairstow", region: "EU" },
    { id: 9, name: "Hashim Amla", region: "SA" },
    { id: 10, name: "Sachin Tendulkar", region: "IN" },
    { id: 11, name: "Virat Kohli", region: "IN" },
    { id: 12, name: "Hardik Pandya", region: "IN" },
    { id: 13, name: "Steve Smith", region: "AU" },
    { id: 14, name: "David Warner", region: "AU" },
    { id: 15, name: "Glen Maxwell", region: "AU" },
    { id: 16, name: "Aron Finch", region: "AU" },
    { id: 17, name: "Usman Khwaja", region: "AU" },
    { id: 18, name: "Glen McGrath", region: "AU" },
    { id: 19, name: "Ricky Ponting", region: "AU" },
    { id: 20, name: "Mitchell Starc", region: "AU" },
    { id: 21, name: "Pat Cummins", region: "AU" }
  ];
  private props: AutoCompleteProps;
  private selectedRec: any;

  constructor(private cdr: ChangeDetectorRef) {
    this.props = {
      multiSelect: false,
      customTemplate: true,
      resultLocation: "bottom",
      maxHeight: 0,
      widthOffset: 0,
      displayProp: "name"
    };
  }

  ngOnInit() {}
  onSearch(searchString: string): Observable<any[]> {
    searchString = searchString.toLowerCase();
    return of(this.dataSet).pipe(
      map(data =>
        data.filter(m => {
          return (
            m.name.toLowerCase().startsWith(searchString) ||
            m.region.toLowerCase().startsWith(searchString)
          );
        })
      )
    );
  }
  onItemSelected(item: any | any[]) {
    if (item) {
      if (!Array.isArray(item)) {
        this.selectedRec = item;
        this.cdr.markForCheck();
      }
    } else {
      this.selectedRec = item;
      console.log("Value is null");
      this.cdr.markForCheck();
    }
  }
}
