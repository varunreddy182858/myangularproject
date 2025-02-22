import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardViewerComponent } from './business-card-viewer.component';

describe('BusinessCardViewerComponent', () => {
  let component: BusinessCardViewerComponent;
  let fixture: ComponentFixture<BusinessCardViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCardViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
