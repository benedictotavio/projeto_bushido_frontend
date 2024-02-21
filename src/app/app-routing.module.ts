import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component'
import { QuemSomosComponent } from './pages/quem-somos/quem-somos.component'
import { KarateSemFronteirasComponent } from './pages/karate-sem-fronteiras/karate-sem-fronteiras.component'
import { BlogComponent } from './pages/blog/blog.component'
import { ContatoComponent } from './pages/contato/contato.component'
import { SejaUmDoadorComponent } from './pages/seja-um-doador/seja-um-doador.component'
import { TransparenciaComponent } from './pages/transparencia/transparencia.component'
import { HomeComponent } from './pages/home/home.component'
import { SaudeComponent } from './pages/blog/saude/saude.component'
import { EsporteComponent } from './pages/blog/esporte/esporte.component'
import { ArtigoComponent } from './components/artigo/artigo.component'

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | Instituto Bushido' },
  { path: 'quem-somos', component: QuemSomosComponent, title: 'Quem Somos | Instituto Bushido' },
  {
    path: 'karate-sem-fronteiras',
    component: KarateSemFronteirasComponent,
    title: 'Karatê Sem Fronteiras | Instituto Bushido',
  },
  {
    path: 'blog',
    children: [
      { path: '', component: BlogComponent, title: 'Blog Instituto Bushido', pathMatch: 'full' },
      {
        path: 'saude',
        children: [
          {
            path: '',
            component: SaudeComponent,
            title: 'Posts sobre Saúde | Blog Instituto Bushido',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'esporte',
        children: [
          {
            path: '',
            component: EsporteComponent,
            title: 'Posts sobre Esporte | Blog Instituto Bushido',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'post',
        children: [
          {
            path: ':slug',
            component: ArtigoComponent,
          },
        ],
      },
    ],
  },
  { path: 'contato', component: ContatoComponent, title: 'Contato | Instituto Bushido' },
  {
    path: 'seja-um-doador',
    component: SejaUmDoadorComponent,
    title: 'Seja Um Doador | Instituto Bushido',
  },
  {
    path: 'transparencia',
    component: TransparenciaComponent,
    title: 'Transparência | Instituto Bushido',
  },
  {
    path: '**',
    component: PaginaNaoEncontradaComponent,
    title: 'Página Não Encontrada | Instituto Bushido',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
