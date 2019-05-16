import {
  Component,
  OnInit,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  TemplateRef
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";

@Component({
  selector: "j-tab-panel",
  templateUrl: "./tabs-panel.component.html",
  styleUrls: ["./tabs-panel.component.scss"]
})
export class TabPanelComponent implements AfterContentInit {
  @ContentChildren(TabComponent)
  tabs: QueryList<TabComponent>;

  @Input()
  headerTemplate: TemplateRef<any>;

  ngAfterContentInit() {
    const selectedTab = this.tabs.find(tab => tab.selected);
    if (!selectedTab && this.tabs.first) {
      this.tabs.first.selected = true;
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach(tab => (tab.selected = false));

    tab.selected = true;
  }

  get tabsContext() {
    return {
      tabs: this.tabs
    };
  }
}
