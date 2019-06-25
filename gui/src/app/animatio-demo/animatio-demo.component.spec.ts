import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatioDemoComponent } from './animatio-demo.component';

describe('AnimatioDemoComponent', () => {
  let component: AnimatioDemoComponent;
  let fixture: ComponentFixture<AnimatioDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatioDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatioDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
