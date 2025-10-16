import { Produto, UsuarioCompleto, TipoComissao } from './types'

export const TIPOS_COMISSAO_INICIAIS: TipoComissao[] = [
  {
    id: 1,
    nome: "Comissão Básica",
    percentual: 1.0,
    descricao: "Comissão padrão para produtos básicos",
    ativo: true
  },
  {
    id: 2,
    nome: "Comissão Premium",
    percentual: 1.5,
    descricao: "Comissão para produtos premium e especiais",
    ativo: true
  },
  {
    id: 3,
    nome: "Comissão Gourmet",
    percentual: 2.0,
    descricao: "Comissão para produtos gourmet e importados",
    ativo: true
  },
  {
    id: 4,
    nome: "Comissão Promocional",
    percentual: 2.5,
    descricao: "Comissão especial para produtos em promoção",
    ativo: true
  },
  {
    id: 5,
    nome: "Comissão VIP",
    percentual: 3.0,
    descricao: "Comissão máxima para produtos exclusivos",
    ativo: true
  }
]

export const USUARIOS_COMPLETOS_INICIAIS: UsuarioCompleto[] = [
  {
    id: 1,
    usuario: 'admin',
    senha: 'admin123',
    nome: 'Administrador Master',
    tipo: 'admin',
    ativo: true,
    dataCriacao: '2024-01-01'
  },
  {
    id: 2,
    usuario: 'teste',
    senha: 'teste123',
    nome: 'Usuário Teste',
    tipo: 'vendedor',
    ativo: true,
    dataCriacao: '2024-01-15'
  }
]

export const PRODUTOS_INICIAIS: Produto[] = [
  // FRIOS
  {
    id: 1,
    nome: "Presunto Sadia Especial",
    marca: "Sadia",
    categoria: "Presunto",
    precos: [
      { preco: 32.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 33.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 34.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" },
      { preco: 35.90, comissao: 2.5, tipoComissao: "Comissão Promocional" }
    ],
    unidade: "kg",
    estoque: 45,
    codigo: "FR001",
    descricao: "Presunto cozido especial, fatia grossa",
    foto: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    tipo: 'frios'
  },
  {
    id: 2,
    nome: "Queijo Mussarela Tirolez",
    marca: "Tirolez",
    categoria: "Queijo",
    precos: [
      { preco: 28.50, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 29.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 31.50, comissao: 2.0, tipoComissao: "Comissão Gourmet" }
    ],
    unidade: "kg",
    estoque: 28,
    codigo: "FR002",
    descricao: "Queijo mussarela tradicional",
    foto: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop",
    tipo: 'frios'
  },
  {
    id: 3,
    nome: "Mortadela Perdigão Premium",
    marca: "Perdigão",
    categoria: "Mortadela",
    precos: [
      { preco: 16.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 17.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 18.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" },
      { preco: 19.90, comissao: 2.5, tipoComissao: "Comissão Promocional" },
      { preco: 20.90, comissao: 3.0, tipoComissao: "Comissão VIP" }
    ],
    unidade: "kg",
    estoque: 67,
    codigo: "FR003",
    descricao: "Mortadela com pistache",
    foto: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    tipo: 'frios'
  },
  {
    id: 4,
    nome: "Salame Italiano Seara",
    marca: "Seara",
    categoria: "Salame",
    precos: [
      { preco: 42.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 44.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" },
      { preco: 46.90, comissao: 2.5, tipoComissao: "Comissão Promocional" }
    ],
    unidade: "kg",
    estoque: 23,
    codigo: "FR004",
    descricao: "Salame tipo italiano defumado",
    foto: "https://images.unsplash.com/photo-1542574621-e088a4464f7e?w=400&h=300&fit=crop",
    tipo: 'frios'
  },
  {
    id: 5,
    nome: "Peito de Peru Sadia",
    marca: "Sadia",
    categoria: "Peru",
    precos: [
      { preco: 36.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 38.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 40.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" }
    ],
    unidade: "kg",
    estoque: 34,
    codigo: "FR005",
    descricao: "Peito de peru temperado",
    foto: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=300&fit=crop",
    tipo: 'frios'
  },
  {
    id: 6,
    nome: "Queijo Prato Polenghi",
    marca: "Polenghi",
    categoria: "Queijo",
    precos: [
      { preco: 27.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 29.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" },
      { preco: 31.90, comissao: 3.0, tipoComissao: "Comissão VIP" }
    ],
    unidade: "kg",
    estoque: 41,
    codigo: "FR006",
    descricao: "Queijo prato tradicional",
    foto: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=300&fit=crop",
    tipo: 'frios'
  },
  // CONGELADOS
  {
    id: 7,
    nome: "Hambúrguer Seara 90g",
    marca: "Seara",
    categoria: "Hambúrguer",
    precos: [
      { preco: 22.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 24.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 26.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" }
    ],
    unidade: "cx c/20",
    estoque: 89,
    codigo: "CG001",
    descricao: "Hambúrguer bovino congelado",
    foto: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    tipo: 'congelados'
  },
  {
    id: 8,
    nome: "Nuggets Sadia 300g",
    marca: "Sadia",
    categoria: "Nuggets",
    precos: [
      { preco: 11.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 12.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 13.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" },
      { preco: 14.90, comissao: 2.5, tipoComissao: "Comissão Promocional" }
    ],
    unidade: "pct",
    estoque: 156,
    codigo: "CG002",
    descricao: "Nuggets de frango empanado",
    foto: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
    tipo: 'congelados'
  },
  {
    id: 9,
    nome: "Lasanha Perdigão 600g",
    marca: "Perdigão",
    categoria: "Pratos Prontos",
    precos: [
      { preco: 17.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 18.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 19.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" }
    ],
    unidade: "pct",
    estoque: 72,
    codigo: "CG003",
    descricao: "Lasanha à bolonhesa congelada",
    foto: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop",
    tipo: 'congelados'
  },
  {
    id: 10,
    nome: "Pizza Sadia Margherita",
    marca: "Sadia",
    categoria: "Pizza",
    precos: [
      { preco: 14.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 15.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 16.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" },
      { preco: 17.90, comissao: 2.5, tipoComissao: "Comissão Promocional" }
    ],
    unidade: "pct",
    estoque: 94,
    codigo: "CG004",
    descricao: "Pizza margherita congelada",
    foto: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    tipo: 'congelados'
  },
  {
    id: 11,
    nome: "Batata Pré-Frita McCain",
    marca: "McCain",
    categoria: "Batata",
    precos: [
      { preco: 7.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 8.90, comissao: 1.5, tipoComissao: "Comissão Premium" }
    ],
    unidade: "pct 1kg",
    estoque: 203,
    codigo: "CG005",
    descricao: "Batata pré-frita congelada",
    foto: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop",
    tipo: 'congelados'
  },
  {
    id: 12,
    nome: "Sorvete Kibon 2L",
    marca: "Kibon",
    categoria: "Sorvete",
    precos: [
      { preco: 20.90, comissao: 1.0, tipoComissao: "Comissão Básica" },
      { preco: 22.90, comissao: 1.5, tipoComissao: "Comissão Premium" },
      { preco: 24.90, comissao: 2.0, tipoComissao: "Comissão Gourmet" },
      { preco: 26.90, comissao: 2.5, tipoComissao: "Comissão Promocional" },
      { preco: 28.90, comissao: 3.0, tipoComissao: "Comissão VIP" }
    ],
    unidade: "pote",
    estoque: 67,
    codigo: "CG006",
    descricao: "Sorvete napolitano 2 litros",
    foto: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop",
    tipo: 'congelados'
  }
]

export const USUARIOS_DEMO = {
  admin: { usuario: 'admin', senha: 'admin123', nome: 'Administrador', tipo: 'admin' as const },
  teste: { usuario: 'teste', senha: 'teste123', nome: 'Usuário Teste', tipo: 'vendedor' as const }
}