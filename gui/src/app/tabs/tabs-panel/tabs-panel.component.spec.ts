import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TabPanelComponent } from "./tabs-panel.component";

describe("TabsPanelComponent", () => {
  let component: TabPanelComponent;
  let fixture: ComponentFixture<TabPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabPanelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
