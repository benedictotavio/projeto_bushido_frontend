import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header/header.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { SessaoMainComponent } from './pages/home/sessao-main/sessao-main.component';
import { SessaoSobreComponent } from './pages/home/sessao-sobre/sessao-sobre.component';
import { SessaoObjetivosComponent } from './pages/home/sessao-objetivos/sessao-objetivos.component';
import { SessaoDepoimentosComponent } from './pages/home/sessao-depoimentos/sessao-depoimentos.component';
import { SessaoPatrocinadoresComponent } from './pages/home/sessao-patrocinadores/sessao-patrocinadores.component';
import { SessaoComoAjudarComponent } from './pages/home/sessao-como-ajudar/sessao-como-ajudar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { QuemSomosComponent } from './pages/quem-somos/quem-somos.component';
import { KarateSemFronteirasComponent } from './pages/karate-sem-fronteiras/karate-sem-fronteiras.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { SejaUmDoadorComponent } from './pages/seja-um-doador/seja-um-doador.component';
import { TransparenciaComponent } from './pages/transparencia/transparencia.component';


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
   
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
