import { PedidoModel } from 'src/adapters/outbound/models/pedido.model';
import { PedidoEntity } from 'src/domain/entities/pedido/pedido.entity';
import { Repository } from 'typeorm';
import { StatusPedido } from '../utils/pedido.enum';
import {
  clienteModelMock,
  clienteEntityMock,
  clienteDTOMock,
} from './cliente.mock';
import {
  AtualizaPedidoDTO,
  CriaPedidoDTO,
  PedidoDTO,
} from 'src/adapters/inbound/rest/v1/presenters/pedido.dto';
import {
  itemPedidoDTOMock,
  itemPedidoEntityMock,
  itemPedidoModelMock,
} from './item_pedido.mock';
import { MensagemGatewayPagamentoDTO, PaymentDTO, PedidoGatewayPagamentoDTO } from 'src/adapters/inbound/rest/v1/presenters/gatewaypag.dto';

// Mock para simular dados da tabela pedido no banco de dados
export const pedidoModelMock = new PedidoModel();
pedidoModelMock.id = '0a14aa4e-75e7-405f-8301-81f60646c93d';
pedidoModelMock.numeroPedido = '05012024';
pedidoModelMock.itensPedido = [itemPedidoModelMock];
pedidoModelMock.cliente = clienteModelMock;
pedidoModelMock.pago = false;
pedidoModelMock.statusPedido = 'recebido';
pedidoModelMock.criadoEm = new Date().toISOString();
pedidoModelMock.atualizadoEm = new Date().toISOString();

// Mock para simular dados da entidade pedido
export const pedidoEntityMock = new PedidoEntity(
  [itemPedidoEntityMock],
  StatusPedido.RECEBIDO,
  '05012024',
  false,
  clienteEntityMock,
);

// Mock para simular o DTO com os dados recebidos pelo usuario ao criar um pedido
export const criaPedidoDTOMock = new CriaPedidoDTO();
criaPedidoDTOMock.itensPedido = [
  { produto: '0a14aa4e-75e7-405f-8301-81f60646c93d', quantidade: 2 },
];
criaPedidoDTOMock.cpfCliente = '83904665030';

// Mock para simular o DTO com os dados recebidos pelo usuario ao atualizar um pedido
export const atualizaPedidoDTOMock = new AtualizaPedidoDTO();
atualizaPedidoDTOMock.statusPedido = StatusPedido.RECEBIDO;

// Mock para simular o DTO com dados de pedido enviados para o usuario ao responder uma requisição
export const pedidoDTOMock = new PedidoDTO();
pedidoDTOMock.id = pedidoModelMock.id;
pedidoDTOMock.numeroPedido = pedidoModelMock.numeroPedido;
pedidoDTOMock.itensPedido = [itemPedidoDTOMock];
pedidoDTOMock.pago = false;
pedidoDTOMock.statusPedido = pedidoModelMock.statusPedido;
pedidoDTOMock.cliente = clienteDTOMock;
pedidoDTOMock.qrCode = null;

export const mensagemGatewayPagamentoDTO = new MensagemGatewayPagamentoDTO();
mensagemGatewayPagamentoDTO.resource = 'https://api.mercadolibre.com/merchant_orders/15171882961';
mensagemGatewayPagamentoDTO.topic = 'merchant_order'

export const pedidoGatewayPagamentoDTO = new PedidoGatewayPagamentoDTO();
pedidoGatewayPagamentoDTO.id = 15171882961;
pedidoGatewayPagamentoDTO.status = 'closed';
pedidoGatewayPagamentoDTO.external_reference = '0a14aa4e-75e7-405f-8301-81f60646c93d';
const itemDTO = new PaymentDTO();
itemDTO.status = "approved";
pedidoGatewayPagamentoDTO.payments = [itemDTO];
pedidoGatewayPagamentoDTO.order_status = 'paid';

// Mock jest das funções do typeORM interagindo com a tabela pedido
export const pedidoTypeORMMock: jest.Mocked<Repository<PedidoModel>> = {
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
} as Partial<jest.Mocked<Repository<PedidoModel>>> as jest.Mocked<
  Repository<PedidoModel>
>;

export const configServiceMock = {
  get: jest.fn((key: string) => {
    if (key === 'ENABLE_MERCADOPAGO') {
      return 'false';
    }
  })
}

// Mock jest das funções do repository pedido
export const pedidoRepositoryMock = {
  criarPedido: jest.fn(),
  editarStatusPedido: jest.fn(),
  editarStatusPagamento: jest.fn(),
  buscarPedido: jest.fn(),
  listarPedidos: jest.fn(),
  listarPedidosRecebido: jest.fn(),
};

// Mock jest das funções do service gateway pagamento
export const gatewayPagamentoServiceMock = {
  criarPedido: jest.fn(),
  consultarPedido: jest.fn(),
};

// Mock jest das funções da factory que cria entidade pedido
export const pedidoFactoryMock = {
  criarItemPedido: jest.fn(),
  criarEntidadeCliente: jest.fn(),
  criarEntidadePedido: jest.fn(),
};

// Mock jest das funções da factory que cria DTO pedido
export const pedidoDTOFactoryMock = {
  criarPedidoDTO: jest.fn(),
  criarListaPedidoDTO: jest.fn(),
  criarListaItemPedidoDTO: jest.fn(),
};

// Mock jest das funções do service que cria numero do pedido
export const pedidoServiceMock = {
  gerarNumeroPedido: jest.fn(),
};

// Mock jest das funções do use case pedido
export const pedidoUseCaseMock = {
  criarPedido: jest.fn(),
  editarPedido: jest.fn(),
  buscarPedido: jest.fn(),
  listarPedidos: jest.fn(),
  listarPedidosRecebido: jest.fn(),
};
