import {
  Component,
  OnInit,
  ContentChildren,
  QueryList,
  Input,
  TemplateRef,
  AfterContentInit
} from "@angular/core";
import { TabComponent } from "./tab/tab.component";

@Component({
  selector: "app-tabs-panel",
  templateUrl: "./tabs-panel.component.html",
  host: {
    "[class.tabs]": "true",
    "[class.d-flex]": "true",
    "[class.flex-fill]": "true"
  },
  styleUrls: ["./tabs-panel.component.scss"]
})
export class TabsPanelComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Input() headerTemplate: TemplateRef<any>;
  @Input() headerLocation = "top";

  constructor() {}

  ngAfterContentInit() {
    const selectedTabs = this.tabs.filter(c => c.selected);
    selectedTabs.length > 1 &&
      selectedTabs.forEach((tab, i) => (tab.selected = i === 0));
    !selectedTabs.length &&
      this.tabs.length &&
      (this.tabs.first.selected = true);
  }
  public selectTab(tab: TabComponent) {
    const prevSelected = this.tabs.find(t => t.selected);
    if (prevSelected) {
      prevSelected.selected = false;
      prevSelected.deactivated.next();
      tab.selected = true;
      tab.activated.next();
    }
    this.tabs.forEach(t => (t.selected = false));
    tab.selected = true;
  }
  public get tabsContext(): any {
    return {
      tabs: this.tabs
    };
  }
  public closeTab(tab: TabComponent) {
    debugger;
    // this.tabs= this.tabs.filter(tb=> tb!=tab);
    // tab.
  }
  get isVertical(): boolean {
    return this.headerLocation === "left" || this.headerLocation === "right";
  }
}
