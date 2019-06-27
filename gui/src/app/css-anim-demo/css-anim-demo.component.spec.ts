import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CssAnimDemoComponent } from './css-anim-demo.component';

describe('CssAnimDemoComponent', () => {
  let component: CssAnimDemoComponent;
  let fixture: ComponentFixture<CssAnimDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CssAnimDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CssAnimDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
