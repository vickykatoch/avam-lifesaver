import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TabsModule } from "./tabs/tabs.module";
import { TabsPanelModule } from "./tab-control/tabs-panel.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, TabsModule, TabsPanelModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
