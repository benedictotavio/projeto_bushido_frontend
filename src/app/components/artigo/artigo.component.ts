import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BlogPost } from 'src/app/models/blog-post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-artigo',
  templateUrl: './artigo.component.html',
  styleUrls: ['./artigo.component.css']
})
export class ArtigoComponent implements OnInit{

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.params['id'];
    this.blogService.getPostById(postId).subscribe({
      next: res => {this.post = res.data.post; this.title.setTitle(this.post?.titulo + ' | Blog Bushido')},
      error: error => console.log(error)
    })
  }

  constructor(private blogService: BlogService, private title: Title) {}

  public post: BlogPost | undefined;

  private activatedRoute = inject(ActivatedRoute);
}
