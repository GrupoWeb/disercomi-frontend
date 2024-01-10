import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrazabilidadDialogComponent } from './trazabilidad-dialog.component';

describe('TrazabilidadDialogComponent', () => {
  let component: TrazabilidadDialogComponent;
  let fixture: ComponentFixture<TrazabilidadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrazabilidadDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrazabilidadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
