import { Produto } from './types'

export const exportarCatalogoPDF = (produtos: Produto[], categoria: 'frios' | 'congelados'): string => {
  // Criar conteúdo HTML para o PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Catálogo de ${categoria === 'frios' ? 'Frios' : 'Congelados'}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #007bff;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0 0 0;
          font-size: 16px;
        }
        .produto {
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f9f9f9;
          page-break-inside: avoid;
        }
        .produto-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        .produto-nome {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .produto-codigo {
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }
        .produto-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 15px;
        }
        .info-item {
          font-size: 14px;
        }
        .info-label {
          font-weight: bold;
          color: #555;
        }
        .precos {
          background: white;
          border-radius: 6px;
          padding: 12px;
          border-left: 4px solid #28a745;
        }
        .preco-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .preco-item:last-child {
          border-bottom: none;
        }
        .preco-valor {
          font-size: 18px;
          font-weight: bold;
          color: #28a745;
        }
        .preco-unidade {
          color: #666;
          font-size: 14px;
        }
        .descricao {
          margin-top: 10px;
          padding: 10px;
          background: white;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.4;
          color: #555;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .produto { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏪 Catálogo de ${categoria === 'frios' ? 'Frios' : 'Congelados'}</h1>
        <p>Distribuidora de Frios e Congelados</p>
        <p>Total de produtos: ${produtos.length}</p>
      </div>

      ${produtos.map(produto => `
        <div class="produto">
          <div class="produto-header">
            <h2 class="produto-nome">${produto.nome}</h2>
            <span class="produto-codigo">${produto.codigo}</span>
          </div>
          
          <div class="produto-info">
            <div class="info-item">
              <span class="info-label">Marca:</span> ${produto.marca}
            </div>
            <div class="info-item">
              <span class="info-label">Categoria:</span> ${produto.categoria}
            </div>
            <div class="info-item">
              <span class="info-label">Estoque:</span> ${produto.estoque} unidades
            </div>
            <div class="info-item">
              <span class="info-label">Unidade:</span> ${produto.unidade}
            </div>
          </div>

          <div class="precos">
            <h3 style="margin: 0 0 10px 0; color: #28a745; font-size: 16px;">💰 Preços</h3>
            ${produto.precos.map(preco => `
              <div class="preco-item">
                <span class="preco-valor">R$ ${preco.preco.toFixed(2)}</span>
                <span class="preco-unidade">por ${produto.unidade}</span>
              </div>
            `).join('')}
          </div>

          ${produto.descricao ? `
            <div class="descricao">
              <strong>Descrição:</strong> ${produto.descricao}
            </div>
          ` : ''}
        </div>
      `).join('')}

      <div class="footer">
        <p>Catálogo gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>Sistema de Catálogo - Distribuidora de Frios e Congelados</p>
      </div>
    </body>
    </html>
  `

  // Criar um blob com o conteúdo HTML
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  // Criar um link temporário para download
  const nomeArquivo = `catalogo-${categoria}-${new Date().toISOString().split('T')[0]}.html`
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Limpar o URL do blob
  URL.revokeObjectURL(url)
  
  return nomeArquivo
}