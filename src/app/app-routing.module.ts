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
import { AdminComponent } from './pages/admin/admin/admin.component'
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component'
import { RegistroComponent } from './pages/admin/registro/registro.component'
import { isAuthenticated } from './guards/auth.guard'
import { ArtigoComponent } from './components/artigo/artigo.component'
import { SessaoAlunoComponent } from './pages/admin/aluno/sessao-aluno/sessao-aluno.component'
import { RegistroAlunoComponent } from './pages/admin/aluno/registro-aluno/registro-aluno.component'
import { BuscarAlunoComponent } from './pages/admin/aluno/buscar-aluno/buscar-aluno.component'
import { TurmasComponent } from './pages/admin/turma/turmas/turmas.component'
import { SessaoTurmaComponent } from './pages/admin/turma/sessao-turma/sessao-turma.component'
import { isAdmin } from './guards/admin.guard'

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    title: ' Página do  Admin | Instituto Bushido'
  },
  {
    path: 'admin/:email',
    canActivate: [isAuthenticated],
    component: DashboardComponent
  },
  {
    path: 'admin/:email/registro',
    canActivate: [isAuthenticated, isAdmin],
    component: RegistroComponent
  },
  {
    path: 'admin/:email/aluno',
    canActivate: [isAuthenticated, isAdmin],
    component: RegistroAlunoComponent
  },
  {
    path: 'admin/:email/aluno/buscar',
    canActivate: [isAuthenticated],
    component: BuscarAlunoComponent
  },
  {
    path: 'admin/:email/aluno/:rg',
    canActivate: [isAuthenticated],
    component: SessaoAlunoComponent
  },
  {
    path: 'admin/:email/turmas',
    component: TurmasComponent,
    canActivate: [isAuthenticated]
  },
  {
    path: 'admin/:email/turmas/:nomeTurma',
    component: SessaoTurmaComponent,
    canActivate: [isAuthenticated]
  },
  { path: '', component: HomeComponent, title: 'Home | Instituto Bushido' },
  { path: 'quem-somos', component: QuemSomosComponent, title: 'Quem Somos | Instituto Bushido' },
  {
    path: 'karate-sem-fronteiras',
    component: KarateSemFronteirasComponent,
    title: 'Karatê Sem Fronteiras | Instituto Bushido'
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
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'esporte',
        children: [
          {
            path: '',
            component: EsporteComponent,
            title: 'Posts sobre Esporte | Blog Instituto Bushido',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'post',
        children: [
          {
            path: ':slug',
            component: ArtigoComponent
          }
        ]
      }
    ]
  },
  { path: 'contato', component: ContatoComponent, title: 'Contato | Instituto Bushido' },
  {
    path: 'seja-um-doador',
    component: SejaUmDoadorComponent,
    title: 'Seja Um Doador | Instituto Bushido'
  },
  {
    path: 'transparencia',
    component: TransparenciaComponent,
    title: 'Transparência | Instituto Bushido'
  },
  {
    path: '**',
    component: PaginaNaoEncontradaComponent,
    title: 'Página Não Encontrada | Instituto Bushido'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
