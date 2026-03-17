export const printReceipt = (orderData) => {
    const {
        orderId,
        items,
        orderTotal,
        previousBalance,
        grandTotal,
        cashPaidAmount,
        paymentMethod,
        user,
        customer,
        date = new Date().toLocaleDateString('en-CA'),
        time = new Date().toLocaleTimeString('en-US', { hour12: true })
    } = orderData;

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const savings = 0; // Assuming marked price is same as price for now, or calculate if needed
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const printWindow = window.open('', '_blank');

    const html = `
        <html>
            <head>
                <title>Print Receipt - ${orderId}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700&display=swap');
                    
                    body { 
                        font-family: 'Noto Sans Sinhala', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        width: 80mm;
                        margin: 0;
                        padding: 10px;
                        color: #000;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .bold { font-weight: bold; }
                    .logo { font-size: 48px; font-style: italic; margin-bottom: 5px; }
                    .shop-name { font-size: 18px; margin-bottom: 2px; }
                    .address { font-size: 11px; margin-bottom: 2px; }
                    .phone { font-size: 11px; margin-bottom: 5px; }
                    .divider { border-top: 1px dashed #000; margin: 5px 0; }
                    .info { font-size: 10px; line-height: 1.4; }
                    .table { width: 100%; font-size: 11px; border-collapse: collapse; }
                    .table th { border-bottom: 1px solid #000; padding: 5px 0; }
                    .table td { padding: 3px 0; vertical-align: top; }
                    .summary { font-size: 12px; margin-top: 5px; }
                    .summary-row { display: flex; justify-content: space-between; padding: 2px 0; }
                    .total-section { font-size: 16px; margin-top: 10px; border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 5px 0; }
                    .footer { font-size: 10px; margin-top: 15px; }
                    .barcode { height: 40px; border: 1px solid #000; margin: 10px auto; width: 80%; }
                    @media print {
                        @page { margin: 0; }
                        body { padding: 5mm; }
                    }
                </style>
            </head>
            <body>
                <div class="text-center">
                    <div class="logo bold">BL</div>
                    <div class="shop-name bold">බී.එල්. කුළුබඩු වෙළඳසැල</div>
                    <div class="address">නො: 94, රෝහල පාර, අරලගංවිල.</div>
                    <div class="phone">0756500000 | 0786500000</div>
                </div>

                <div class="info">
                    <div style="display: flex; justify-content: space-between;">
                        <span>බිල්පත් අංකය: ${orderId}</span>
                        <span>User: ${user?.name || 'Admin'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>දිනය: ${date}</span>
                        <span>වේලාව: ${time}</span>
                    </div>
                    <div>පාරිභෝගිකයා: ${customer ? `${customer.first_name} ${customer.last_name || ''}` : 'Walk-in'}</div>
                </div>

                <div class="divider"></div>

                <table class="table">
                    <thead>
                        <tr>
                            <th class="text-left" style="width: 40%">භාණ්ඩය</th>
                            <th class="text-center">ප්‍රමාණය</th>
                            <th class="text-right">මිල</th>
                            <th class="text-right">එකතුව</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td colspan="4" class="bold">${item.sinhala_name || item.item_name || item.name}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td class="text-center">${item.quantity} ${item.unit || 'Pcs'}</td>
                                <td class="text-right">${item.price.toFixed(2)}</td>
                                <td class="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="divider"></div>

                <div class="summary">
                    <div class="summary-row">
                        <span>වත්මන් බිල්පත</span>
                        <span class="bold">RS ${orderTotal.toFixed(2)}</span>
                    </div>
                    ${previousBalance > 0 ? `
                    <div class="summary-row">
                        <span>පැරණි ණය ශේෂය</span>
                        <span>RS ${previousBalance.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="summary-row">
                        <span>ඔබ ලැබූ ලාභය</span>
                        <span>RS ${savings.toFixed(2)}</span>
                    </div>
                </div>

                <div class="total-section text-center bold">
                    මුළු ගෙවිය යුතු මුදල: ${grandTotal.toFixed(2)}
                </div>

                <div class="summary" style="margin-top: 10px;">
                    <div class="summary-row">
                        <span>ගෙවූ මුදල (මුදල්) :</span>
                        <span>RS ${paymentMethod === 'cash' ? cashPaidAmount.toFixed(2) : '0.00'}</span>
                    </div>
                    <div class="summary-row">
                        <span>ගෙවූ මුදල (කාඩ්) :</span>
                        <span>RS ${paymentMethod === 'card' ? orderTotal.toFixed(2) : '0.00'}</span>
                    </div>
                    <div class="summary-row" style="border-top: 1px solid #eee; margin-top: 4px; padding-top: 4px;">
                        <span>ඉතිරි මුදල :</span>
                        <span>RS ${paymentMethod === 'cash' ? Math.max(0, cashPaidAmount - grandTotal).toFixed(2) : '0.00'}</span>
                    </div>
                    ${customer ? `
                    <div class="summary-row bold" style="color: #d32f2f;">
                        <span>අලුත් ණය ශේෂය :</span>
                        <span>RS ${Math.max(0, grandTotal - cashPaidAmount).toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="summary-row" style="margin-top: 5px; font-size: 10px; color: #666;">
                        <span>භාණ්ඩ ගණන :</span>
                        <span>${itemCount}</span>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="text-center footer">
                    <div class="bold">ස්තූතියි නැවත එන්න...</div>
                    <div style="margin-top: 5px;">****************************************</div>
                    <div style="margin-top: 5px; font-size: 8px;">Software by APE NUWANTHA WIKI - 0 APPUDIYAI PADAYAI WISIL EKAI</div>
                </div>

                <script>
                    window.onload = () => {
                        window.print();
                        window.onafterprint = () => window.close();
                    };
                </script>
            </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};
