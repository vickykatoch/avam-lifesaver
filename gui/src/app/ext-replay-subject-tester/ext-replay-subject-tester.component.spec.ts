import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtReplaySubjectTesterComponent } from './ext-replay-subject-tester.component';

describe('ExtReplaySubjectTesterComponent', () => {
  let component: ExtReplaySubjectTesterComponent;
  let fixture: ComponentFixture<ExtReplaySubjectTesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtReplaySubjectTesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtReplaySubjectTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
