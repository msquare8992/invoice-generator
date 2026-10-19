import './style.css'

interface InvoiceLine {
  description: string
  quantity: number
  rate: number
}

const invoiceLines: InvoiceLine[] = [
  { description: 'Supervisor', quantity: 31, rate: 719.04 },
  { description: 'Driver - 1st Trip', quantity: 188, rate: 1030.61 },
  { description: 'Driver - 2nd Trip', quantity: 42, rate: 350 },
  { description: 'Driver - 3nd Trip', quantity: 42, rate: 100 },
  { description: 'Van Boy - 1st Trip', quantity: 589, rate: 753.84 },
  { description: 'Van Boy - 2nd Trip', quantity: 35, rate: 125 },
  { description: 'Van Boy - 3nd Trip', quantity: 158, rate: 100 },
  { description: 'Production', quantity: 1194, rate: 671.78 },
  { description: 'HK (WH)', quantity: 31.5, rate: 671.78 },
  { description: 'Project', quantity: 72, rate: 753.84 },
  { description: 'Counting', quantity: 81.5, rate: 671.68 },
  { description: 'Loading', quantity: 460.5, rate: 753.84 },
]

const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const app = document.querySelector<HTMLDivElement>('#app')!

function formatRupees(amountInPaise: number): string {
  return `₹${amountFormatter.format(amountInPaise / 100)}`
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#39;'
      default: return character
    }
  })
}

function numberToWords(value: number): string {
  const ones = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ]
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function underThousand(number: number): string {
    const words: string[] = []
    if (number >= 100) {
      words.push(`${ones[Math.floor(number / 100)]} Hundred`)
      number %= 100
    }
    if (number >= 20) {
      words.push(tens[Math.floor(number / 10)])
      number %= 10
    }
    if (number > 0) words.push(ones[number])
    return words.join(' ')
  }

  const groups: Array<[number, string]> = [
    [10000000, 'Crore'],
    [100000, 'Lakh'],
    [1000, 'Thousand'],
    [1, ''],
  ]
  let remainder = value
  const words: string[] = []
  for (const [size, label] of groups) {
    const group = Math.floor(remainder / size)
    if (group > 0) {
      words.push(`${underThousand(group)}${label ? ` ${label}` : ''}`)
      remainder %= size
    }
  }
  return words.join(' ') || 'Zero'
}

app.innerHTML = `
  <main class="workspace">
    <header class="toolbar" aria-label="Invoice controls">
      <div class="toolbar-actions">
        <label class="period-control" for="invoice-month">
          <span>Claim month</span>
          <input id="invoice-month" type="month" value="2026-08" aria-label="Claim month">
        </label>
        <button class="print-button" id="print-invoice" type="button" aria-label="Print or save invoice as PDF">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7V3h10v4M5 14H3V8h14v6h-2M5 12h10v5H5zM14 10h.01"/></svg>
          <span>Print / Save PDF</span>
        </button>
      </div>
    </header>

    <article class="invoice-sheet" aria-label="Invoice preview">
      <header class="invoice-heading">
        <input class="editable-field invoice-brand" value="INVOICE" aria-label="Invoice heading">
        <dl class="invoice-meta">
          <div>
            <dt><input class="editable-field" value="Invoice Number" aria-label="Invoice number label"></dt>
            <span aria-hidden="true">:</span>
            <dd><input class="editable-field" value="2026-005" aria-label="Invoice number"></dd>
          </div>
          <div>
            <dt><input class="editable-field" value="Invoice Date" aria-label="Invoice date label"></dt>
            <span aria-hidden="true">:</span>
            <dd><input class="editable-field" value="04-09-2026" aria-label="Invoice date"></dd>
          </div>
        </dl>
      </header>

      <section class="parties" aria-label="Invoice parties and registration details">
        <div class="bill-to">
          <h2><input class="editable-field" value="Invoice to" aria-label="Invoice-to heading"></h2>
          <strong><input class="editable-field" value="Bisleri International Pvt Ltd" aria-label="Invoice recipient name"></strong>
          <p><input class="editable-field" value="7/3, Parivakkam Main Road," aria-label="Invoice recipient street address"></p>
          <div class="bill-address-line">
            <input class="editable-field" value="Leelavathi Nagar, Chennai – 600056" aria-label="Invoice recipient city, locality, and postal code">
          </div>
          <p class="bill-gstin-line">
            <input class="editable-field" value="GSTIN" aria-label="Recipient GSTIN label">
            <span aria-hidden="true">–</span>
            <input class="editable-field blue-text" value="33AACCA4355K1ZS" aria-label="Recipient GSTIN">
          </p>
        </div>
        <div class="invoice-details">
          <h2><input class="editable-field" value="Invoice details" aria-label="Invoice-details heading"></h2>
          <dl>
            <div>
              <dt><input class="editable-field" value="SAC Code" aria-label="SAC code label"></dt>
              <span aria-hidden="true">:</span>
              <dd><input class="editable-field blue-text" value="998519" aria-label="SAC code"></dd>
            </div>
            <div>
              <dt><input class="editable-field" value="GSTIN" aria-label="Invoice GSTIN label"></dt>
              <span aria-hidden="true">:</span>
              <dd><input class="editable-field blue-text" value="33CJVPM2364P1ZE" aria-label="Invoice GSTIN"></dd>
            </div>
            <div>
              <dt><input class="editable-field" value="ESI Regn. No." aria-label="ESI registration label"></dt>
              <span aria-hidden="true">:</span>
              <dd><input class="editable-field blue-text" value="63-00-116758-000-1099" aria-label="ESI registration number"></dd>
            </div>
            <div>
              <dt><input class="editable-field" value="PF Regn. No." aria-label="PF registration label"></dt>
              <span aria-hidden="true">:</span>
              <dd><input class="editable-field blue-text" value="CBSLM3237121000" aria-label="PF registration number"></dd>
            </div>
          </dl>
        </div>
      </section>

      <div class="invoice-table-shell">
        <table class="invoice-table">
          <thead>
            <tr>
              <th scope="col">Particulars</th>
              <th scope="col" class="quantity-heading">Mandays / OT hrs.</th>
              <th scope="col" class="rate-heading">Rate</th>
              <th scope="col" class="amount-heading">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="service-line"><td colspan="4">Service Description : Other employment &amp; Labour Supply Services N.E.C</td></tr>
            <tr class="claim-line"><td colspan="4">Manpower claim for the month of <strong id="claim-month-label">August 2026</strong></td></tr>
          </tbody>
          <tbody id="invoice-items"></tbody>
          <tfoot>
            <tr class="summary-row subtotal-row"><td aria-hidden="true"></td><td aria-hidden="true"></td><th scope="row">Sub total</th><td id="subtotal">₹1,540,576.44</td></tr>
            <tr class="summary-row"><td aria-hidden="true"></td><td aria-hidden="true"></td><th scope="row">CGST 9%</th><td id="cgst">₹138,651.88</td></tr>
            <tr class="summary-row"><td aria-hidden="true"></td><td aria-hidden="true"></td><th scope="row">SGST 9%</th><td id="sgst">₹138,651.88</td></tr>
            <tr class="summary-row grand-total"><td aria-hidden="true"></td><td aria-hidden="true"></td><th scope="row">Grand total</th><td id="grand-total">₹1,817,880.20</td></tr>
          </tfoot>
        </table>
        <div id="row-actions-rail" class="row-actions-rail" aria-label="Invoice row actions"></div>
      </div>

      <section class="amount-in-words" aria-live="polite">
        <h2>Rupees in word:</h2>
        <p id="amount-words">Eighteen Lakh Seventeen Thousand Eight Hundred Eighty Rupees And Twenty Paise only.</p>
      </section>
    </article>
  </main>
`

function updateTotals(): void {
  let subtotal = 0
  for (const input of app.querySelectorAll<HTMLInputElement>('.quantity-input')) {
    const lineIndex = Number(input.dataset['line'])
    const quantity = Math.max(0, Number(input.value) || 0)
    const rateInput = app.querySelector<HTMLInputElement>(`.rate-input[data-line="${lineIndex}"]`)
    const rate = Math.max(0, Number(rateInput?.value) || 0)
    const amount = Math.round(quantity * rate * 100)
    subtotal += amount
    app.querySelector<HTMLElement>(`[data-total="${lineIndex}"]`)!.textContent = formatRupees(amount)
  }

  const cgst = Math.round(subtotal * 0.09)
  const sgst = Math.round(subtotal * 0.09)
  const grandTotal = subtotal + cgst + sgst
  const rupees = Math.floor(grandTotal / 100)
  const paise = grandTotal % 100

  app.querySelector('#subtotal')!.textContent = formatRupees(subtotal)
  app.querySelector('#cgst')!.textContent = formatRupees(cgst)
  app.querySelector('#sgst')!.textContent = formatRupees(sgst)
  app.querySelector('#grand-total')!.textContent = formatRupees(grandTotal)
  app.querySelector('#amount-words')!.textContent = `${numberToWords(rupees)} Rupees And ${numberToWords(paise)} Paise only.`
}

function positionRowActions(): void {
  const shell = app.querySelector<HTMLElement>('.invoice-table-shell')!
  const shellTop = shell.getBoundingClientRect().top
  app.querySelectorAll<HTMLTableRowElement>('.item-row').forEach((row, index) => {
    const actions = app.querySelector<HTMLElement>(`.row-action-pair[data-line="${index}"]`)
    if (!actions) return
    const rowRect = row.getBoundingClientRect()
    actions.style.top = `${rowRect.top - shellTop + (rowRect.height - actions.offsetHeight) / 2}px`
  })
}

function renderInvoiceRows(): void {
  app.querySelector<HTMLTableSectionElement>('#invoice-items')!.innerHTML = invoiceLines.map((line, index) => {
    const description = escapeHtml(line.description)
    const rowLabel = escapeHtml(line.description || `row ${index + 1}`)
    return `
      <tr class="item-row" data-line="${index}">
        <td><input class="editable-field particulars-input" value="${description}" aria-label="Particulars for ${rowLabel}"></td>
        <td class="quantity-cell"><input class="quantity-input" type="number" min="0" step="any" value="${line.quantity}" data-line="${index}" aria-label="Mandays or OT hours for ${rowLabel}"></td>
        <td class="rate-cell"><div class="rate-editor"><button class="rate-display" type="button" aria-label="Edit rate for ${rowLabel}">${formatRupees(Math.round(line.rate * 100))}</button><input class="editable-field rate-input" type="number" min="0" step="0.01" value="${line.rate.toFixed(2)}" data-line="${index}" aria-label="Rate for ${rowLabel}" hidden></div></td>
        <td class="line-total">${formatRupees(Math.round(line.quantity * line.rate * 100))}</td>
      </tr>`
  }).join('')

  app.querySelector<HTMLElement>('#row-actions-rail')!.innerHTML = invoiceLines.map((line, index) => {
    const rowLabel = escapeHtml(line.description || `row ${index + 1}`)
    const removeHidden = invoiceLines.length === 1 ? ' hidden' : ''
    return `<div class="row-action-pair" data-line="${index}"><button class="row-action add-row" type="button" aria-label="Add row below ${rowLabel}" title="Add row below">+</button><button class="row-action remove-row" type="button" aria-label="Remove ${rowLabel}" title="Remove row"${removeHidden}>×</button></div>`
  }).join('')

  app.querySelectorAll<HTMLElement>('.line-total').forEach((amount, index) => {
    amount.dataset['total'] = String(index)
  })
  updateTotals()
  positionRowActions()
}

app.addEventListener('input', (event) => {
  const input = event.target
  if (!(input instanceof HTMLInputElement)) return
  const row = input.closest<HTMLTableRowElement>('.item-row')
  if (!row) return

  const lineIndex = Number(row.dataset['line'])
  const line = invoiceLines[lineIndex]
  if (!line) return

  if (input.classList.contains('particulars-input')) {
    line.description = input.value
    positionRowActions()
    return
  }

  if (input.classList.contains('quantity-input')) {
    line.quantity = Math.max(0, Number(input.value) || 0)
  } else if (input.classList.contains('rate-input')) {
    line.rate = Math.max(0, Number(input.value) || 0)
    row.querySelector<HTMLButtonElement>('.rate-display')!.textContent = formatRupees(Math.round(line.rate * 100))
  } else {
    return
  }

  updateTotals()
})

app.addEventListener('focusout', (event) => {
  const input = event.target
  if (!(input instanceof HTMLInputElement) || !input.classList.contains('rate-input')) return
  const row = input.closest<HTMLTableRowElement>('.item-row')!
  const display = row.querySelector<HTMLButtonElement>('.rate-display')!
  display.textContent = formatRupees(Math.round((Number(input.value) || 0) * 100))
  input.hidden = true
  display.hidden = false
})

app.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return
  const display = event.target.closest<HTMLButtonElement>('.rate-display')
  if (display) {
    const row = display.closest<HTMLTableRowElement>('.item-row')!
    const input = row.querySelector<HTMLInputElement>('.rate-input')!
    display.hidden = true
    input.hidden = false
    input.focus()
    input.select()
    return
  }

  const action = event.target.closest<HTMLButtonElement>('.row-action')
  if (!action) return
  const actionPair = action.closest<HTMLElement>('.row-action-pair')!
  const lineIndex = Number(actionPair.dataset['line'])

  if (action.classList.contains('add-row')) {
    invoiceLines.splice(lineIndex + 1, 0, { description: '', quantity: 0, rate: 0 })
    renderInvoiceRows()
    app.querySelector<HTMLInputElement>(`.item-row[data-line="${lineIndex + 1}"] .particulars-input`)!.focus()
  } else if (action.classList.contains('remove-row') && invoiceLines.length > 1) {
    invoiceLines.splice(lineIndex, 1)
    renderInvoiceRows()
  }
})

renderInvoiceRows()

window.addEventListener('resize', positionRowActions)
new ResizeObserver(positionRowActions).observe(app.querySelector('.invoice-table')!)

app.querySelector<HTMLInputElement>('#invoice-month')!.addEventListener('input', (event) => {
  const monthValue = (event.currentTarget as HTMLInputElement).value
  if (!monthValue) return
  const [year, month] = monthValue.split('-').map(Number)
  const label = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)))
  app.querySelector('#claim-month-label')!.textContent = label

  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  if (monthValue !== currentMonth) return

  const invoiceDate = [today.getDate(), today.getMonth() + 1, today.getFullYear()]
    .map((part, index) => index < 2 ? String(part).padStart(2, '0') : String(part))
    .join('-')
  app.querySelector<HTMLInputElement>('[aria-label="Invoice date"]')!.value = invoiceDate
})

app.querySelector<HTMLButtonElement>('#print-invoice')!.addEventListener('click', () => window.print())
