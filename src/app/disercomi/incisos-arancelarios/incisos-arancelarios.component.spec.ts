import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncisosArancelariosComponent } from './incisos-arancelarios.component';

describe('IncisosArancelariosComponent', () => {
  let component: IncisosArancelariosComponent;
  let fixture: ComponentFixture<IncisosArancelariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncisosArancelariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncisosArancelariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
