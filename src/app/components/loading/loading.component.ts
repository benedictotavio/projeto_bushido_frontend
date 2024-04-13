import { Component } from '@angular/core'
import { LoadingService } from 'src/app/services/services-admin/service-loading.service'

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
