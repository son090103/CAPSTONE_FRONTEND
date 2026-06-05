import type { QuoteModel } from '../../../model/Quote';
import type { ServiceOrderModel } from './../../../pages/reception/service-orders/ReceptionServiceOrderList';

const QUOTES_KEY = 'agm_quotes';
const SERVICE_ORDERS_KEY = 'agm_service_orders';

// Initial Mock Quotes Data
const INITIAL_QUOTES: QuoteModel[] = [
  {
    id: 'Q-001',
    serviceOrderId: 'SO-001',
    customerId: 'CUST-001',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901 234 567',
    vehiclePlate: '51A-123.45',
    vehicleModel: 'Toyota Camry 2.5Q',
    services: [
      { name: 'Bảo dưỡng định kỳ cấp 1', laborCost: 500000 },
      { name: 'Thay dầu động cơ Castrol', laborCost: 150000 },
    ],
    parts: [
      { name: 'Dầu Castrol Magnatec 5W-30', quantity: 4, unit: 'Lít', unitPrice: 162500, total: 650000 },
      { name: 'Lọc gió điều hòa', quantity: 1, unit: 'Cái', unitPrice: 200000, total: 200000 },
      { name: 'Lọc dầu nhớt', quantity: 1, unit: 'Cái', unitPrice: 120000, total: 120000 },
    ],
    laborCost: 650000,
    partsCost: 970000,
    totalAmount: 1620000,
    status: 'pending',
    createdAt: '2026-06-02T08:30:00Z',
  },
  {
    id: 'Q-002',
    serviceOrderId: 'SO-002',
    customerId: 'CUST-002',
    customerName: 'Trần Thị Bình',
    customerPhone: '0912 345 678',
    vehiclePlate: '30H-456.78',
    vehicleModel: 'Honda City RS',
    services: [
      { name: 'Kiểm tra & Thay thế giảm xóc trước', laborCost: 1000000 },
    ],
    parts: [
      { name: 'Phuộc nhún trước (cặp)', quantity: 1, unit: 'Bộ', unitPrice: 3500000, total: 3500000 },
    ],
    laborCost: 1000000,
    partsCost: 3500000,
    totalAmount: 4500000,
    status: 'approved',
    approvedBy: 'Khách hàng duyệt online',
    approvedDate: '2026-06-01T14:20:00Z',
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'Q-003',
    serviceOrderId: 'SO-003',
    customerId: 'CUST-003',
    customerName: 'Phạm Minh Hùng',
    customerPhone: '0909 888 777',
    vehiclePlate: '51G-888.88',
    vehicleModel: 'Mercedes-Benz C200',
    services: [
      { name: 'Bảo dưỡng định kỳ cấp 2', laborCost: 1200000 },
      { name: 'Cân chỉnh thước lái 3D', laborCost: 600000 },
      { name: 'Kiểm tra tổng quát', laborCost: 300000 },
    ],
    parts: [
      { name: 'Dung dịch vệ sinh kim phun Liqui Moly', quantity: 1, unit: 'Chai', unitPrice: 350000, total: 350050 },
    ],
    laborCost: 2100000,
    partsCost: 350000,
    totalAmount: 2450000,
    status: 'pending',
    createdAt: '2026-06-02T11:00:00Z',
    comboId: 'CB002',
    comboName: 'Combo An Toàn Hành Trình',
  },
];

// Initial Mock Service Orders Data
const INITIAL_SERVICE_ORDERS: ServiceOrderModel[] = [
  {
    id: 'SO-001',
    appointmentId: 'APT-001',
    customerId: 'C001',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901 234 567',
    vehiclePlate: '51A-123.45',
    vehicleModel: 'Toyota Camry 2.5Q',
    vehicleMileage: 45000,
    services: [
      { id: 'SV001', name: 'Bảo dưỡng định kỳ cấp 1', price: 500000, category: 'Bảo dưỡng' },
      { id: 'SV003', name: 'Thay dầu động cơ Castrol', price: 650000, category: 'Dầu nhớt' },
    ],
    status: 'in_progress',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T09:30:00',
  },
  {
    id: 'SO-002',
    customerId: 'C002',
    customerName: 'Trần Thị Bình',
    customerPhone: '0912 345 678',
    vehiclePlate: '30H-456.78',
    vehicleModel: 'Honda City RS',
    vehicleMileage: 22000,
    services: [
      { id: 'SV003', name: 'Thay dầu động cơ Castrol', price: 650000, category: 'Dầu nhớt' },
      { id: 'SV005', name: 'Vệ sinh kim phun điện tử', price: 1200000, category: 'Động cơ' },
    ],
    status: 'completed',
    createdBy: 'Nguyễn Minh Quân (Lễ tân)',
    createdAt: '2026-06-02T10:15:00',
  },
  {
    id: 'SO-003',
    customerId: 'C009',
    customerName: 'Phạm Minh Hùng',
    customerPhone: '0909 888 777',
    vehiclePlate: '51G-888.88',
    vehicleModel: 'Mercedes-Benz C200',
    vehicleMileage: 15000,
    services: [
      { id: 'SV002', name: 'Bảo dưỡng định kỳ cấp 2', price: 1200000, category: 'Bảo dưỡng' },
      { id: 'SV004', name: 'Cân chỉnh thước lái 3D', price: 600000, category: 'Sửa chữa gầm' },
      { id: 'SV008', name: 'Kiểm tra tổng quát', price: 300000, category: 'Kiểm tra' },
    ],
    status: 'waiting_approval',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T11:00:00',
  },
  {
    id: 'SO-004',
    customerId: 'C010',
    customerName: 'Lê Văn Nam',
    customerPhone: '0977 123 456',
    vehiclePlate: '30A-999.99',
    vehicleModel: 'Mazda 3 Premium',
    vehicleMileage: 32000,
    services: [
      { id: 'SV007', name: 'Thay má phanh trước', price: 800000, category: 'Phanh' },
    ],
    status: 'cancelled',
    createdBy: 'Trần Thị Thuỷ (Lễ tân)',
    createdAt: '2026-06-02T08:00:00',
    cancelledAt: '2026-06-02T08:15:00',
    cancelledBy: 'Trần Thị Thuỷ (Lễ tân)',
    cancelReason: 'Khách hàng thay đổi quyết định, không sửa nữa trước khi tháo lắp.',
    incurredCost: 0,
  },
  {
    id: 'SO-005',
    customerId: 'C011',
    customerName: 'Đặng Hoàng Nam',
    customerPhone: '0988 555 444',
    vehiclePlate: '51K-555.55',
    vehicleModel: 'Hyundai SantaFe',
    vehicleMileage: 60000,
    services: [
      { id: 'SV002', name: 'Bảo dưỡng định kỳ cấp 2', price: 1200000, category: 'Bảo dưỡng' },
      { id: 'SV010', name: 'Sơn phục hồi vết xước', price: 1500000, category: 'Thân vỏ' },
    ],
    status: 'waiting_parts',
    createdBy: 'Nguyễn Minh Quân (Lễ tân)',
    createdAt: '2026-06-01T14:00:00',
  },
];

// Helper to load or initialize from localStorage
export const getQuotes = (): QuoteModel[] => {
  const data = localStorage.getItem(QUOTES_KEY);
  if (!data) {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(INITIAL_QUOTES));
    return INITIAL_QUOTES;
  }
  return JSON.parse(data);
};

export const saveQuotes = (quotes: QuoteModel[]): void => {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
};

export const getQuoteById = (id: string): QuoteModel | undefined => {
  const quotes = getQuotes();
  return quotes.find((q) => q.id === id);
};

export const getServiceOrders = (): ServiceOrderModel[] => {
  const data = localStorage.getItem(SERVICE_ORDERS_KEY);
  if (!data) {
    localStorage.setItem(SERVICE_ORDERS_KEY, JSON.stringify(INITIAL_SERVICE_ORDERS));
    return INITIAL_SERVICE_ORDERS;
  }
  return JSON.parse(data);
};

export const saveServiceOrders = (orders: ServiceOrderModel[]): void => {
  localStorage.setItem(SERVICE_ORDERS_KEY, JSON.stringify(orders));
};

export const getServiceOrderById = (id: string): ServiceOrderModel | undefined => {
  const orders = getServiceOrders();
  return orders.find((o) => o.id === id);
};

export const updateQuote = (id: string, updatedQuote: QuoteModel): void => {
  const quotes = getQuotes();
  const idx = quotes.findIndex((q) => q.id === id);
  if (idx !== -1) {
    quotes[idx] = updatedQuote;
    saveQuotes(quotes);

    // Auto-promote or update linked service order status
    if (updatedQuote.serviceOrderId) {
      const orders = getServiceOrders();
      const orderIdx = orders.findIndex((o) => o.id === updatedQuote.serviceOrderId);
      if (orderIdx !== -1) {
        if (updatedQuote.status === 'approved') {
          orders[orderIdx].status = 'in_progress';
          
          // Filter out unselected services from the Service Order
          const approvedServiceNames = updatedQuote.services
            .filter((s) => s.selected !== false)
            .map((s) => s.name);
          
          orders[orderIdx].services = orders[orderIdx].services.filter((s) =>
            approvedServiceNames.includes(s.name)
          );
        } else if (updatedQuote.status === 'rejected') {
          orders[orderIdx].status = 'draft'; // Change back to draft or edit state
          orders[orderIdx].notes = `${orders[orderIdx].notes || ''}\n[BÁO GIÁ BỊ TỪ CHỐI]: ${updatedQuote.rejectionReason || 'Không có lý do chi tiết.'}`.trim();
        }
        saveServiceOrders(orders);
      }
    }
  }
};

export const updateServiceOrder = (id: string, updatedOrder: ServiceOrderModel): void => {
  const orders = getServiceOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    orders[idx] = updatedOrder;
    saveServiceOrders(orders);
  }
};
