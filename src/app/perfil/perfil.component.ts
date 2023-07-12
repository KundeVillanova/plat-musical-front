import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UsuarioDto } from '../models/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioDto | undefined;
  perfilForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.perfilForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNascimento: ['', [Validators.required, Validators.pattern('\\d{4}-\\d{2}-\\d{2}')]],
      celular: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const username = this.authService.obterUsername();
    this.authService.getUsuarioByUsername(username).subscribe(usuario => {
      this.usuario = usuario;
      this.preencherFormulario();
    });
  }

  preencherFormulario(): void {
    if (this.usuario) {
      this.perfilForm.patchValue({
        nome: this.usuario.nome,
        email: this.usuario.email,
        dataNascimento: this.formatarData(this.usuario.dataNascimento),
        celular: this.usuario.celular,
        senha: this.usuario.senha
      });
    }
  }

  formatarData(data: string): string {
    const dataObj = new Date(data);
    const ano = dataObj.getFullYear();
    const mes = ('0' + (dataObj.getMonth() + 1)).slice(-2);
    const dia = ('0' + dataObj.getDate()).slice(-2);
    return `${ano}-${mes}-${dia}`;
  }

  atualizarPerfil(): void {
    if (this.perfilForm.valid && this.usuario) {
      const perfilAtualizado: UsuarioDto = {
        ...this.usuario,
        nome: this.perfilForm.value.nome,
        email: this.perfilForm.value.email,
        dataNascimento: this.perfilForm.value.dataNascimento,
        celular: this.perfilForm.value.celular,
        senha: this.perfilForm.value.senha,
        tiposMusicais: this.usuario.tiposMusicais,
        experiencias: this.usuario.experiencias
      };

      this.authService.updateUsuario(this.usuario.idUser, perfilAtualizado).subscribe(() => {
        // Atualize as informações na interface ou redirecione para outra página
      });
    }
  }
}
