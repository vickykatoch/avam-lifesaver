import {
  Component,
  OnInit,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @Input() headerLocation = 'top';
  @Input() canClose = true;

  constructor() { }

  ngAfterContentInit(): void {
  }
  public onTabClick(tab: TabComponent) {
    this.tabs.forEach(tb => (tb.selected = false));
    tab.selected = true;
  }
  public get tabsContext(): any {
    return {
      tabs: this.tabs
    };
  }
  closeTab(tab: TabComponent) {
  }
  get isVertical(): boolean {
    return this.headerLocation === 'left' || this.headerLocation === 'right';
  }
}
