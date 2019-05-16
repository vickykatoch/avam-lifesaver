import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TabPanelComponent } from "./tabs-panel/tabs-panel.component";
import { TabComponent } from "./tab/tab.component";

@NgModule({
  declarations: [TabPanelComponent, TabComponent],
  imports: [CommonModule],
  exports: [TabPanelComponent, TabComponent]
})
export class TabsModule {}
