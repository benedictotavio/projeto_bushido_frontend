import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { BlogPost } from 'src/app/models/blog-post'
import { BlogService } from 'src/app/services/blog.service'

@Component({
  selector: 'app-artigo',
  templateUrl: './artigo.component.html',
  styleUrls: ['./artigo.component.css']
})
export class ArtigoComponent implements OnInit {
  ngOnInit(): void {
    const postSlug = this.activatedRoute.snapshot.params['slug']
    this.blogService.getPostBySlug(postSlug).subscribe({
      next: (res) => {
        if (res.data.post != null) {
          this.post = res.data.post
          this.title.setTitle(this.post?.titulo + ' | Blog Bushido')
        } else {
          this.router.navigate(['404'])
        }
      },
      error: (error) => console.error(error)
    })
  }

  constructor(
    private blogService: BlogService,
    private title: Title,
    public router: Router
  ) {}

  public post: BlogPost | undefined

  private activatedRoute = inject(ActivatedRoute)
}
