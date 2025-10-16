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
  Search, Package, Thermometer, DollarSign, Percent, Eye, EyeOff, LogIn, LogOut,
  Plus, Edit, Trash2, Download, User, Shield, Users, Settings, UserPlus,
  ToggleLeft, ToggleRight, X, Mail, EyeIcon, EyeOffIcon, Upload, Image as ImageIcon,
  Cog, Lock, Unlock
} from "lucide-react"
import { exportarCatalogoPDF } from "@/lib/pdf-export"
import {
  Produto, Usuario, LoginForm, UsuarioCompleto, TipoComissao,
  FormUsuario, FormTipoComissao, ProdutoPreco, FormProdutoPreco
} from "@/lib/types"
import {
  salvarProdutosLocalStorage, carregarProdutosLocalStorage,
  salvarTiposComissaoLocalStorage, carregarTiposComissaoLocalStorage,
  criarNovaContaUsuario, autenticarUsuario, verificarEmailExiste,
  salvarUsuariosLocalStorage, carregarUsuariosLocalStorage,
  criarContaVendedor, buscarUsuarioPorId
} from "@/lib/storage"

export default function SistemaCatalogo() {
  // Estados principais
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [tiposComissao, setTiposComissao] = useState<TipoComissao[]>([])
  const [vendedores, setVendedores] = useState<UsuarioCompleto[]>([])
  const [mostrarComissoes, setMostrarComissoes] = useState(true)
  const [busca, setBusca] = useState("")
  const [categoriaAtiva, setCategoriaAtiva] = useState<'frios' | 'congelados'>('frios')

  // Estados do login
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', senha: '', nome: '' })
  const [modoLogin, setModoLogin] = useState<'login' | 'cadastro'>('login')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  // Outros estados
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null)
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false)
  const [formProduto, setFormProduto] = useState<Partial<Produto>>({
    nome: '', marca: '', categoria: '', precos: [{ preco: 0, comissao: 0, tipoComissao: '' }],
    unidade: '', estoque: 0, codigo: '', descricao: '', foto: '', tipo: 'frios', disponivel: true
  })
  const [tipoComissaoEditando, setTipoComissaoEditando] = useState<TipoComissao | null>(null)
  const [modalTipoComissaoAberto, setModalTipoComissaoAberto] = useState(false)
  const [formTipoComissao, setFormTipoComissao] = useState<FormTipoComissao>({ nome: '', percentual: 0, descricao: '' })
  const [vendedorEditando, setVendedorEditando] = useState<UsuarioCompleto | null>(null)
  const [modalVendedorAberto, setModalVendedorAberto] = useState(false)
  const [formVendedor, setFormVendedor] = useState<FormUsuario>({ email: '', senha: '', nome: '', tipo: 'vendedor' })
  const [uploadandoImagem, setUploadandoImagem] = useState(false)

  // 🔹 Restaurar login salvo automaticamente
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

  // 🔹 Carregar dados do usuário logado
  useEffect(() => {
    if (usuario) {
      const usuarioParaDados = usuario.tipo === 'vendedor' && usuario.adminId
        ? buscarUsuarioPorId(usuario.adminId)
        : usuario

      if (usuarioParaDados) {
        const produtosUsuario = carregarProdutosLocalStorage(usuarioParaDados.id)
        setProdutos(produtosUsuario)
        const tiposComissaoUsuario = carregarTiposComissaoLocalStorage(usuarioParaDados.id)
        setTiposComissao(tiposComissaoUsuario)

        if (usuario.tipo === 'admin') {
          const todosUsuarios = carregarUsuariosLocalStorage()
          const vendedoresDoAdmin = todosUsuarios.filter(u => u.adminId === usuario.id && u.tipo === 'vendedor')
          setVendedores(vendedoresDoAdmin)
        }
      }
    }
  }, [usuario])

  // 🔹 Login persistente
  const fazerLogin = () => {
    const { email, senha } = loginForm
    if (!email || !senha) {
      alert("Email e senha são obrigatórios")
      return
    }

    const usuarioEncontrado = autenticarUsuario(email, senha)
    if (usuarioEncontrado) {
      const userData = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        tipo: usuarioEncontrado.tipo,
        email: usuarioEncontrado.email,
        adminId: usuarioEncontrado.adminId
      }
      setUsuario(userData)
      localStorage.setItem("usuarioLogado", JSON.stringify(userData))
      alert("Login realizado com sucesso!")
    } else {
      alert("Email ou senha incorretos, ou usuário inativo")
    }
  }

  // 🔹 Cadastro persistente
  const fazerCadastro = () => {
    const { email, senha, nome } = loginForm
    if (!email || !senha || !nome) {
      alert("Nome, email e senha são obrigatórios")
      return
    }

    if (verificarEmailExiste(email)) {
      alert("Este email já está cadastrado")
      return
    }

    try {
      const novoUsuario = criarNovaContaUsuario(email, senha, nome)
      const userData = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        tipo: novoUsuario.tipo,
        email: novoUsuario.email
      }
      setUsuario(userData)
      localStorage.setItem("usuarioLogado", JSON.stringify(userData))
      alert("Conta criada com sucesso! Você já está logado.")
    } catch (error) {
      alert("Erro ao criar conta. Tente novamente.")
    }
  }

  // 🔹 Logout
  const fazerLogout = () => {
    setUsuario(null)
    setProdutos([])
    setTiposComissao([])
    setVendedores([])
    setLoginForm({ email: "", senha: "", nome: "" })
    setModoLogin("login")
    localStorage.removeItem("usuarioLogado")
  }

  // 🔹 Salvar produtos e comissões (apenas admin)
  const salvarProdutos = (novos: Produto[]) => usuario?.tipo === 'admin' && salvarProdutosLocalStorage(novos, usuario.id)
  const salvarTiposComissao = (novos: TipoComissao[]) => usuario?.tipo === 'admin' && salvarTiposComissaoLocalStorage(novos, usuario.id)

  // Filtrar produtos
  const produtosFiltrados = produtos
    .filter(p => p.tipo === categoriaAtiva)
    .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || p.marca.toLowerCase().includes(busca.toLowerCase()))

  const podeEditar = usuario?.tipo === 'admin'

  // Se não estiver logado — tela de login
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">🏪 Sistema de Catálogo</CardTitle>
            <p className="text-gray-600">Distribuidora de Frios e Congelados</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Alternar Login/Cadastro */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={modoLogin === 'login' ? 'default' : 'ghost'}
                onClick={() => setModoLogin('login')}
                className="flex-1"
              >Entrar</Button>
              <Button
                variant={modoLogin === 'cadastro' ? 'default' : 'ghost'}
                onClick={() => setModoLogin('cadastro')}
                className="flex-1"
              >Criar Conta Admin</Button>
            </div>

            {modoLogin === 'cadastro' && (
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" value={loginForm.nome} onChange={e => setLoginForm({ ...loginForm, nome: e.target.value })} />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input id="email" type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} className="pl-10" />
              </div>
            </div>

            <div>
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={loginForm.senha}
                  onChange={e => setLoginForm({ ...loginForm, senha: e.target.value })}
                  className="pr-10"
                  onKeyDown={e => e.key === 'Enter' && (modoLogin === 'login' ? fazerLogin() : fazerCadastro())}
                />
                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setMostrarSenha(!mostrarSenha)}>
                  {mostrarSenha ? <EyeOffIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400" />}
                </Button>
              </div>
            </div>

            {modoLogin === 'login'
              ? <Button onClick={fazerLogin} className="w-full"><LogIn className="w-4 h-4 mr-2" />Entrar</Button>
              : <Button onClick={fazerCadastro} className="w-full"><UserPlus className="w-4 h-4 mr-2" />Criar Conta Admin</Button>
            }

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

  // Se estiver logado — tela do sistema
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🏪 Meu Catálogo</h1>
              <p className="text-gray-600">Bem-vindo, {usuario.nome}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={usuario.tipo === 'admin' ? 'default' : 'secondary'}>
                {usuario.tipo === 'admin' ? 'Admin' : 'Vendedor'}
              </Badge>
              <Button onClick={fazerLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />Sair
              </Button>
            </div>
          </div>

          {/* Aqui continua o catálogo existente... */}
          {/* (mantive sua estrutura para não quebrar nada) */}
        </div>
      </div>
    </div>
  )
}
