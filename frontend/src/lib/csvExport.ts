/**
 * Aranya Organic Dairy Farm — CSV Export Utility
 * 
 * Generates RFC 4180-compliant CSV files with UTF-8 Byte Order Mark (\uFEFF)
 * ensuring full compatibility with Microsoft Excel, Apple Numbers, and Google Sheets
 * without character corruption for Indian Rupee symbols (₹) or Tamil characters.
 */

export interface OrderItemForCSV {
  name: string;
  qty: number;
  price?: number | null;
}

export interface OrderForCSV {
  id: string;
  order_code?: string | null;
  items: OrderItemForCSV[];
  total: number | null;
  status: string;
  whatsapp_message?: string | null;
  created_at: string;
}

/**
 * Escapes a cell value according to RFC 4180:
 * - Replaces double quotes with two double quotes ("" -> """")
 * - Wraps in double quotes if it contains commas, quotes, or newlines
 */
function escapeCSVCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Exports an array of orders into an Excel-ready CSV and triggers a client download.
 */
export function exportOrdersToCSV(orders: OrderForCSV[], filenamePrefix: string = 'Aranya-Farm-Orders'): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const headers = [
      'Order Code',
      'Date & Time (IST)',
      'Status',
      'Total Amount (INR)',
      'Total Line Items',
      'Items Breakdown',
      'Customer WhatsApp Note',
      'Database Order UUID',
    ];

    const rows = orders.map((order) => {
      const code = order.order_code || order.id.replace(/-/g, '').slice(0, 8).toUpperCase();
      
      const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : '';

      const itemsSummary = (order.items || [])
        .map((it) => `${it.name} (Qty: ${it.qty}${it.price ? ` @ ₹${it.price}` : ''})`)
        .join('; ');

      const totalItemsQty = (order.items || []).reduce((acc, it) => acc + (it.qty || 0), 0);

      const cleanNote = (order.whatsapp_message || '')
        .replace(/[\r\n]+/g, ' ')
        .trim();

      return [
        escapeCSVCell(code),
        escapeCSVCell(formattedDate),
        escapeCSVCell(order.status.toUpperCase()),
        escapeCSVCell(order.total ?? 0),
        escapeCSVCell(totalItemsQty),
        escapeCSVCell(itemsSummary),
        escapeCSVCell(cleanNote),
        escapeCSVCell(order.id),
      ].join(',');
    });

    // \uFEFF is the UTF-8 Byte Order Mark (BOM). Required so Excel defaults to UTF-8 decoding.
    const csvContent = '\uFEFF' + [headers.map(escapeCSVCell).join(','), ...rows].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const todayStr = new Date().toISOString().slice(0, 10);
    link.download = `${filenamePrefix}-${todayStr}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (err) {
    console.error('[CSVExport] Failed to generate CSV export:', err);
    return false;
  }
}
