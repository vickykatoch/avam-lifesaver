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
  ArrowDown = 40,
  Space = 32
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
  @ViewChild("multiSelectItemTemplate") multiSelectItemTemplate: TemplateRef<
    any
  >;
  @ViewChild("singleSelectItemTemplate") singleSelectItemTemplate: TemplateRef<
    any
  >;
  showResult = false;
  private subscriptions: Subscription[] = [];
  private searchResult: SearchResultItem[] = [];
  resultStyle: any;
  text: string;
  private _mode = "search";
  private activeIndex = -1;
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
  @Input("jDebounceTime") inputDelay = 200;
  @Input("jMode") set mode(value: string) {
    this._mode = value;
  }
  get mode(): string {
    return this._mode;
  }
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
        selectedItem.isSelected = !selectedItem.isSelected;
      } else {
        this.selected.next(selectedItem.resultItem);
        this.elem.nativeElement.value =
          selectedItem.resultItem[this.displayProp];
        this.clear();
      }
    }
  }
  onOK() {
    const selectedItems = this.searchResult
      .filter(x => x.isSelected)
      .map(i => i.resultItem);
    this.selected.next(selectedItems);
    this.clear();
  }
  onCancel() {
    this.clear();
  }
  @HostListener("keydown", ["$event"])
  handleEsc(event: KeyboardEvent) {
    if (event.keyCode === Key.Escape) {
      this.clear();
      event.preventDefault();
    } else if (event.keyCode === Key.Tab) {
      // this.clear();
      // this.selected.next(null);
    }
  }
  @HostListener("focus", ["$event"])
  handleFocus(event: any) {
    this.activeIndex = -1;
  }
  @HostListener("blur", ["$event"])
  handleBlur(event: any) {
    setTimeout(() => {
      !this.multiSelect && this.clear();
      this.cdr.markForCheck();
    }, 200);
  }
  onBackdropOver(evt: any) {
    console.log(evt);
  }
  get template(): TemplateRef<any> {
    if (this.itemTemplate) {
      return this.itemTemplate;
    } else {
      return this.multiSelect
        ? this.multiSelectItemTemplate
        : this.singleSelectItemTemplate;
    }
  }
  //#endregion

  //#region HELPER METHODS
  private listenInputChange(): Subscription {
    return fromEvent(this.elem.nativeElement, "keyup")
      .pipe(
        filter((e: KeyboardEvent) => this.isKeyValid(e.keyCode)),
        debounceTime(this.inputDelay),
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
    return fromEvent(this.elem.nativeElement, "keydown")
      .pipe(
        filter(
          (e: KeyboardEvent) =>
            this.showResult &&
            (e.keyCode === Key.ArrowDown ||
              e.keyCode === Key.ArrowUp ||
              e.keyCode === Key.Enter)
        ),
        map((e: KeyboardEvent) => {
          e.preventDefault();
          return e.keyCode;
        })
      )
      .subscribe((keyCode: number) => {
        if (keyCode === Key.Enter) {
          this.onEnterKeyPressed(this.activeIndex);
          this.clear();
        } else {
          let step = keyCode === Key.ArrowDown ? 1 : -1;
          const topLimit = this.searchResult.length - 1;
          const bottomLimit = 0;
          this.activeIndex += step;
          if (this.activeIndex === topLimit + 1) {
            this.activeIndex = bottomLimit;
          }
          if (this.activeIndex === bottomLimit - 1) {
            this.activeIndex = topLimit;
          }
          // const elem =this.elem.nativeElement as HTMLInputElement;
          // j-result-item
          this.cdr.markForCheck();
        }
      });
  }
  private onEnterKeyPressed(index: number) {
    if (this.multiSelect) {
      this.onOK();
      this.moveFocus();
    } else {
      if (index >= 0) {
        this.onItemSelected(this.searchResult[index]);
        (this.elem.nativeElement as HTMLInputElement).blur();
      }
    }
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
  private clear(empty?: boolean) {
    this.searchResult = [];
    this.showResult = false;
    this.activeIndex = -1;
  }
  private moveFocus() {
    const elem = this.elem.nativeElement as HTMLInputElement;
    // elem.nextElementSibling.
  }
  private isKeyValid(keyCode: number) {
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
