// loading.interceptor.ts
import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { LoadingService } from './services/services-admin/service-loading.service'

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.show() // Exibir spinner quando a solicitação começar
    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.hide() // Ocultar spinner quando a solicitação for concluída
      })
    )
  }
}
