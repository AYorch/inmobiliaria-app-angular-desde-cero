import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropiedadList } from './propiedad-list';

describe('PropiedadList', () => {
  let component: PropiedadList;
  let fixture: ComponentFixture<PropiedadList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropiedadList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropiedadList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
