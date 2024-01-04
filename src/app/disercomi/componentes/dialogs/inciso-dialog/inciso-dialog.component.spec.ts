import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncisoDialogComponent } from './inciso-dialog.component';

describe('IncisoDialogComponent', () => {
  let component: IncisoDialogComponent;
  let fixture: ComponentFixture<IncisoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncisoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncisoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
