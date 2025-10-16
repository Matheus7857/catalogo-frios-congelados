export interface ProdutoPreco {
  preco: number
  comissao: number
  tipoComissao: string
}

export interface Produto {
  id: number
  nome: string
  marca: string
  categoria: string
  precos: ProdutoPreco[] // Múltiplos preços com comissões diferentes
  unidade: string
  estoque: number
  codigo: string
  descricao: string
  foto: string
  tipo: 'frios' | 'congelados'
  disponivel: boolean // Nova propriedade para marcar como disponível/indisponível
  usuarioId: string // ID do usuário que criou o produto
}

export interface Usuario {
  nome: string
  tipo: 'admin' | 'vendedor'
  email: string
  id: string
  adminId?: string // ID do admin que criou este vendedor (apenas para vendedores)
}

export interface LoginForm {
  email: string
  senha: string
  nome?: string // Para o cadastro
}

export interface UsuarioCompleto {
  id: string
  email: string
  senha: string
  nome: string
  tipo: 'admin' | 'vendedor'
  ativo: boolean
  dataCriacao: string
  adminId?: string // ID do admin que criou este vendedor (apenas para vendedores)
}

export interface TipoComissao {
  id: number
  nome: string
  percentual: number
  descricao: string
  ativo: boolean
  usuarioId: string // ID do usuário que criou o tipo
}

export interface FormUsuario {
  email: string
  senha: string
  nome: string
  tipo: 'admin' | 'vendedor'
}

export interface FormTipoComissao {
  nome: string
  percentual: number
  descricao: string
}

export interface FormProdutoPreco {
  preco: number
  comissao: number
  tipoComissao: string
}