import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarBoletaDialogComponent } from './cargar-boleta-dialog.component';

describe('CargarBoletaDialogComponent', () => {
  let component: CargarBoletaDialogComponent;
  let fixture: ComponentFixture<CargarBoletaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargarBoletaDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargarBoletaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
