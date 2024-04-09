import { Component, OnInit } from '@angular/core'
import { BlogPost } from 'src/app/models/blog-post'
import { BlogService } from 'src/app/services/blog.service'

@Component({
  selector: 'app-saude',
  templateUrl: './saude.component.html',
  styleUrls: ['./saude.component.css'],
})
export class SaudeComponent implements OnInit {
  public posts: Array<BlogPost> = []

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getPostsByCategory('saúde').subscribe({
      next: res => (this.posts = res.data.allPosts),
      error: error => console.error(error),
    })
  }
}
