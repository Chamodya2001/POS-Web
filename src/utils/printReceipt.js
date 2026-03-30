export const generateReceiptHtml = (orderData) => {
    if (!orderData) return '<html><body><h1>Error: No Order Data</h1></body></html>';

    const {
        orderId = 'N/A',
        items = [],
        orderTotal = 0,
        previousBalance = 0,
        grandTotal = 0,
        cashPaidAmount = 0,
        paymentMethod = 'cash',
        user = null,
        customer = null,
        date = new Date().toLocaleDateString('en-CA'),
        time = new Date().toLocaleTimeString('en-US', { hour12: true })
    } = orderData;

    const itemCount = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

    let amountReceived = 0;
    if (paymentMethod === 'cash' || paymentMethod === 'partial_cash') {
        amountReceived = parseFloat(cashPaidAmount || 0);
    } else if (paymentMethod === 'card') {
        amountReceived = parseFloat(grandTotal || 0);
    } else if (paymentMethod === 'loan') {
        amountReceived = 0;
    } else {
        amountReceived = parseFloat(orderTotal || 0);
    }

    const changeDue = (paymentMethod === 'cash' && amountReceived > grandTotal) ? (amountReceived - grandTotal) : 0;
    const remainingBalance = (grandTotal - amountReceived > 0.01) ? (grandTotal - amountReceived) : 0;

    return `
        <html>
            <head>
                <title>Receipt #${orderId}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Noto+Sans+Sinhala:wght@400;700&display=swap');
                    
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: 'Inconsolata', 'Noto Sans Sinhala', monospace;
                        width: 76mm;
                        padding: 0;
                        margin: 0;
                        color: #000;
                        background: #fff;
                        line-height: 1.1;
                        font-size: 11px;
                        -webkit-print-color-adjust: exact;
                    }
                    
                    .container {
                        padding: 3mm;
                    }

                    .text-center { text-align: center; }
                    .text-right { text-align: right !important; }
                    .bold { font-weight: 700; }
                    
                    .header { margin-bottom: 8px; }
                    .shop-name { font-size: 18px; font-weight: 700; margin-top: 2mm; margin-bottom: 1mm; }
                    .shop-info { font-size: 10px; color: #000; line-height: 1.2; }
                    
                    .divider { 
                        border-top: 2px solid #000; 
                        margin: 4px 0;
                    }
                    
                    .meta-table { 
                        width: 100%;
                        font-size: 10px;
                        margin-bottom: 5px;
                        font-weight: 600;
                    }

                    .customer-info {
                        margin-bottom: 8px;
                        padding: 4px 0;
                        border-bottom: 1px solid #000;
                        font-size: 11px;
                    }
                    
                    .table { width: 100%; border-collapse: collapse; font-size: 11px; table-layout: fixed; }
                    .table th { 
                        text-align: left;
                        padding: 6px 0;
                        font-weight: 700;
                        border-bottom: 1.5px solid #000;
                        border-top: 1.5px solid #000;
                        text-transform: uppercase;
                    }
                    .table td { 
                        padding: 6px 0; 
                        vertical-align: middle;
                        border-bottom: 1px dotted #ccc;
                        overflow: hidden;
                    }
                    .table tr:last-child td { border-bottom: none; }
                    
                    .item-name { font-weight: 600; display: block; line-height: 1.2; width: 100%; white-space: normal; }
                    .item-meta { font-size: 9px; opacity: 0.8; }
                    
                    .summary-table { 
                        width: 100%; 
                        margin-top: 6px;
                        border-top: 1.5px solid #000;
                        border-collapse: collapse;
                    }
                    .summary-table td { 
                        padding: 5px 0; 
                        vertical-align: baseline; 
                        line-height: normal;
                    }
                    .summary-table .label { font-weight: 600; }
                    .summary-table .amount { text-align: right; font-weight: 700; }
                    
                    .payable-row {
                        border-top: 2px solid #000;
                    }
                    .payable-row td { 
                        padding: 10px 0 !important; 
                        font-size: 16px !important; 
                        font-weight: 700 !important;
                    }

                    .payment-box {
                        margin-top: 8px;
                        padding: 6px;
                        border: 1px solid #000;
                    }
                    .payment-box table { width: 100%; border-collapse: collapse; }
                    .payment-box td { font-weight: 600; padding: 2px 0; font-size: 10px; vertical-align: baseline; }
                    
                    .footer { 
                        margin-top: 15px; 
                        text-align: center;
                        font-size: 10px;
                        padding-bottom: 20mm;
                    }
                    
                    @media print {
                        @page { margin: 0; }
                        body { width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header text-center">
                        <div class="shop-name">BL STORE</div>
                        <div class="shop-info">බී.එල්. කුළුබඩු වෙළඳසැල<br/>
                        Hospital Road, Aralaganwila<br/>
                        TEL: 075-6500000 | 078-6500000</div>
                    </div>

                    <div class="divider"></div>

                    <table class="meta-table">
                        <tr>
                            <td>INV: #${orderId}</td>
                            <td class="text-right">OP: ${user?.name || 'Admin'}</td>
                        </tr>
                        <tr>
                            <td>DATE: ${date}</td>
                            <td class="text-right">TIME: ${time}</td>
                        </tr>
                    </table>

                    <div class="customer-info">
                        <span class="bold">CUSTOMER:</span> ${customer ? `${customer.first_name} ${customer.last_name || ''}` : 'Walk-in'}
                        ${customer?.phone_number ? `<br/>TEL: ${customer.phone_number}` : ''}
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 50%">ITEM</th>
                                <th class="text-center" style="width: 15%">QTY</th>
                                <th class="text-right" style="width: 35%">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td>
                                        <span class="item-name">${item.sinhala_name || item.item_name || item.name}</span>
                                        <span class="item-meta">RS ${parseFloat(item.price || 0).toFixed(2)} /unit</span>
                                    </td>
                                    <td class="text-center bold" style="font-size: 13px;">${item.quantity}</td>
                                    <td class="text-right bold" style="font-size: 12px;">${(parseFloat(item.price || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <table class="summary-table">
                        <tr>
                            <td class="label">Items Count:</td>
                            <td class="amount">${itemCount}</td>
                        </tr>
                        <tr>
                            <td class="label">Net Subtotal:</td>
                            <td class="amount">RS ${parseFloat(orderTotal || 0).toFixed(2)}</td>
                        </tr>
                        ${parseFloat(previousBalance || 0) > 0.01 ? `
                        <tr>
                            <td class="label">Previous Balance:</td>
                            <td class="amount">RS ${parseFloat(previousBalance || 0).toFixed(2)}</td>
                        </tr>
                        ` : ''}
                        
                        <tr class="payable-row">
                            <td class="label">TOTAL PAYABLE:</td>
                            <td class="amount">RS ${parseFloat(grandTotal || 0).toFixed(2)}</td>
                        </tr>
                    </table>

                    <div class="payment-box">
                        <table>
                            <tr>
                                <td>PAYMENT METHOD:</td>
                                <td class="text-right uppercase">${paymentMethod.replace('_', ' ')}</td>
                            </tr>
                            <tr>
                                <td>CASH RECEIVED:</td>
                                <td class="text-right">RS ${amountReceived.toFixed(2)}</td>
                            </tr>
                            ${changeDue > 0.01 ? `
                            <tr>
                                <td>CHANGE DUE:</td>
                                <td class="text-right">RS ${changeDue.toFixed(2)}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>

                    ${remainingBalance > 0.01 ? `
                    <div style="margin-top: 8px; padding: 6px; border: 2px solid #000; text-align: center; border-style: double;">
                        <div style="font-size: 10px; font-weight: 700;">OUTSTANDING AMOUNT</div>
                        <div class="bold" style="font-size: 16px;">RS ${remainingBalance.toFixed(2)}</div>
                    </div>
                    ` : ''}

                    <div class="footer">
                        <div class="bold">--- THANK YOU! COME AGAIN ---</div>
                        <div style="margin-top: 4px; font-size: 8px; opacity: 0.7;">Powered by BL POS system</div>
                    </div>
                </div>
            </body>
        </html>
    `;
};

export const printReceipt = (orderData) => {
    const html = generateReceiptHtml(orderData);
    
    // Create hidden iframe if it doesn't exist
    let iframe = document.getElementById('print-iframe');
    if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'print-iframe';
        iframe.style.position = 'fixed';
        iframe.style.right = '100vw';
        iframe.style.bottom = '100vh';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.zIndex = '-9999';
        document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    // Trigger printing
    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }, 250);
};
