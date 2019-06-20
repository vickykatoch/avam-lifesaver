import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { TabsPanelModule } from './tab-control/tabs-panel.module';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { AutoCompleteDemoComponent } from './auto-complete-demo/auto-complete-demo.component';
import { CanvasDemoComponent } from './canvas-demo/canvas-demo.component';
import { TabsPanelComponent } from './tabs-panel/tabs-panel.component';
import { TabComponent } from './tabs-panel/tab/tab.component';

@NgModule({
  declarations: [AppComponent, 
    AutoCompleteComponent, 
    AutoCompleteDemoComponent, 
    CanvasDemoComponent, TabsPanelComponent, 
    TabComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
