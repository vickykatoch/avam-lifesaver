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
  Renderer2,
  HostListener
} from "@angular/core";
import { Subscription, fromEvent, Observable, of } from "rxjs";
import { filter, map, debounceTime, switchMap } from "rxjs/operators";
//#endregion

//#region MODULE TYPES/CONSTANTS
export type QueryFn = (searchString: string) => Observable<any[]>;
export interface SearchResultItem {
  isSelected: boolean;
  resultItem: any;
}
enum Key {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Shift = 16,
  Escape = 27,
  ArrowLeft = 37,
  ArrowRight = 39,
  ArrowUp = 38,
  ArrowDown = 40
}
const DEFAULT_MAX_HEIGHT = 200;
//#endregion

@Component({
  selector: "input[jAutoComplete]",
  templateUrl: "./auto-complete.component.html",
  styleUrls: ["./auto-complete.component.scss"]
})
export class AutoCompleteComponent implements OnInit, OnDestroy {
  //#region FIELDS
  @ViewChild("defaultTemplate") resultTemplate: TemplateRef<any>;
  showResult = false;
  private subscriptions: Subscription[] = [];
  private searchResult: SearchResultItem[] = [];
  resultStyle: any;
  text: string;
  //#endregion

  //#region EXTERNAL INPUT/OUTPUT
  @Input("jItemTemplate") itemTemplate: TemplateRef<any>;
  @Input("jResultLocation") resultLocation = "bottom";
  @Input("jQueryFn") queryFn: QueryFn;
  @Input("jMaxHeight") resultMaxHeight = DEFAULT_MAX_HEIGHT;
  @Input("jWidthOffset") widthOffset = 0;
  @Input("jMultiSelect") multiSelect = false;
  @Input("jDisplayProp") displayProp: string;
  @Input("jSelectedValue") selectedValue: any;
  @Output("jSelected") selected = new EventEmitter<any | any[]>();
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
  onItemSelected(selectedItem: SearchResultItem) {
    if (selectedItem) {
      if (this.multiSelect) {
        selectedItem.isSelected = true;
      } else {
        this.selected.next(selectedItem.resultItem);
        this.clear();
      }
    }
  }
  onSelect(item?: SearchResultItem) {
    if (this.multiSelect) {
      item.isSelected = true;
      // this.selected.next(this.searchResult.filter(x => x.isSelected === true));
    } else {
      this.selectedValue = item.resultItem;
      this.selected.next(item.resultItem);
    }
    this.clear();
  }
  onClear() {
    this.clear();
  }
  @HostListener("keydown", ["$event"])
  handleEsc(event: KeyboardEvent) {
    if (event.keyCode === Key.Escape) {
      this.clear();
      event.preventDefault();
    }
  }
  @HostListener("resize", ["$event"])
  handleResize(event: any) {
    console.log(event);
    debugger;
  }
  //#endregion

  //#region HELPER METHODS
  private listenInputChange(): Subscription {
    return fromEvent(this.elem.nativeElement, "keyup")
      .pipe(
        filter((e: KeyboardEvent) => this.validateNonCharKeyCode(e.keyCode)),
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
        switchMap(str => this.queryFn(str)),
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
        this.cdr.markForCheck();
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
  private isSearchFuncValid(): boolean {
    return this.queryFn && this.queryFn instanceof Function;
  }
  private setResultStyle() {
    const inputElem = this.elem.nativeElement as HTMLInputElement;
    const parentWidth = inputElem.offsetWidth;
    const maxWidth = parentWidth + (+this.widthOffset || 0);
    const top = inputElem.offsetTop + inputElem.offsetHeight;
    this.resultStyle = {
      top: `${top}px`,
      left: `${inputElem.offsetLeft}px`,
      maxHeight: `${this.resultMaxHeight || DEFAULT_MAX_HEIGHT}px`,
      minWidth: `${parentWidth}px`,
      maxWidth: `${maxWidth}px`
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
  private validateNonCharKeyCode(keyCode: number) {
    return [
      Key.Enter,
      Key.Escape,
      Key.Tab,
      Key.Shift,
      Key.ArrowLeft,
      Key.ArrowUp,
      Key.ArrowRight,
      Key.ArrowDown
    ].every(codeKey => codeKey !== keyCode);
  }
  //#endregion
}
