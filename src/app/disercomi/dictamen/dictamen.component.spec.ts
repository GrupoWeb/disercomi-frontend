import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictamenComponent } from './dictamen.component';

describe('DictamenComponent', () => {
  let component: DictamenComponent;
  let fixture: ComponentFixture<DictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictamenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
