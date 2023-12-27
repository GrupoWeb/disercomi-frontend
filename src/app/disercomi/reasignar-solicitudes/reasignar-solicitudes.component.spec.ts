import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasignarSolicitudesComponent } from './reasignar-solicitudes.component';

describe('ReasignarSolicitudesComponent', () => {
  let component: ReasignarSolicitudesComponent;
  let fixture: ComponentFixture<ReasignarSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReasignarSolicitudesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReasignarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
