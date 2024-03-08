import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

  token = localStorage.getItem("token");
  constructor(private router: Router) {
  }
}
