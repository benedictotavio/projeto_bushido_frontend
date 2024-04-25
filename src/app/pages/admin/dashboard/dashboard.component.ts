import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { Chart, registerables } from 'node_modules/chart.js'

Chart.register(...registerables)

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  private readonly role = localStorage.getItem('role')
  protected readonly email = this.route.snapshot.paramMap.get('email')
  protected showDropDown = false

  ngOnInit(): void {
    this.RenderChart()
  }

  RenderChart() {
    new Chart('alunosGenero', {
      type: 'doughnut',
      data: {
        labels: ['Masculino', 'Feminino', 'Outros'],
        datasets: [
          {
            label: '# alunos',
            data: [12, 19, 2],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })

    new Chart('alunosIdade', {
      type: 'bar',
      data: {
        labels: ['0-6', '7-12', '13-18', '19-24', '25-34', '35-44', '35+'],
        datasets: [
          {
            label: '# alunos',
            data: [12, 19, 3, 5, 2, 3, 1],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })

    new Chart('alunosRenda', {
      type: 'bar',
      data: {
        labels: ['0-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
        datasets: [
          {
            label: '# alunos',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      }
    })
  }

  isAdmin(): boolean {
    return this.role?.toUpperCase() === 'ADMIN'
  }

  protected removeToken(): void {
    this.authService.removeToken()
  }

  protected setShowDropDown() {
    this.showDropDown = !this.showDropDown
  }
}
