import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  token = localStorage.getItem('token')
  email = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email']
    })
  }
}
