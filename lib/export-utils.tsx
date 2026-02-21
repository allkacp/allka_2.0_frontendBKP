"use client"

import type { DateRange } from "react-day-picker"

export interface ProjectData {
  id: string
  name: string
  status: string
  type: string
  budget: number
  spent: number
  company?: string
  agency?: string
  createdDate: string
  dueDate: string
  progress: number
}

// Export to CSV
export function exportToCSV(data: ProjectData[], dateRange: DateRange, filename?: string) {
  const headers = [
    "ID",
    "Nome do Projeto",
    "Status",
    "Tipo",
    "Orçamento",
    "Gasto",
    "Saldo",
    "% Progresso",
    "Empresa",
    "Agência",
    "Data Criação",
    "Data Vencimento",
  ]

  const rows = data.map((project) => [
    project.id,
    project.name,
    project.status,
    project.type,
    `R$ ${project.budget.toLocaleString("pt-BR")}`,
    `R$ ${project.spent.toLocaleString("pt-BR")}`,
    `R$ ${(project.budget - project.spent).toLocaleString("pt-BR")}`,
    `${project.progress}%`,
    project.company || "-",
    project.agency || "-",
    project.createdDate,
    project.dueDate,
  ])

  const dateFrom = dateRange.from?.toLocaleDateString("pt-BR") || ""
  const dateTo = dateRange.to?.toLocaleDateString("pt-BR") || ""

  let csv = `Relatório de Projetos\n`
  csv += `Período: ${dateFrom} até ${dateTo}\n`
  csv += `Total de Projetos: ${data.length}\n`
  csv += `Valor Total: R$ ${data.reduce((sum, p) => sum + p.budget, 0).toLocaleString("pt-BR")}\n`
  csv += `Gasto Total: R$ ${data.reduce((sum, p) => sum + p.spent, 0).toLocaleString("pt-BR")}\n\n`
  csv += headers.join(";") + "\n"
  csv += rows.map((row) => row.map((cell) => `"${cell}"`).join(";")).join("\n")

  downloadFile(csv, filename || `projetos_${dateFrom.replace(/\//g, "-")}_${dateTo.replace(/\//g, "-")}.csv`)
}

// Export to Excel (simulates with CSV since we don't have a heavy library)
export function exportToExcel(data: ProjectData[], dateRange: DateRange, filename?: string) {
  const dateFrom = dateRange.from?.toLocaleDateString("pt-BR") || ""
  const dateTo = dateRange.to?.toLocaleDateString("pt-BR") || ""

  // Create XML for Excel format
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<?mso-application progid="Excel.Sheet"?>\n'
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n'
  xml += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n'
  xml += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n'
  xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n'
  xml += ' xmlns:html="http://www.w3.org/TR/REC-html40">\n'
  xml += '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">\n'
  xml += '<Author>ALLKA Platform</Author>\n'
  xml += `<LastSavedTime>${new Date().toISOString()}</LastSavedTime>\n`
  xml += '</DocumentProperties>\n'
  xml += '<Worksheet ss:Name="Projetos">\n'
  xml += '<Table>\n'

  // Summary rows
  xml += '<Row><Cell ss:StyleID="Summary"><Data ss:Type="String">Relatório de Projetos</Data></Cell></Row>\n'
  xml += `<Row><Cell><Data ss:Type="String">Período: ${dateFrom} até ${dateTo}</Data></Cell></Row>\n`
  xml += `<Row><Cell><Data ss:Type="String">Total de Projetos: ${data.length}</Data></Cell></Row>\n`
  xml += `<Row><Cell><Data ss:Type="String">Valor Total: R$ ${data.reduce((sum, p) => sum + p.budget, 0).toLocaleString("pt-BR")}</Data></Cell></Row>\n`
  xml += `<Row><Cell><Data ss:Type="String">Gasto Total: R$ ${data.reduce((sum, p) => sum + p.spent, 0).toLocaleString("pt-BR")}</Data></Cell></Row>\n`
  xml += "<Row><Cell></Cell></Row>\n"

  // Headers
  xml += "<Row>\n"
  const headers = [
    "ID",
    "Nome do Projeto",
    "Status",
    "Tipo",
    "Orçamento",
    "Gasto",
    "Saldo",
    "% Progresso",
    "Empresa",
    "Agência",
    "Data Criação",
    "Data Vencimento",
  ]
  headers.forEach((header) => {
    xml += `<Cell ss:StyleID="Header"><Data ss:Type="String">${header}</Data></Cell>\n`
  })
  xml += "</Row>\n"

  // Data rows
  data.forEach((project) => {
    xml += "<Row>\n"
    xml += `<Cell><Data ss:Type="String">${project.id}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="String">${project.name}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="String">${project.status}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="String">${project.type}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="Number">${project.budget}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="Number">${project.spent}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="Number">${project.budget - project.spent}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="Number">${project.progress}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="String">${project.company || "-"}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="String">${project.agency || "-"}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="String">${project.createdDate}</Data></Cell>\n`
    xml += `<Cell><Data ss:Type="String">${project.dueDate}</Data></Cell>\n`
    xml += "</Row>\n"
  })

  xml += "</Table>\n"
  xml += "</Worksheet>\n"
  xml += "</Workbook>"

  downloadFile(
    xml,
    filename || `projetos_${dateFrom.replace(/\//g, "-")}_${dateTo.replace(/\//g, "-")}.xls`,
    "application/vnd.ms-excel"
  )
}

// Export to PDF (using simple HTML rendering)
export function exportToPDF(data: ProjectData[], dateRange: DateRange, filename?: string) {
  const dateFrom = dateRange.from?.toLocaleDateString("pt-BR") || ""
  const dateTo = dateRange.to?.toLocaleDateString("pt-BR") || ""
  const totalBudget = data.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = data.reduce((sum, p) => sum + p.spent, 0)

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Relatório de Projetos</title>
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1e40af; font-size: 24px; margin-bottom: 5px; }
        .header p { color: #666; font-size: 14px; }
        .summary { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .summary-box { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 15px; }
        .summary-box .label { font-size: 12px; color: #0369a1; font-weight: bold; }
        .summary-box .value { font-size: 20px; font-weight: bold; color: #0c4a6e; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: bold; font-size: 12px; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
        tr:nth-child(even) { background: #f9fafb; }
        tr:hover { background: #f3f4f6; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
        .status.completed { background: #d1fae5; color: #065f46; }
        .status.in-progress { background: #dbeafe; color: #0c4a6e; }
        .status.draft { background: #fef3c7; color: #92400e; }
        .status.cancelled { background: #fee2e2; color: #7f1d1d; }
        .money { color: #059669; font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Relatório de Projetos</h1>
          <p>Período: ${dateFrom} até ${dateTo}</p>
          <p>Gerado em: ${new Date().toLocaleString("pt-BR")}</p>
        </div>

        <div class="summary">
          <div class="summary-box">
            <div class="label">Total de Projetos</div>
            <div class="value">${data.length}</div>
          </div>
          <div class="summary-box">
            <div class="label">Orçamento Total</div>
            <div class="value">R$ ${totalBudget.toLocaleString("pt-BR")}</div>
          </div>
          <div class="summary-box">
            <div class="label">Gasto Total</div>
            <div class="value">R$ ${totalSpent.toLocaleString("pt-BR")}</div>
          </div>
          <div class="summary-box">
            <div class="label">Saldo</div>
            <div class="value">R$ ${(totalBudget - totalSpent).toLocaleString("pt-BR")}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Status</th>
              <th>Tipo</th>
              <th>Orçamento</th>
              <th>Gasto</th>
              <th>Saldo</th>
              <th>Progresso</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (project) => `
              <tr>
                <td>${project.name}</td>
                <td><span class="status ${project.status}">${project.status}</span></td>
                <td>${project.type}</td>
                <td class="money">R$ ${project.budget.toLocaleString("pt-BR")}</td>
                <td class="money">R$ ${project.spent.toLocaleString("pt-BR")}</td>
                <td class="money">R$ ${(project.budget - project.spent).toLocaleString("pt-BR")}</td>
                <td>${project.progress}%</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>Este documento foi gerado automaticamente pelo ALLKA Platform</p>
        </div>
      </div>
    </body>
    </html>
  `

  const newWindow = window.open("", "", "width=900,height=700")
  if (newWindow) {
    newWindow.document.write(html)
    newWindow.document.close()
    setTimeout(() => {
      newWindow.print()
    }, 250)
  }
}

// Helper function to download file
function downloadFile(content: string, filename: string, mimeType: string = "text/csv") {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
