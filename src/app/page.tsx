"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Package, 
  Thermometer, 
  DollarSign, 
  Percent, 
  Eye, 
  EyeOff, 
  LogIn, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  User,
  Shield,
  Users,
  Settings,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  X,
  Mail,
  EyeIcon,
  EyeOffIcon,
  Upload,
  Image as ImageIcon,
  Cog,
  Lock,
  Unlock
} from "lucide-react"
import { exportarCatalogoPDF } from "@/lib/pdf-export"
import { Produto, Usuario, LoginForm, UsuarioCompleto, TipoComissao, FormUsuario, FormTipoComissao, ProdutoPreco, FormProdutoPreco } from "@/lib/types"
import { 
  salvarProdutosLocalStorage, 
  carregarProdutosLocalStorage,
  salvarTiposComissaoLocalStorage,
  carregarTiposComissaoLocalStorage,
  criarNovaContaUsuario,
  autenticarUsuario,
  verificarEmailExiste,
  salvarUsuariosLocalStorage,
  carregarUsuariosLocalStorage,
  criarContaVendedor,
  buscarUsuarioPorId
} from "@/lib/storage"

export default function SistemaCatalogo() {
  // Estados principais
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  // 🔹 Restaurar login salvo do navegador
useEffect(() => {
  const usuarioSalvo = localStorage.getItem("usuarioLogado")
  if (usuarioSalvo) {
    try {
      const user = JSON.parse(usuarioSalvo)
      setUsuario(user)
    } catch {
      localStorage.removeItem("usuarioLogado")
    }
  }
}, [])

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [tiposComissao, setTiposComissao] = useState<TipoComissao[]>([])
  const [vendedores, setVendedores] = useState<UsuarioCompleto[]>([])
  const [mostrarComissoes, setMostrarComissoes] = useState(true)
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState<'frios' | 'congelados'>('frios')
  
  // Estados do formulário de login
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', senha: '', nome: '' })
  const [modoLogin, setModoLogin] = useState<'login' | 'cadastro'>('login')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  
  // Estados do painel admin - produtos
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false)
  const [formProduto, setFormProduto] = useState<Partial<Produto>>({
    nome: '',
    marca: '',
    categoria: '',
    precos: [{ preco: 0, comissao: 0, tipoComissao: '' }],
    unidade: '',
    estoque: 0,
    codigo: '',
    descricao: '',
    foto: '',
    tipo: 'frios',
    disponivel: true
  })

  // Estados do painel admin - tipos de comissão
  const [tipoComissaoEditando, setTipoComissaoEditando] = useState<TipoComissao | null>(null)
  const [modalTipoComissaoAberto, setModalTipoComissaoAberto] = useState(false)
  const [formTipoComissao, setFormTipoComissao] = useState<FormTipoComissao>({
    nome: '',
    percentual: 0,
    descricao: ''
  })

  // Estados do painel admin - vendedores
  const [vendedorEditando, setVendedorEditando] = useState<UsuarioCompleto | null>(null)
  const [modalVendedorAberto, setModalVendedorAberto] = useState(false)
  const [formVendedor, setFormVendedor] = useState<FormUsuario>({
    email: '',
    senha: '',
    nome: '',
    tipo: 'vendedor'
  })

  // Estados para upload de imagem
  const [uploadandoImagem, setUploadandoImagem] = useState(false)

  // Carregar dados do usuário logado
  useEffect(() => {
    if (usuario) {
      // Se for vendedor, carregar dados do admin
      const usuarioParaDados = usuario.tipo === 'vendedor' && usuario.adminId 
        ? buscarUsuarioPorId(usuario.adminId) 
        : usuario

      if (usuarioParaDados) {
        const produtosUsuario = carregarProdutosLocalStorage(usuarioParaDados.id)
        setProdutos(produtosUsuario)

        const tiposComissaoUsuario = carregarTiposComissaoLocalStorage(usuarioParaDados.id)
        setTiposComissao(tiposComissaoUsuario)

        // Se for admin, carregar vendedores
        if (usuario.tipo === 'admin') {
          const todosUsuarios = carregarUsuariosLocalStorage()
          const vendedoresDoAdmin = todosUsuarios.filter(u => u.adminId === usuario.id && u.tipo === 'vendedor')
          setVendedores(vendedoresDoAdmin)
        }
      }
    }
  }, [usuario])

  // Salvar produtos no localStorage (apenas admin)
  const salvarProdutos = (novosProdutos: Produto[]) => {
    if (usuario && usuario.tipo === 'admin') {
      setProdutos(novosProdutos)
      salvarProdutosLocalStorage(novosProdutos, usuario.id)
    }
  }

  // Salvar tipos de comissão no localStorage (apenas admin)
  const salvarTiposComissao = (novosTipos: TipoComissao[]) => {
    if (usuario && usuario.tipo === 'admin') {
      setTiposComissao(novosTipos)
      salvarTiposComissaoLocalStorage(novosTipos, usuario.id)
    }
  }

  // Função de login
  const fazerLogin = () => {
    const { email, senha } = loginForm
    
    if (!email || !senha) {
      alert('Email e senha são obrigatórios')
      return
    }

    const usuarioEncontrado = autenticarUsuario(email, senha)
    
  if (usuarioEncontrado) {
  // Salva o login no navegador
  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado))

  // Atualiza o estado do usuário
  setUsuario({
    id: usuarioEncontrado.id,
    nome: usuarioEncontrado.nome,
    tipo: usuarioEncontrado.tipo,
    email: usuarioEncontrado.email,
    adminId: usuarioEncontrado.adminId
  })
} else {
  alert("Email ou senha incorretos, ou usuário inativo")
}

  }

  // Função de cadastro (apenas para admins)
  const fazerCadastro = () => {
    const { email, senha, nome } = loginForm
    
    if (!email || !senha || !nome) {
      alert('Nome, email e senha são obrigatórios')
      return
    }

    // Verificar se email já existe
    if (verificarEmailExiste(email)) {
      alert('Este email já está cadastrado')
      return
    }

    try {
      const novoUsuario = criarNovaContaUsuario(email, senha, nome)
      
      // Fazer login automaticamente
      setUsuario({
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        tipo: novoUsuario.tipo,
        email: novoUsuario.email
      })
      
      alert('Conta criada com sucesso! Você já pode começar a adicionar seus produtos.')
    } catch (error) {
      alert('Erro ao criar conta. Tente novamente.')
    }
  }

  // Função de logout
const fazerLogout = () => {
  // 🔹 Remove o login salvo no navegador (encerra sessão persistente)
  localStorage.removeItem("usuarioLogado")

  // 🔹 Limpa todos os estados da aplicação
  setUsuario(null)          // remove o usuário logado
  setProdutos([])           // limpa os produtos do catálogo
  setTiposComissao([])      // limpa os tipos de comissão
  setVendedores([])         // limpa os vendedores (se for admin)
  setLoginForm({ email: '', senha: '', nome: '' }) // limpa o formulário de login
  setModoLogin('login')     // volta para a tela de login
}


  // Filtrar produtos (incluindo disponibilidade)
  const produtosFiltrados = produtos
    .filter(produto => produto.tipo === categoriaAtiva)
    .filter(produto =>
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.marca.toLowerCase().includes(busca.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(busca.toLowerCase())
    )

  // Calcular valor da comissão
  const calcularComissaoValor = (preco: number, percentual: number) => {
    return (preco * percentual / 100).toFixed(2)
  }

  // FUNÇÕES PARA PRODUTOS (APENAS ADMIN)
  const abrirModalAdicionar = () => {
    if (usuario?.tipo !== 'admin') return
    
    setProdutoEditando(null)
    setFormProduto({
      nome: '',
      marca: '',
      categoria: '',
      precos: [{ preco: 0, comissao: 0, tipoComissao: '' }],
      unidade: '',
      estoque: 0,
      codigo: '',
      descricao: '',
      foto: '',
      tipo: 'frios',
      disponivel: true
    })
    setModalProdutoAberto(true)
  }

  const abrirModalEditar = (produto: Produto) => {
    if (usuario?.tipo !== 'admin') return
    
    setProdutoEditando(produto)
    setFormProduto(produto)
    setModalProdutoAberto(true)
  }

  const adicionarPreco = () => {
    if (formProduto.precos) {
      setFormProduto({
        ...formProduto,
        precos: [...formProduto.precos, { preco: 0, comissao: 0, tipoComissao: '' }]
      })
    }
  }

  const removerPreco = (index: number) => {
    if (formProduto.precos && formProduto.precos.length > 1) {
      const novosPrecos = formProduto.precos.filter((_, i) => i !== index)
      setFormProduto({ ...formProduto, precos: novosPrecos })
    }
  }

  const atualizarPreco = (index: number, campo: keyof ProdutoPreco, valor: any) => {
    if (formProduto.precos) {
      const novosPrecos = [...formProduto.precos]
      novosPrecos[index] = { ...novosPrecos[index], [campo]: valor }
      
      // Se mudou o tipo de comissão, atualizar o percentual automaticamente
      if (campo === 'tipoComissao') {
        const tipoSelecionado = tiposComissao.find(t => t.nome === valor)
        if (tipoSelecionado) {
          novosPrecos[index].comissao = tipoSelecionado.percentual
        }
      }
      
      setFormProduto({ ...formProduto, precos: novosPrecos })
    }
  }

  // Função para simular upload de imagem (converte para base64)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadandoImagem(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormProduto({ ...formProduto, foto: result })
        setUploadandoImagem(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const salvarProduto = () => {
    if (usuario?.tipo !== 'admin') return
    
    if (!formProduto.nome || !formProduto.codigo || !formProduto.precos || formProduto.precos.length === 0) {
      alert('Nome, código e pelo menos um preço são obrigatórios')
      return
    }

    const novosProdutos = [...produtos]
    
    if (produtoEditando) {
      const index = novosProdutos.findIndex(p => p.id === produtoEditando.id)
      novosProdutos[index] = { 
        ...formProduto as Produto, 
        id: produtoEditando.id,
        usuarioId: usuario.id
      }
    } else {
      const novoId = Math.max(0, ...produtos.map(p => p.id)) + 1
      novosProdutos.push({ 
        ...formProduto as Produto, 
        id: novoId,
        usuarioId: usuario.id
      })
    }
    
    salvarProdutos(novosProdutos)
    setModalProdutoAberto(false)
  }

  const toggleDisponibilidadeProduto = (id: number) => {
    if (usuario?.tipo !== 'admin') return
    
    const novosProdutos = produtos.map(p => 
      p.id === id ? { ...p, disponivel: !p.disponivel } : p
    )
    salvarProdutos(novosProdutos)
  }

  const excluirProduto = (id: number) => {
    if (usuario?.tipo !== 'admin') return
    
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const novosProdutos = produtos.filter(p => p.id !== id)
      salvarProdutos(novosProdutos)
    }
  }

  // FUNÇÕES PARA TIPOS DE COMISSÃO (APENAS ADMIN)
  const abrirModalAdicionarTipoComissao = () => {
    if (usuario?.tipo !== 'admin') return
    
    setTipoComissaoEditando(null)
    setFormTipoComissao({
      nome: '',
      percentual: 0,
      descricao: ''
    })
    setModalTipoComissaoAberto(true)
  }

  const abrirModalEditarTipoComissao = (tipo: TipoComissao) => {
    if (usuario?.tipo !== 'admin') return
    
    setTipoComissaoEditando(tipo)
    setFormTipoComissao({
      nome: tipo.nome,
      percentual: tipo.percentual,
      descricao: tipo.descricao
    })
    setModalTipoComissaoAberto(true)
  }

  const salvarTipoComissao = () => {
    if (usuario?.tipo !== 'admin') return
    
    if (!formTipoComissao.nome || formTipoComissao.percentual <= 0) {
      alert('Nome e percentual são obrigatórios')
      return
    }

    const novosTipos = [...tiposComissao]
    
    if (tipoComissaoEditando) {
      const index = novosTipos.findIndex(t => t.id === tipoComissaoEditando.id)
      novosTipos[index] = { 
        ...tipoComissaoEditando, 
        ...formTipoComissao
      }
    } else {
      const novoId = Math.max(0, ...tiposComissao.map(t => t.id)) + 1
      novosTipos.push({ 
        id: novoId,
        ...formTipoComissao,
        ativo: true,
        usuarioId: usuario.id
      })
    }
    
    salvarTiposComissao(novosTipos)
    setModalTipoComissaoAberto(false)
  }

  const toggleTipoComissaoAtivo = (id: number) => {
    if (usuario?.tipo !== 'admin') return
    
    const novosTipos = tiposComissao.map(t => 
      t.id === id ? { ...t, ativo: !t.ativo } : t
    )
    salvarTiposComissao(novosTipos)
  }

  const excluirTipoComissao = (id: number) => {
    if (usuario?.tipo !== 'admin') return
    
    if (confirm('Tem certeza que deseja excluir este tipo de comissão?')) {
      const novosTipos = tiposComissao.filter(t => t.id !== id)
      salvarTiposComissao(novosTipos)
    }
  }

  // FUNÇÕES PARA VENDEDORES (APENAS ADMIN)
  const abrirModalAdicionarVendedor = () => {
    if (usuario?.tipo !== 'admin') return
    
    setVendedorEditando(null)
    setFormVendedor({
      email: '',
      senha: '',
      nome: '',
      tipo: 'vendedor'
    })
    setModalVendedorAberto(true)
  }

  const abrirModalEditarVendedor = (vendedor: UsuarioCompleto) => {
    if (usuario?.tipo !== 'admin') return
    
    setVendedorEditando(vendedor)
    setFormVendedor({
      email: vendedor.email,
      senha: '', // Não mostrar senha atual
      nome: vendedor.nome,
      tipo: vendedor.tipo
    })
    setModalVendedorAberto(true)
  }

  const salvarVendedor = () => {
    if (usuario?.tipo !== 'admin') return
    
    if (!formVendedor.nome || !formVendedor.email) {
      alert('Nome e email são obrigatórios')
      return
    }

    if (!vendedorEditando && !formVendedor.senha) {
      alert('Senha é obrigatória para novos vendedores')
      return
    }

    const todosUsuarios = carregarUsuariosLocalStorage()
    
    if (vendedorEditando) {
      // Editar vendedor existente
      const index = todosUsuarios.findIndex(u => u.id === vendedorEditando.id)
      if (index !== -1) {
        todosUsuarios[index] = {
          ...todosUsuarios[index],
          nome: formVendedor.nome,
          email: formVendedor.email,
          tipo: formVendedor.tipo, // Permitir mudança entre admin e vendedor
          ...(formVendedor.senha && { senha: formVendedor.senha }) // Só atualiza senha se fornecida
        }
      }
    } else {
      // Verificar se email já existe
      if (todosUsuarios.some(u => u.email === formVendedor.email)) {
        alert('Este email já está cadastrado')
        return
      }

      // Criar novo usuário (admin ou vendedor)
      const novoUsuario = criarContaVendedor(
        formVendedor.email,
        formVendedor.senha,
        formVendedor.nome,
        usuario.id
      )
      
      // Definir o tipo correto
      novoUsuario.tipo = formVendedor.tipo
      
      todosUsuarios.push(novoUsuario)
    }
    
    salvarUsuariosLocalStorage(todosUsuarios)
    
    // Atualizar lista de vendedores
    const vendedoresAtualizados = todosUsuarios.filter(u => u.adminId === usuario.id)
    setVendedores(vendedoresAtualizados)
    
    setModalVendedorAberto(false)
  }

  const toggleVendedorAtivo = (id: string) => {
    if (usuario?.tipo !== 'admin') return
    
    const todosUsuarios = carregarUsuariosLocalStorage()
    const index = todosUsuarios.findIndex(u => u.id === id)
    
    if (index !== -1) {
      todosUsuarios[index].ativo = !todosUsuarios[index].ativo
      salvarUsuariosLocalStorage(todosUsuarios)
      
      // Atualizar lista de vendedores
      const vendedoresAtualizados = todosUsuarios.filter(u => u.adminId === usuario?.id)
      setVendedores(vendedoresAtualizados)
    }
  }

  const excluirVendedor = (id: string) => {
    if (usuario?.tipo !== 'admin') return
    
    if (confirm('Tem certeza que deseja excluir este usuário? Todos os dados dele serão perdidos.')) {
      const todosUsuarios = carregarUsuariosLocalStorage()
      const usuariosFiltrados = todosUsuarios.filter(u => u.id !== id)
      salvarUsuariosLocalStorage(usuariosFiltrados)
      
      // Atualizar lista de vendedores
      const vendedoresAtualizados = usuariosFiltrados.filter(u => u.adminId === usuario?.id)
      setVendedores(vendedoresAtualizados)
    }
  }

  // Exportar para PDF (disponível para todos)
  const exportarPDF = () => {
    try {
      const produtosDisponiveis = produtosFiltrados.filter(p => p.disponivel)
      const nomeArquivo = exportarCatalogoPDF(produtosDisponiveis, categoriaAtiva)
      alert(`PDF "${nomeArquivo}" gerado com sucesso! (${produtosDisponiveis.length} produtos disponíveis, sem comissões)`)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }

  // Verificar se usuário tem permissão para editar
  const podeEditar = usuario?.tipo === 'admin'

  // Tela de login
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              🏪 Sistema de Catálogo
            </CardTitle>
            <p className="text-gray-600">Distribuidora de Frios e Congelados</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Toggle Login/Cadastro */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={modoLogin === 'login' ? 'default' : 'ghost'}
                onClick={() => setModoLogin('login')}
                className="flex-1"
              >
                Entrar
              </Button>
              <Button
                variant={modoLogin === 'cadastro' ? 'default' : 'ghost'}
                onClick={() => setModoLogin('cadastro')}
                className="flex-1"
              >
                Criar Conta Admin
              </Button>
            </div>

            {/* Campo Nome (apenas no cadastro) */}
            {modoLogin === 'cadastro' && (
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  placeholder="Digite seu nome completo"
                  value={loginForm.nome || ''}
                  onChange={(e) => setLoginForm({...loginForm, nome: e.target.value})}
                />
              </div>
            )}

            {/* Campo Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={loginForm.senha}
                  onChange={(e) => setLoginForm({...loginForm, senha: e.target.value})}
                  className="pr-10"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      modoLogin === 'login' ? fazerLogin() : fazerCadastro()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            {modoLogin === 'login' ? (
              <Button onClick={fazerLogin} className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            ) : (
              <Button onClick={fazerCadastro} className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Criar Conta Admin
              </Button>
            )}

            {modoLogin === 'cadastro' && (
              <p className="text-xs text-gray-500 text-center">
                Ao criar uma conta admin, você terá seu próprio catálogo e poderá criar contas para vendedores.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🏪 Meu Catálogo
              </h1>
              <p className="text-gray-600">
                Bem-vindo, {usuario.nome}! 
                {usuario.tipo === 'admin' ? ' Gerencie seus produtos, comissões e usuários' : ' Visualize produtos e baixe PDFs'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Usuário logado */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                {usuario.tipo === 'admin' ? (
                  <Shield className="w-4 h-4 text-blue-600" />
                ) : (
                  <User className="w-4 h-4 text-green-600" />
                )}
                <span className="text-sm font-medium">{usuario.nome}</span>
                <Badge variant={usuario.tipo === 'admin' ? 'default' : 'secondary'}>
                  {usuario.tipo === 'admin' ? 'Admin' : 'Vendedor'}
                </Badge>
              </div>
              
              {/* Toggle Comissões */}
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                <Label htmlFor="comissoes" className="text-sm font-medium">
                  {mostrarComissoes ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
                  Comissões
                </Label>
                <Switch
                  id="comissoes"
                  checked={mostrarComissoes}
                  onCheckedChange={setMostrarComissoes}
                />
              </div>
              
              <Button onClick={fazerLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Navegação Principal */}
          <div className="mt-6">
            <Tabs defaultValue="catalogo" className="w-full">
              <TabsList className={`grid w-full ${podeEditar ? 'grid-cols-2' : 'grid-cols-1'} h-12`}>
                <TabsTrigger value="catalogo" className="text-lg">
                  <Package className="w-5 h-5 mr-2" />
                  Catálogo ({produtos.length})
                </TabsTrigger>
                {podeEditar && (
                  <TabsTrigger value="configuracoes" className="text-lg">
                    <Cog className="w-5 h-5 mr-2" />
                    Configurações
                  </TabsTrigger>
                )}
              </TabsList>

              {/* ABA CATÁLOGO */}
              <TabsContent value="catalogo">
                {/* Barra de Busca e Ações */}
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Buscar por produto, marca, categoria ou código..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={exportarPDF} variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar PDF
                    </Button>
                    
                    {podeEditar && (
                      <Button onClick={abrirModalAdicionar} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Produto
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tabs Frios/Congelados */}
                <Tabs value={categoriaAtiva} onValueChange={(value) => setCategoriaAtiva(value as 'frios' | 'congelados')} className="w-full mt-6">
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                    <TabsTrigger value="frios" className="text-lg">
                      <Package className="w-5 h-5 mr-2" />
                      Frios ({produtos.filter(p => p.tipo === 'frios').length})
                    </TabsTrigger>
                    <TabsTrigger value="congelados" className="text-lg">
                      <Thermometer className="w-5 h-5 mr-2" />
                      Congelados ({produtos.filter(p => p.tipo === 'congelados').length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={categoriaAtiva}>
                    {/* Grid de Produtos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {produtosFiltrados.map((produto) => (
                        <Card key={produto.id} className={`hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white overflow-hidden ${!produto.disponivel ? 'opacity-60 border-red-200' : ''}`}>
                          {/* Status de disponibilidade */}
                          {!produto.disponivel && (
                            <div className="bg-red-500 text-white text-center py-1 text-sm font-medium">
                              INDISPONÍVEL
                            </div>
                          )}
                          
                          {/* Foto do produto */}
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={produto.foto} 
                              alt={produto.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
                              }}
                            />
                          </div>
                          
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                              <Badge variant="outline" className="text-xs">
                                {produto.codigo}
                              </Badge>
                              <Badge 
                                variant={produto.estoque > 50 ? "default" : produto.estoque > 20 ? "secondary" : "destructive"}
                                className="text-xs"
                              >
                                {produto.estoque} un
                              </Badge>
                            </div>
                            <CardTitle className="text-lg leading-tight">
                              {produto.nome}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">{produto.marca}</span>
                              <span>•</span>
                              <span>{produto.categoria}</span>
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                              {produto.descricao}
                            </p>
                            
                            {/* Múltiplos Preços */}
                            <div className="space-y-3 mb-4">
                              {produto.precos.map((preco, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="w-4 h-4 text-green-600" />
                                      <span className="text-xl font-bold text-green-600">
                                        R$ {preco.preco.toFixed(2)}
                                      </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                      por {produto.unidade}
                                    </span>
                                  </div>

                                  {/* Comissão (condicional) */}
                                  {mostrarComissoes && (
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded border border-purple-200">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Percent className="w-3 h-3 text-purple-600" />
                                          <span className="text-xs font-medium text-purple-700">
                                            {preco.comissao}% - {preco.tipoComissao}
                                          </span>
                                        </div>
                                        <span className="text-sm font-bold text-purple-600">
                                          R$ {calcularComissaoValor(preco.preco, preco.comissao)}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Ações (apenas para Admin) */}
                            {podeEditar && (
                              <div className="flex gap-2 mb-4">
                                <Button 
                                  onClick={() => abrirModalEditar(produto)}
                                  variant="outline" 
                                  size="sm"
                                  className="flex-1"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Editar
                                </Button>
                                <Button 
                                  onClick={() => toggleDisponibilidadeProduto(produto.id)}
                                  variant="outline" 
                                  size="sm"
                                  className={produto.disponivel ? "text-orange-600 border-orange-200" : "text-green-600 border-green-200"}
                                >
                                  {produto.disponivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                                <Button 
                                  onClick={() => excluirProduto(produto.id)}
                                  variant="destructive" 
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Mensagem quando não há resultados */}
                    {produtosFiltrados.length === 0 && (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          {produtos.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}
                        </h3>
                        <p className="text-gray-500">
                          {produtos.length === 0 
                            ? (podeEditar ? 'Comece adicionando seu primeiro produto ao catálogo' : 'Aguarde o administrador adicionar produtos')
                            : 'Tente ajustar sua busca ou verificar a categoria selecionada'
                          }
                        </p>
                        {produtos.length === 0 && podeEditar && (
                          <Button onClick={abrirModalAdicionar} className="mt-4">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Primeiro Produto
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>

              {/* ABA CONFIGURAÇÕES (APENAS ADMIN) */}
              {podeEditar && (
                <TabsContent value="configuracoes">
                  <div className="mt-6">
                    <Tabs defaultValue="comissoes" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 h-12">
                        <TabsTrigger value="comissoes" className="text-lg">
                          <Percent className="w-5 h-5 mr-2" />
                          Comissões ({tiposComissao.length})
                        </TabsTrigger>
                        <TabsTrigger value="usuarios" className="text-lg">
                          <Users className="w-5 h-5 mr-2" />
                          Usuários ({vendedores.length})
                        </TabsTrigger>
                      </TabsList>

                      {/* SUB-ABA TIPOS DE COMISSÃO */}
                      <TabsContent value="comissoes">
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Tipos de Comissão</h2>
                            <Button onClick={abrirModalAdicionarTipoComissao} className="bg-purple-600 hover:bg-purple-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Adicionar Tipo
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tiposComissao.map((tipo) => (
                              <Card key={tipo.id} className="bg-white">
                                <CardHeader>
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{tipo.nome}</CardTitle>
                                    <Badge variant={tipo.ativo ? "default" : "secondary"}>
                                      {tipo.ativo ? "Ativo" : "Inativo"}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2">
                                      <Percent className="w-4 h-4 text-purple-600" />
                                      <span className="text-2xl font-bold text-purple-600">
                                        {tipo.percentual}%
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {tipo.descricao}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => abrirModalEditarTipoComissao(tipo)}
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1"
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      Editar
                                    </Button>
                                    <Button 
                                      onClick={() => toggleTipoComissaoAtivo(tipo.id)}
                                      variant="outline" 
                                      size="sm"
                                    >
                                      {tipo.ativo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                    </Button>
                                    <Button 
                                      onClick={() => excluirTipoComissao(tipo.id)}
                                      variant="destructive" 
                                      size="sm"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {tiposComissao.length === 0 && (
                            <div className="text-center py-12">
                              <Percent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Nenhum tipo de comissão cadastrado
                              </h3>
                              <p className="text-gray-500">
                                Adicione tipos de comissão para usar nos seus produtos
                              </p>
                              <Button onClick={abrirModalAdicionarTipoComissao} className="mt-4">
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Primeiro Tipo
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      {/* SUB-ABA USUÁRIOS */}
                      <TabsContent value="usuarios">
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
                            <Button onClick={abrirModalAdicionarVendedor} className="bg-green-600 hover:bg-green-700">
                              <UserPlus className="w-4 h-4 mr-2" />
                              Criar Usuário
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vendedores.map((vendedor) => (
                              <Card key={vendedor.id} className="bg-white">
                                <CardHeader>
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{vendedor.nome}</CardTitle>
                                    <div className="flex flex-col gap-1">
                                      <Badge variant={vendedor.ativo ? "default" : "secondary"}>
                                        {vendedor.ativo ? "Ativo" : "Inativo"}
                                      </Badge>
                                      <Badge variant={vendedor.tipo === 'admin' ? "destructive" : "outline"}>
                                        {vendedor.tipo === 'admin' ? (
                                          <>
                                            <Shield className="w-3 h-3 mr-1" />
                                            Admin
                                          </>
                                        ) : (
                                          <>
                                            <User className="w-3 h-3 mr-1" />
                                            Vendedor
                                          </>
                                        )}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-blue-600" />
                                      <span className="text-sm text-gray-600">
                                        {vendedor.email}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4 text-green-600" />
                                      <span className="text-sm text-gray-600">
                                        Criado em {vendedor.dataCriacao}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {vendedor.tipo === 'admin' ? (
                                        <Unlock className="w-4 h-4 text-red-600" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-gray-600" />
                                      )}
                                      <span className="text-sm text-gray-600">
                                        {vendedor.tipo === 'admin' ? 'Acesso total' : 'Apenas visualização'}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => abrirModalEditarVendedor(vendedor)}
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1"
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      Editar
                                    </Button>
                                    <Button 
                                      onClick={() => toggleVendedorAtivo(vendedor.id)}
                                      variant="outline" 
                                      size="sm"
                                    >
                                      {vendedor.ativo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                    </Button>
                                    <Button 
                                      onClick={() => excluirVendedor(vendedor.id)}
                                      variant="destructive" 
                                      size="sm"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {vendedores.length === 0 && (
                            <div className="text-center py-12">
                              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Nenhum usuário cadastrado
                              </h3>
                              <p className="text-gray-500">
                                Crie usuários para que eles possam acessar o sistema
                              </p>
                              <Button onClick={abrirModalAdicionarVendedor} className="mt-4">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Criar Primeiro Usuário
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>

        {/* Resumo no rodapé */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <div className={`grid grid-cols-1 ${podeEditar ? 'md:grid-cols-5' : 'md:grid-cols-4'} gap-6 text-center`}>
            <div>
              <h3 className="text-2xl font-bold text-blue-600">
                {produtos.length}
              </h3>
              <p className="text-gray-600">Total de Produtos</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-600">
                {produtos.filter(p => p.disponivel).length}
              </h3>
              <p className="text-gray-600">Produtos Disponíveis</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-600">
                {tiposComissao.filter(t => t.ativo).length}
              </h3>
              <p className="text-gray-600">Tipos de Comissão</p>
            </div>
            {podeEditar && (
              <div>
                <h3 className="text-2xl font-bold text-indigo-600">
                  {vendedores.filter(v => v.ativo).length}
                </h3>
                <p className="text-gray-600">Usuários Ativos</p>
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-orange-600">
                {usuario.email}
              </h3>
              <p className="text-gray-600">Sua Conta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Produto (APENAS ADMIN) */}
      {podeEditar && (
        <Dialog open={modalProdutoAberto} onOpenChange={setModalProdutoAberto}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {produtoEditando ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="nome">Nome do Produto *</Label>
                <Input
                  id="nome"
                  value={formProduto.nome}
                  onChange={(e) => setFormProduto({...formProduto, nome: e.target.value})}
                  placeholder="Ex: Presunto Sadia Especial"
                />
              </div>
              
              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formProduto.codigo}
                  onChange={(e) => setFormProduto({...formProduto, codigo: e.target.value})}
                  placeholder="Ex: FR001"
                />
              </div>
              
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  value={formProduto.marca}
                  onChange={(e) => setFormProduto({...formProduto, marca: e.target.value})}
                  placeholder="Ex: Sadia"
                />
              </div>
              
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={formProduto.categoria}
                  onChange={(e) => setFormProduto({...formProduto, categoria: e.target.value})}
                  placeholder="Ex: Presunto"
                />
              </div>
              
              <div>
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={formProduto.unidade}
                  onChange={(e) => setFormProduto({...formProduto, unidade: e.target.value})}
                  placeholder="Ex: kg, pct, cx"
                />
              </div>
              
              <div>
                <Label htmlFor="estoque">Estoque</Label>
                <Input
                  id="estoque"
                  type="number"
                  value={formProduto.estoque}
                  onChange={(e) => setFormProduto({...formProduto, estoque: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select 
                  value={formProduto.tipo} 
                  onValueChange={(value: 'frios' | 'congelados') => setFormProduto({...formProduto, tipo: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frios">🧊 Frios</SelectItem>
                    <SelectItem value="congelados">❄️ Congelados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="foto">Foto do Produto</Label>
                <div className="space-y-2">
                  <Input
                    id="foto"
                    value={formProduto.foto}
                    onChange={(e) => setFormProduto({...formProduto, foto: e.target.value})}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="upload-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('upload-image')?.click()}
                      disabled={uploadandoImagem}
                      className="flex-1"
                    >
                      {uploadandoImagem ? (
                        <>
                          <Upload className="w-4 h-4 mr-2 animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Carregar PNG/JPG
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formProduto.descricao}
                onChange={(e) => setFormProduto({...formProduto, descricao: e.target.value})}
                placeholder="Descrição detalhada do produto"
                rows={3}
              />
            </div>

            {/* Seção de Preços */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-lg font-semibold">Preços e Comissões</Label>
                <Button onClick={adicionarPreco} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Preço
                </Button>
              </div>
              
              <div className="space-y-4">
                {formProduto.precos?.map((preco, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Opção de Preço {index + 1}</h4>
                      {formProduto.precos && formProduto.precos.length > 1 && (
                        <Button 
                          onClick={() => removerPreco(index)}
                          variant="destructive" 
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={preco.preco}
                          onChange={(e) => atualizarPreco(index, 'preco', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label>Tipo de Comissão</Label>
                        <Select 
                          value={preco.tipoComissao} 
                          onValueChange={(value) => atualizarPreco(index, 'tipoComissao', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposComissao.filter(t => t.ativo).map(tipo => (
                              <SelectItem key={tipo.id} value={tipo.nome}>
                                {tipo.nome} ({tipo.percentual}%)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Comissão (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={preco.comissao}
                          onChange={(e) => atualizarPreco(index, 'comissao', parseFloat(e.target.value) || 0)}
                          readOnly
                          className="bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalProdutoAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarProduto}>
                {produtoEditando ? 'Salvar Alterações' : 'Adicionar Produto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Tipo de Comissão (APENAS ADMIN) */}
      {podeEditar && (
        <Dialog open={modalTipoComissaoAberto} onOpenChange={setModalTipoComissaoAberto}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {tipoComissaoEditando ? '✏️ Editar Tipo de Comissão' : '➕ Adicionar Tipo de Comissão'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nomeTipo">Nome do Tipo *</Label>
                <Input
                  id="nomeTipo"
                  value={formTipoComissao.nome}
                  onChange={(e) => setFormTipoComissao({...formTipoComissao, nome: e.target.value})}
                  placeholder="Ex: Comissão Especial"
                />
              </div>
              
              <div>
                <Label htmlFor="percentualTipo">Percentual (%) *</Label>
                <Input
                  id="percentualTipo"
                  type="number"
                  step="0.1"
                  value={formTipoComissao.percentual}
                  onChange={(e) => setFormTipoComissao({...formTipoComissao, percentual: parseFloat(e.target.value) || 0})}
                  placeholder="Ex: 2.5"
                />
              </div>
              
              <div>
                <Label htmlFor="descricaoTipo">Descrição</Label>
                <Textarea
                  id="descricaoTipo"
                  value={formTipoComissao.descricao}
                  onChange={(e) => setFormTipoComissao({...formTipoComissao, descricao: e.target.value})}
                  placeholder="Descrição do tipo de comissão"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalTipoComissaoAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarTipoComissao}>
                {tipoComissaoEditando ? 'Salvar Alterações' : 'Adicionar Tipo'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Usuário (APENAS ADMIN) */}
      {podeEditar && (
        <Dialog open={modalVendedorAberto} onOpenChange={setModalVendedorAberto}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {vendedorEditando ? '✏️ Editar Usuário' : '➕ Criar Usuário'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nomeVendedor">Nome Completo *</Label>
                <Input
                  id="nomeVendedor"
                  value={formVendedor.nome}
                  onChange={(e) => setFormVendedor({...formVendedor, nome: e.target.value})}
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div>
                <Label htmlFor="emailVendedor">Email *</Label>
                <Input
                  id="emailVendedor"
                  type="email"
                  value={formVendedor.email}
                  onChange={(e) => setFormVendedor({...formVendedor, email: e.target.value})}
                  placeholder="joao@exemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="senhaVendedor">
                  Senha {vendedorEditando ? '(deixe vazio para manter atual)' : '*'}
                </Label>
                <Input
                  id="senhaVendedor"
                  type="password"
                  value={formVendedor.senha}
                  onChange={(e) => setFormVendedor({...formVendedor, senha: e.target.value})}
                  placeholder={vendedorEditando ? "Nova senha (opcional)" : "Digite a senha"}
                />
              </div>

              <div>
                <Label htmlFor="tipoUsuario">Tipo de Usuário *</Label>
                <Select 
                  value={formVendedor.tipo} 
                  onValueChange={(value: 'admin' | 'vendedor') => setFormVendedor({...formVendedor, tipo: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span>Admin - Acesso total</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="vendedor">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-600" />
                        <span>Vendedor - Apenas visualização</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {formVendedor.tipo === 'admin' 
                    ? 'Poderá editar produtos, comissões e criar usuários'
                    : 'Poderá apenas visualizar produtos e baixar PDFs'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalVendedorAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarVendedor}>
                {vendedorEditando ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
