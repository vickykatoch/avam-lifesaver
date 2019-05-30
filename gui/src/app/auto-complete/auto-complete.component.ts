//#region IMPORTS
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
  Renderer2
} from "@angular/core";
import { Subscription, fromEvent, Observable, of } from "rxjs";
import { filter, map, debounceTime, switchMap } from "rxjs/operators";
//#endregion

//#region MODULE TYPES/CONSTANTS
export type SearchFn = (searchString: string) => Observable<any[]>;
export interface SearchResultItem {
  isSelected: boolean;
  resultItem: any;
}
//#endregion

@Component({
  selector: "input[auto-complete]",
  templateUrl: "./auto-complete.component.html",
  styleUrls: ["./auto-complete.component.scss"]
})
export class AutoCompleteComponent implements OnInit, OnDestroy {
  //#region FIELDS
  @ViewChild("defaultTemplate") resultTemplate: TemplateRef<any>;
  showResult = false;
  private subscriptions: Subscription[] = [];
  private searchResult: SearchResultItem[] = [];
  private resultStyle: any;
  text: string;
  //#endregion

  //#region EXTERNAL INPUT/OUTPUT
  @Input("acItemTemplate") itemTemplate: TemplateRef<any>;
  @Input() acSearchLocation = "bottom";
  @Input() acOnSearch: SearchFn;
  @Input("acResultHeight") resultHeight: number = 200;
  @Input("acMultiSelect") multiSelect = false;
  @Output("acSelected") selected = new EventEmitter<any | any[]>();
  @Input("acDisplayProp") displayProp: string;
  @Input("acSelectedValue") selectedValue: any;
  //#endregion

  //#region CTOR
  constructor(
    private elem: ElementRef,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private vc: ViewContainerRef
  ) {}
  //#endregion

  //#region NG LIFECYCLE
  ngOnInit() {
    this.renderTemplate();
    this.subscriptions.push(this.listenInputChange());
    this.subscriptions.push(this.listenArrowNavigation());
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
    console.log("AutoComplete Component destroyed");
  }
  //#endregion

  //#region GUI CALLBACKS
  onSelect(item?: SearchResultItem) {
    if (this.multiSelect) {
      this.selected.next(this.searchResult.filter(x => x.isSelected === true));
    } else {
      this.selectedValue = item.resultItem;
      this.selected.next(item.resultItem);
    }
    this.clear();
  }
  onClear() {
    this.clear();
  }
  //#endregion

  //#region HELPER METHODS
  private listenInputChange(): Subscription {
    return fromEvent(this.elem.nativeElement, "keyup")
      .pipe(
        filter(this.validateInputKey),
        debounceTime(300),
        map((e: any) => e.target.value as string),
        filter(str => {
          const isOk = this.isSearchFuncValid() && str && str.trim().length > 0;
          if (!isOk) {
            this.showResult = false;
            this.cdr.markForCheck();
          }
          return isOk;
        }),
        switchMap(str => this.acOnSearch(str)),
        map(result => {
          if (Array.isArray(result) && result.length) {
            return result.map(
              item =>
                ({ isSelected: false, resultItem: item } as SearchResultItem)
            );
          }
          return [] as SearchResultItem[];
        })
      )
      .subscribe(result => {
        this.searchResult = result;
        this.showResult = result.length > 0;
        if (this.showResult) {
          this.setResultStyle();
        }
      });
  }
  private listenArrowNavigation(): Subscription {
    return of("3").subscribe();
  }
  private renderTemplate() {
    // TODO: consider searchLocation bfor rendering the template
    this.vc.createEmbeddedView(this.resultTemplate);
    this.cdr.markForCheck();
  }
  private validateInputKey(keyEvt: KeyboardEvent): boolean {
    return true;
  }
  private isSearchFuncValid(): boolean {
    return this.acOnSearch && this.acOnSearch instanceof Function;
  }
  private setResultStyle() {
    const inputElem = this.elem.nativeElement as HTMLInputElement;
    this.resultStyle = {
      left: inputElem.offsetLeft,
      top: inputElem.offsetTop + inputElem.height,
      height: `${this.resultHeight}px`,
      minWidth: `${inputElem.clientWidth}px`
    };
  }
  private clear() {
    this.searchResult = [];
    this.showResult = false;
    this.setInputValue();
  }
  private setInputValue() {
    if (this.selectedValue) {
      this.renderer.setValue(this.elem.nativeElement, this.selectedValue);
      this.renderer.setProperty(
        this.elem.nativeElement,
        "textContent",
        this.selectedValue
      );
    } else {
      this.renderer.setValue(this.elem.nativeElement, "");
    }
  }
  //#endregion
}
