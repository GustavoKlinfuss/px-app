import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementaryInfoComponent } from './complementary-info.component';

describe('ComplementaryInfoComponent', () => {
  let component: ComplementaryInfoComponent;
  let fixture: ComponentFixture<ComplementaryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplementaryInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplementaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
