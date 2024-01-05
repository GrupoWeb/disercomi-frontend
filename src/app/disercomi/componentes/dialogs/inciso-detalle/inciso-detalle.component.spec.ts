import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncisoDetalleComponent } from './inciso-detalle.component';

describe('IncisoDetalleComponent', () => {
  let component: IncisoDetalleComponent;
  let fixture: ComponentFixture<IncisoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncisoDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncisoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
