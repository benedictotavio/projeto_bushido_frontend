import { Component, OnInit } from '@angular/core'
import { BlogPost } from 'src/app/models/blog-post'
import { BlogService } from 'src/app/services/blog.service'

@Component({
  selector: 'app-esporte',
  templateUrl: './esporte.component.html',
  styleUrls: ['./esporte.component.css'],
})
export class EsporteComponent implements OnInit {
  public posts: Array<BlogPost> = []

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getPostsByCategory('esporte').subscribe({
      next: res => (this.posts = res.data.allPosts),
      error: error => console.error(error),
    })
  }
}
