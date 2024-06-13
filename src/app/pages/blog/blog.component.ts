import { Component, OnInit } from '@angular/core'
import { BlogPost } from 'src/app/models/blog-post'
import { BlogService } from 'src/app/services/blog.service'

@Component({
  selector: 'app-blog',
  template: `
    <main class="container-fluid p-5">
      <h1 class="color-primary text-primary py-5 border-bottom">Posts</h1>
      <section class="container-fluid mt-5">
        <div class="row">
          <app-blog-card *ngFor="let post of posts" [post]="post"></app-blog-card>
        </div>
      </section>
    </main>
  `,
  styles: ['']
})
export class BlogComponent implements OnInit {
  public posts: Array<BlogPost> | undefined

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getAllPublishedPosts().subscribe({
      next: (res) => (this.posts = res.data.allPosts),
      error: (err) => console.error(err)
    })
  }
}
