import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteDemoComponent } from './auto-complete-demo.component';

describe('AutoCompleteDemoComponent', () => {
  let component: AutoCompleteDemoComponent;
  let fixture: ComponentFixture<AutoCompleteDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
