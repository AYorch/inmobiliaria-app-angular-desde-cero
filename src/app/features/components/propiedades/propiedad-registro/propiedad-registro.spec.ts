import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropiedadRegistro } from './propiedad-registro';

describe('PropiedadRegistro', () => {
  let component: PropiedadRegistro;
  let fixture: ComponentFixture<PropiedadRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropiedadRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropiedadRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
