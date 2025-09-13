import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PropiedadModel } from '../features/models/propiedad-interface';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {
  private http = inject(HttpClient);

  api_base_propiedades = `${environment.API_BASE_PROPIEDADES}`;

  getPropiedades(page: number, limit: number, search : string= '') {
    const url_local = `${this.api_base_propiedades}?direccion_like=${search}&_sort=id&_order=desc&_page=${page}&_limit=${limit}`;
    return this.http.get<PropiedadModel[]>(url_local, { observe: 'response' });
  }

  getPropiedadById(id: number) {
    const url_local = `${this.api_base_propiedades}/${id}`
    return this.http.get<PropiedadModel>(url_local);
  }

  deletePropiedad(id: number) {
    const url_local = `${this.api_base_propiedades}/${id}`
    return this.http.delete(url_local);
  }

  createPropiedad(data: PropiedadModel) {
    return this.http.post(this.api_base_propiedades, data);
  }

  updatePropiedad(data: PropiedadModel) {
    const url_local = `${this.api_base_propiedades}/${data.id}`
    return this.http.put(url_local, data);
  }

}
