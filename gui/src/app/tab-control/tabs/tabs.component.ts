import {
  Component,
  OnInit,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input,
  ComponentRef,
  ElementRef,
  ViewChildren
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"]
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @ViewChildren(TabComponent) tabRefs: QueryList<ElementRef>;
  @Input() headerLocation = "top";
  @Input() canClose = true;

  constructor() {}

  ngAfterContentInit(): void {
    const selected = this.tabs.filter(c => c.selected);
    if (selected.length != 1) {
      selected.length > 1 &&
        selected.forEach((tab, i) => (tab.selected = i === 0));
      this.tabs.length && !selected.length && (this.tabs.first.selected = true);
    }
  }
  public onTabSelect(tab: TabComponent) {
    const priorSelected = this.tabs.find(t => t.selected);
    if (priorSelected !== tab) {
      priorSelected.selected = false;
      priorSelected.deactivated.next();
      tab.selected = true;
      tab.activated.next();
    }
    this.tabs.forEach(tb => (tb.selected = false));
    tab.selected = true;
  }
  public get tabsContext(): any {
    return {
      tabs: this.tabs
    };
  }
  closeTab(tab: TabComponent) {}
  get isVertical(): boolean {
    return this.headerLocation === "left" || this.headerLocation === "right";
  }
}
