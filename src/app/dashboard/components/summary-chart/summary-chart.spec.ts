import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryChart } from './summary-chart';

describe('SummaryChart', () => {
  let component: SummaryChart;
  let fixture: ComponentFixture<SummaryChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
