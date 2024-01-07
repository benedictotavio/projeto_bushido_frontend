import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './components/header/header/header.component'
import { FooterComponent } from './components/footer/footer/footer.component'
import { HomeComponent } from './pages/home/home.component'
import { SessaoMainComponent } from './pages/home/sessao-main/sessao-main.component'
import { SessaoSobreComponent } from './pages/home/sessao-sobre/sessao-sobre.component'
import { SessaoObjetivosComponent } from './pages/home/sessao-objetivos/sessao-objetivos.component'
import { SessaoDepoimentosComponent } from './pages/home/sessao-depoimentos/sessao-depoimentos.component'
import { SessaoPatrocinadoresComponent } from './pages/home/sessao-patrocinadores/sessao-patrocinadores.component'
import { SessaoComoAjudarComponent } from './pages/home/sessao-como-ajudar/sessao-como-ajudar.component'
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component'
import { QuemSomosComponent } from './pages/quem-somos/quem-somos.component'
import { KarateSemFronteirasComponent } from './pages/karate-sem-fronteiras/karate-sem-fronteiras.component'
import { BlogComponent } from './pages/blog/blog.component'
import { ContatoComponent } from './pages/contato/contato.component'
import { SejaUmDoadorComponent } from './pages/seja-um-doador/seja-um-doador.component'
import { TransparenciaComponent } from './pages/transparencia/transparencia.component'
import { KarateSfMainComponent } from './pages/karate-sem-fronteiras/karate-sf-main/karate-sf-main.component'
import { KarateSfSobreComponent } from './pages/karate-sem-fronteiras/karate-sf-sobre/karate-sf-sobre.component'
import { KarateSfBeneficiosComponent } from './pages/karate-sem-fronteiras/karate-sf-beneficios/karate-sf-beneficios.component'
import { KarateSfOficinasComponent } from './pages/karate-sem-fronteiras/karate-sf-oficinas/karate-sf-oficinas.component'
import { SaudeComponent } from './pages/blog/saude/saude.component'
import { EsporteComponent } from './pages/blog/esporte/esporte.component'
import { ArtigoEsporte01Component } from './pages/blog/esporte/artigos/artigo-esporte-01/artigo-esporte-01.component';
import { Artigo01Component } from './pages/blog/saude/artigos-saude/artigo-01/artigo-01.component';
import { ArtigoSaude01Component } from './pages/blog/saude/artigos-saude/artigo-saude-01/artigo-saude-01.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SessaoMainComponent,
    SessaoSobreComponent,
    SessaoObjetivosComponent,
    SessaoDepoimentosComponent,
    SessaoPatrocinadoresComponent,
    SessaoComoAjudarComponent,
    PaginaNaoEncontradaComponent,
    QuemSomosComponent,
    KarateSemFronteirasComponent,
    BlogComponent,
    ContatoComponent,
    SejaUmDoadorComponent,
    TransparenciaComponent,
    KarateSfMainComponent,
    KarateSfSobreComponent,
    KarateSfBeneficiosComponent,
    KarateSfOficinasComponent,
    SaudeComponent,
    EsporteComponent,
    ArtigoEsporte01Component,
    Artigo01Component,
    ArtigoSaude01Component,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
