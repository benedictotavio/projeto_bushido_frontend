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
import { SaudeComponent } from './pages/blog/saude/saude.component'
import { EsporteComponent } from './pages/blog/esporte/esporte.component'
import { ContatoComponent } from './pages/contato/contato.component'
import { SejaUmDoadorComponent } from './pages/seja-um-doador/seja-um-doador.component'
import { TransparenciaComponent } from './pages/transparencia/transparencia.component'
import { KarateSfMainComponent } from './pages/karate-sem-fronteiras/karate-sf-main/karate-sf-main.component'
import { KarateSfSobreComponent } from './pages/karate-sem-fronteiras/karate-sf-sobre/karate-sf-sobre.component'
import { KarateSfBeneficiosComponent } from './pages/karate-sem-fronteiras/karate-sf-beneficios/karate-sf-beneficios.component'
import { KarateSfOficinasComponent } from './pages/karate-sem-fronteiras/karate-sf-oficinas/karate-sf-oficinas.component'
import { WhatsappButtonComponent } from './components/whatsapp-button/whatsapp-button.component'
import { HttpClientModule } from '@angular/common/http'
import { BlogCardComponent } from './components/blog-card/blog-card.component'
import { ArtigoComponent } from './components/artigo/artigo.component'

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
    SaudeComponent,
    EsporteComponent,
    ContatoComponent,
    SejaUmDoadorComponent,
    TransparenciaComponent,
    KarateSfMainComponent,
    KarateSfSobreComponent,
    KarateSfBeneficiosComponent,
    KarateSfOficinasComponent,
    WhatsappButtonComponent,
    BlogCardComponent,
    ArtigoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
