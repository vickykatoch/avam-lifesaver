import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsPanelModule } from './tab-control/tabs-panel.module';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { AutoCompleteDemoComponent } from './auto-complete-demo/auto-complete-demo.component';

@NgModule({
  declarations: [AppComponent, AutoCompleteComponent, AutoCompleteDemoComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule,  TabsPanelModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
