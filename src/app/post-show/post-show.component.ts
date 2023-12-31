import { Component, OnInit } from '@angular/core';
import { PostShowDTO } from '../models/PostShowDto';
import { PostShowService } from '../services/post-show.service';
import { TipoMusicalService } from '../services/tipo-musical.service';
import { AuthService } from '../services/auth.service';
import { TipoMusical } from '../models/TipoMusical';
import { UsuarioDto } from '../models/usuario';

@Component({
  selector: 'app-post-show',
  templateUrl: './post-show.component.html',
  styleUrls: ['./post-show.component.css']
})
export class PostShowComponent implements OnInit {
  postShowForm: PostShowDTO = {
    tituloShow: '',
    descricao: '',
    dia: '',
    hora: '',
    lugar: '',
    ingressos: undefined,
    idTipoShow: undefined,
    idUser: undefined
  };
  tiposMusicais: TipoMusical[] = [];
  tiposMusicaisSelecionados: number[] = [];
  postShowsDoUsuario: PostShowDTO[] = [];
  usuarioLogado: UsuarioDto | undefined;
  isEditing: boolean = false;
  postShowToEdit: PostShowDTO | null = null;


  constructor(
    private postShowService: PostShowService,
    private tipoMusicalService: TipoMusicalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.carregarTiposMusicais();
    this.carregarUsuarioLogado();
  }

  carregarTiposMusicais(): void {
    this.tipoMusicalService.getAllTipoMusicals().subscribe(tiposMusicais => {
      this.tiposMusicais = tiposMusicais.map(tipoMusical => {
        tipoMusical.selecionado = this.tiposMusicaisSelecionados.includes(tipoMusical.id);
        return tipoMusical;
      });
    });
  }

  carregarUsuarioLogado(): void {
    const username = this.authService.obterUsername();
    this.authService.getUsuarioByUsername(username).subscribe(usuario => {
      this.usuarioLogado = usuario;
      this.carregarPostShowsDoUsuario(); // Chame a função para carregar os post shows do usuário após obter o usuário logado
    });
  }

  cadastrarPostShow(): void {
    this.postShowForm.idUser = this.usuarioLogado?.idUser; // Atribua o id do usuário logado ao postShowForm
    this.postShowService.createPostShow(this.postShowForm).subscribe(() => {
      console.log('PostShow cadastrado com sucesso');
      this.carregarPostShowsDoUsuario();
    });
  }

  carregarPostShowsDoUsuario(): void {
    if (this.usuarioLogado) {
      const idUsuarioLogado = this.usuarioLogado.idUser;
      this.postShowService.getPostShowsByUserId(idUsuarioLogado).subscribe(postShows => {
        this.postShowsDoUsuario = postShows;
      });
    }
  }

  excluirPostShow(idShow: number | undefined): void {
    if (idShow) {
      this.postShowService.deletePostShow(idShow).subscribe(
        () => {
          console.log('PostShow excluído com sucesso! ID:', idShow);
          this.carregarPostShowsDoUsuario();
        },
        error => console.log('Erro ao excluir PostShow:', error)
      );
    } else {
      console.log('ID do PostShow não fornecido.');
    }
  }

  selecionarPostShow(postShow: PostShowDTO): void {
    this.isEditing = true; // Define o modo de edição como true
    this.postShowToEdit = postShow; // Armazena o postShow selecionado em postShowToEdit
    this.postShowForm = {
      idShow: this.postShowToEdit.idShow,
      tituloShow: this.postShowToEdit.tituloShow,
      descricao: this.postShowToEdit.descricao,
      dia: this.postShowToEdit.dia,
      hora: this.postShowToEdit.hora,
      lugar: this.postShowToEdit.lugar,
      ingressos: this.postShowToEdit.ingressos,
      idTipoShow: this.postShowToEdit.idTipoShow,
      idUser: this.postShowToEdit.idUser
    };
  }

  editarPostShow(): void {
    if (this.postShowToEdit) {
      // Resto do código para editar o postShow
      // ...
    }
  }
  
}
