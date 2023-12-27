import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCalificacionesComponent } from './historial-calificaciones.component';

describe('HistorialCalificacionesComponent', () => {
  let component: HistorialCalificacionesComponent;
  let fixture: ComponentFixture<HistorialCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialCalificacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
