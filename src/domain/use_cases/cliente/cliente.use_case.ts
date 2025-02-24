import { Inject, Injectable } from '@nestjs/common';
import {
  CriaClienteDTO,
  ClienteDTO,
  AtualizaClienteDTO,
} from 'src/adapters/inbound/rest/v1/presenters/cliente.dto';
import { ClienteModel } from 'src/adapters/outbound/models/cliente.model';
import { ClienteEntity } from 'src/domain/entities/cliente/cliente.entity';
import {
  ClienteNaoLocalizadoErro,
  ClienteDuplicadoErro,
  ClienteNomeUndefinedErro,
} from 'src/domain/exceptions/cliente.exception';
import { IClienteDTOFactory } from 'src/domain/ports/cliente/cliente.dto.factory.port';
import { IClienteRepository } from 'src/domain/ports/cliente/cliente.repository.port';
import { IClienteUseCase } from 'src/domain/ports/cliente/cliente.use_case.port';
import { HTTPResponse } from 'src/utils/HTTPResponse';

@Injectable()
export class ClienteUseCase implements IClienteUseCase {
  constructor(
    @Inject(IClienteRepository)
    private readonly clienteRepository: IClienteRepository,
    @Inject(IClienteDTOFactory)
    private readonly clienteDTOFactory: IClienteDTOFactory,
  ) {}

  private async validarClientePorId(
    clienteId: string,
  ): Promise<ClienteModel | null> {
    const clienteModel =
      await this.clienteRepository.buscarClientePorId(clienteId);
    if (!clienteModel) {
      throw new ClienteNaoLocalizadoErro('Cliente informado não existe');
    }
    return clienteModel;
  }

  private async validarClientePorCPF(
    cpfCliente: string,
  ): Promise<ClienteModel | null> {
    const clienteModel =
      await this.clienteRepository.buscarClientePorCPF(cpfCliente);
    if (clienteModel) {
      throw new ClienteDuplicadoErro('Existe um cliente com esse cpf');
    }
    return clienteModel;
  }

  private async validarClientePorEmail(
    emailCliente: string,
  ): Promise<ClienteModel | null> {
    const clienteModel =
      await this.clienteRepository.buscarClientePorEmail(emailCliente);
    if (clienteModel) {
      throw new ClienteDuplicadoErro('Existe um cliente com esse email');
    }
    return clienteModel;
  }

  async criarCliente(
    cliente: CriaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    const { nome, email, cpf } = cliente;

    if (email) {
      await this.validarClientePorEmail(email);
    }

    if (cpf) {
      await this.validarClientePorCPF(cpf);
    }

    const clienteEntity = new ClienteEntity(nome, email, cpf);
    const result = await this.clienteRepository.criarCliente(clienteEntity);
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);

    return {
      mensagem: 'Cliente criado com sucesso',
      body: clienteDTO,
    };
  }

  async editarCliente(
    clienteId: string,
    cliente: AtualizaClienteDTO,
  ): Promise<HTTPResponse<ClienteDTO>> {
    await this.validarClientePorId(clienteId);
    const { nome, email } = cliente;
    if (nome == null) {
      throw new ClienteNomeUndefinedErro('Informações não preenchidas');
    }
    if (email) {
      await this.validarClientePorEmail(email);
    }
    const clienteEntity = new ClienteEntity(nome, email);
    const result = await this.clienteRepository.editarCliente(
      clienteId,
      clienteEntity,
    );
    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);

    return {
      mensagem: 'Cliente atualizado com sucesso',
      body: clienteDTO,
    };
  }

  async excluirCliente(
    clienteId: string,
  ): Promise<Omit<HTTPResponse<void>, 'body'>> {
    await this.validarClientePorId(clienteId);
    await this.clienteRepository.excluirCliente(clienteId);
    return {
      mensagem: 'Cliente excluído com sucesso',
    };
  }

  async buscarClientePorId(clienteId: string): Promise<ClienteDTO> {
    const result = await this.validarClientePorId(clienteId);

    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);
    return clienteDTO;
  }

  async buscarClientePorCPF(cpfCliente: string): Promise<ClienteDTO> {
    const result = await this.validarClientePorCPF(cpfCliente);

    const clienteDTO = this.clienteDTOFactory.criarClienteDTO(result);
    return clienteDTO;
  }

  async listarClientes(): Promise<ClienteDTO[] | []> {
    const result = await this.clienteRepository.listarClientes();
    const listaClienteDTO = this.clienteDTOFactory.criarListaClienteDTO(result);
    return listaClienteDTO;
  }
}
