import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HanoiGameComponent } from './hanoi-game.component';

describe('HanoiGameComponent', () => {
  let component: HanoiGameComponent;
  let fixture: ComponentFixture<HanoiGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HanoiGameComponent]
    });
    fixture = TestBed.createComponent(HanoiGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
