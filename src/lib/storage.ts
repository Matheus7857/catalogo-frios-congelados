import { Produto, UsuarioCompleto, TipoComissao } from './types'

// Função para gerar ID único
const gerarId = () => Math.random().toString(36).substr(2, 9)

// PRODUTOS - Agora por usuário
export const salvarProdutosLocalStorage = (produtos: Produto[], usuarioId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`produtos_${usuarioId}`, JSON.stringify(produtos))
  }
}

export const carregarProdutosLocalStorage = (usuarioId: string): Produto[] => {
  if (typeof window !== 'undefined') {
    const produtosSalvos = localStorage.getItem(`produtos_${usuarioId}`)
    return produtosSalvos ? JSON.parse(produtosSalvos) : []
  }
  return []
}

// USUÁRIOS
export const salvarUsuariosLocalStorage = (usuarios: UsuarioCompleto[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios))
  }
}

export const carregarUsuariosLocalStorage = (): UsuarioCompleto[] => {
  if (typeof window !== 'undefined') {
    const usuariosSalvos = localStorage.getItem('usuarios_sistema')
    return usuariosSalvos ? JSON.parse(usuariosSalvos) : []
  }
  return []
}

// TIPOS DE COMISSÃO - Agora por usuário
export const salvarTiposComissaoLocalStorage = (tipos: TipoComissao[], usuarioId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`tipos_comissao_${usuarioId}`, JSON.stringify(tipos))
  }
}

export const carregarTiposComissaoLocalStorage = (usuarioId: string): TipoComissao[] => {
  if (typeof window !== 'undefined') {
    const tiposSalvos = localStorage.getItem(`tipos_comissao_${usuarioId}`)
    return tiposSalvos ? JSON.parse(tiposSalvos) : []
  }
  return []
}

// AUTENTICAÇÃO
export const criarNovaContaUsuario = (email: string, senha: string, nome: string): UsuarioCompleto => {
  const novoUsuario: UsuarioCompleto = {
    id: gerarId(),
    email,
    senha,
    nome,
    tipo: 'admin', // Cada nova conta é admin de seus próprios dados
    ativo: true,
    dataCriacao: new Date().toISOString().split('T')[0]
  }

  // Salvar usuário
  const usuarios = carregarUsuariosLocalStorage()
  usuarios.push(novoUsuario)
  salvarUsuariosLocalStorage(usuarios)

  // Criar tipos de comissão padrão para o novo usuário
  const tiposComissaoPadrao: TipoComissao[] = [
    {
      id: 1,
      nome: 'Básica',
      percentual: 1.0,
      descricao: 'Comissão básica padrão',
      ativo: true,
      usuarioId: novoUsuario.id
    },
    {
      id: 2,
      nome: 'Intermediária',
      percentual: 1.5,
      descricao: 'Comissão intermediária',
      ativo: true,
      usuarioId: novoUsuario.id
    },
    {
      id: 3,
      nome: 'Premium',
      percentual: 2.0,
      descricao: 'Comissão premium',
      ativo: true,
      usuarioId: novoUsuario.id
    },
    {
      id: 4,
      nome: 'VIP',
      percentual: 2.5,
      descricao: 'Comissão VIP',
      ativo: true,
      usuarioId: novoUsuario.id
    }
  ]

  salvarTiposComissaoLocalStorage(tiposComissaoPadrao, novoUsuario.id)

  return novoUsuario
}

export const autenticarUsuario = (email: string, senha: string): UsuarioCompleto | null => {
  const usuarios = carregarUsuariosLocalStorage()
  return usuarios.find(u => u.email === email && u.senha === senha && u.ativo) || null
}

export const verificarEmailExiste = (email: string): boolean => {
  const usuarios = carregarUsuariosLocalStorage()
  return usuarios.some(u => u.email === email)
}

// FUNÇÃO PARA CRIAR VENDEDOR (APENAS ADMIN)
export const criarContaVendedor = (email: string, senha: string, nome: string, adminId: string): UsuarioCompleto => {
  const novoVendedor: UsuarioCompleto = {
    id: gerarId(),
    email,
    senha,
    nome,
    tipo: 'vendedor',
    ativo: true,
    dataCriacao: new Date().toISOString().split('T')[0],
    adminId: adminId // Vincula o vendedor ao admin que o criou
  }

  return novoVendedor
}

// FUNÇÃO PARA BUSCAR USUÁRIO POR ID
export const buscarUsuarioPorId = (id: string): UsuarioCompleto | null => {
  const usuarios = carregarUsuariosLocalStorage()
  return usuarios.find(u => u.id === id) || null
}

export const limparDadosLocalStorage = () => {
  if (typeof window !== 'undefined') {
    // Limpar apenas dados do usuário atual, não todos os usuários
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('produtos_') || key.startsWith('tipos_comissao_')) {
        localStorage.removeItem(key)
      }
    })
  }
}