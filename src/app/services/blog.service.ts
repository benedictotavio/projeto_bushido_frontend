import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../src/environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  public url = 'https://graphql.datocms.com'
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${environment.datoToken}`
    })
  }

  constructor(private http: HttpClient) {}

  public getAllPublishedPosts(): Observable<any> {
    const query =
      '{ allPosts(orderBy: _firstPublishedAt_DESC, filter: {_status: {eq: published}}) { id, categoria, slug, _firstPublishedAt, titulo, corpo, capa{ url } } }'
    return this.http.get<any>(`${this.url}?query=${encodeURIComponent(query)}`, this.httpOptions)
  }

  public getPostsByCategory(categoria: string): Observable<any> {
    const query = `{ allPosts(orderBy: _firstPublishedAt_DESC, filter: {_status: {eq: published}, categoria: {eq: "${categoria}"}}) { id, slug, categoria, _firstPublishedAt, titulo, corpo, capa{ url } } }`

    return this.http.get<any>(`${this.url}?query=${encodeURIComponent(query)}`, this.httpOptions)
  }

  public getPostBySlug(slug: string): Observable<any> {
    const query = `{ post(filter: {slug: {eq: "${slug}"}}) { id, slug, categoria, _firstPublishedAt, titulo, corpo, capa{ url }, autor{ nome, descricao, avatar{url}}} }`

    return this.http.get<any>(`${this.url}?query=${encodeURIComponent(query)}`, this.httpOptions)
  }
}
