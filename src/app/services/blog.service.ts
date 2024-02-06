import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  public url:string = "https://graphql.datocms.com";

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${environment.datoToken}`
    })
  }

  constructor(private http: HttpClient) { }

  public getAllPublishedPosts() {
    const query = "{ allPosts(filter: {_status: {eq: published}}) { id, _updatedAt, titulo, corpo, capa{ url } } }"
    return this.http.get<string>(`${this.url}?query=${encodeURIComponent(query)}`, this.httpOptions);
  }
}
