import { Component, Input } from '@angular/core'
import { BlogPost } from 'src/app/models/blog-post'

@Component({
  selector: 'app-blog-card',
  template: `
    <article class="col">
      <img src="{{ post?.capa?.url }}" alt="" class="img-fluid" />

      <h2 class="mt-5">{{ this.post?.titulo }}</h2>

      <h3 class="h6 mt-3 text-primary">{{ post?.categoria?.toUpperCase() }}/ Por marketing Bushido</h3>

      <p class="mt-3" [innerHTML]="post?.corpo?.substring(0, 500) + '...'"></p>

      <a class="btn btn-primary" routerLink="/blog/post/{{ post?.slug }}">Leia Mais</a>
    </article>
  `,
  styles: [``]
})
export class BlogCardComponent {
  @Input() public post: BlogPost | undefined
}
