import { useState, useMemo, useEffect } from 'react';
import {
  ClipboardPlus,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Car,
  Gauge,
  Wrench,
  CheckSquare,
  Square,
  StickyNote,
  AlertCircle,
  Search,
  UserCheck,
  PlusCircle,
  Layers,
  Package,
  Folder,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import type { ServiceItem } from '../../../model/ServiceOrder';
import { SERVICE_ORDER_API_ENDPOINTS } from '../../../constants/reception/appointmentsEndpoints';
import { useFetchClient } from '../../../hook/useFetchClient';
import { APPOINTMENT_API_ENDPOINTS } from '../../../constants/reception/appointmentsEndpoints';

// ========== MOCK: Appointment data (auto-fill) ==========
const MOCK_APPOINTMENT_DATA: Record<string, {
  id: string; customerName: string; customerPhone: string;
  vehiclePlate: string; vehicleModel: string; vehicleYear: number; vehicleMileage: number;
  appointmentDate: string; appointmentTime: string;
  services?: string[];
}> = {
  'APT-001': {
    id: 'APT-001', customerName: 'Nguyễn Văn An', customerPhone: '0901 234 567',
    vehiclePlate: '51A-123.45', vehicleModel: 'Toyota Camry 2.5Q', vehicleYear: 2020, vehicleMileage: 45000,
    appointmentDate: '2026-06-02', appointmentTime: '09:00',
    services: ['SV001', 'SV003'], // Bảo dưỡng định kỳ cấp 1, Thay dầu Castrol
  },
  'APT-002': {
    id: 'APT-002', customerName: 'Trần Thị Bình', customerPhone: '0912 345 678',
    vehiclePlate: '30H-456.78', vehicleModel: 'Honda City RS', vehicleYear: 2022, vehicleMileage: 22000,
    appointmentDate: '2026-06-02', appointmentTime: '10:30',
    services: ['SV003'], // Thay dầu Castrol
  },
};

// ========== MOCK: Existing customers without appointments ==========
const MOCK_EXISTING_CUSTOMERS = [
  { id: 'CUST-001', name: 'Lê Hoàng Long', phone: '0912 345 678', plate: '51F-987.65', model: 'Honda CR-V 2018', year: 2018, mileage: 82000 },
  { id: 'CUST-002', name: 'Phạm Minh Đức', phone: '0933 445 566', plate: '51G-234.56', model: 'Ford Ranger Wildtrak', year: 2021, mileage: 55000 },
  { id: 'CUST-003', name: 'Vũ Hoài Nam', phone: '0977 889 900', plate: '30K-987.65', model: 'VinFast VF 8', year: 2023, mileage: 12000 },
];

// ========== MOCK: Available services ==========
const AVAILABLE_SERVICES: ServiceItem[] = [
  { id: 'SV001', name: 'Bảo dưỡng định kỳ cấp 1', category: 'Bảo dưỡng', price: 500000 },
  { id: 'SV002', name: 'Bảo dưỡng định kỳ cấp 2', category: 'Bảo dưỡng', price: 1200000 },
  { id: 'SV003', name: 'Thay dầu động cơ Castrol', category: 'Dầu nhớt', price: 650000 },
  { id: 'SV004', name: 'Cân chỉnh thước lái 3D', category: 'Sửa chữa gầm', price: 600000 },
  { id: 'SV005', name: 'Vệ sinh kim phun điện tử', category: 'Động cơ', price: 1200000 },
  { id: 'SV006', name: 'Khử mùi diệt khuẩn ô tô', category: 'Chăm sóc xe', price: 200000 },
  { id: 'SV007', name: 'Thay má phanh trước', category: 'Phanh', price: 800000 },
  { id: 'SV008', name: 'Kiểm tra tổng quát', category: 'Kiểm tra', price: 300000 },
  { id: 'SV009', name: 'Thay lọc gió điều hòa', category: 'Điều hòa', price: 250000 },
  { id: 'SV010', name: 'Sơn phục hồi vết xước', category: 'Thân vỏ', price: 1500000 },
];

// ========== MOCK: Available combos ==========
interface ComboItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  services: string[];
}

const MOCK_COMBOS: ComboItem[] = [
  {
    id: 'CB001',
    name: 'Combo Chăm Sóc Toàn Diện',
    price: 1100000,
    category: 'Combo',
    description: 'Bao gồm: Bảo dưỡng cấp 1, Thay dầu Castrol, Khử mùi diệt khuẩn',
    services: ['SV001', 'SV003', 'SV006'],
  },
  {
    id: 'CB002',
    name: 'Combo An Toàn Hành Trình',
    price: 1800000,
    category: 'Combo',
    description: 'Bao gồm: Bảo dưỡng cấp 2, Cân chỉnh thước lái 3D, Kiểm tra tổng quát',
    services: ['SV002', 'SV004', 'SV008'],
  },
  {
    id: 'CB003',
    name: 'Combo Vận Hành Êm Ái',
    price: 1800000,
    category: 'Combo',
    description: 'Bao gồm: Thay dầu Castrol, Vệ sinh kim phun, Thay lọc gió điều hòa',
    services: ['SV003', 'SV005', 'SV009'],
  },
];

export default function ReceptionCreateServiceOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useOutletContext<{
    showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  }>();

  // Tab mode: 'approved_record' (Lịch hẹn/KH có sẵn) or 'first_time' (Khách lần đầu đến)
  const initialMode = searchParams.get('appointmentId') ? 'approved_record' : 'approved_record';
  const [mode, setMode] = useState<'approved_record' | 'first_time'>(initialMode);

  // Search in Tab 1
  const [recordSearch, setRecordSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Manual inputs in Tab 2
  const [manualCustName, setManualCustName] = useState('');
  const [manualCustPhone, setManualCustPhone] = useState('');
  const [manualVehiclePlate, setManualVehiclePlate] = useState('');
  const [manualVehicleModel, setManualVehicleModel] = useState('');
  const [manualVehicleYear, setManualVehicleYear] = useState('');
  const [currentOdo, setCurrentOdo] = useState('');
  const [bayId, setBayId] = useState('1'); // Cầu nâng (default 1)

  // Common fields
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [selectedCombos, setSelectedCombos] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [activeServiceTab, setActiveServiceTab] = useState<'single' | 'combo' | 'category'>('single');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const { fetchPrivate } = useFetchClient();
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);

  // Handle URL appointmentId param on mount
  useEffect(() => {
    const apptId = searchParams.get('appointmentId');
    if (apptId) {
      const fetchAppt = async () => {
        setIsLoadingRecord(true);
        try {
          const response = await fetchPrivate(APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENT_DETAIL(apptId));
          if (response.success && response.data) {
            const data = response.data;
            const servicesDetails: any[] = [];
            if (Array.isArray(data.appointmentDetails)) {
              data.appointmentDetails.forEach((detail: any) => {
                if (detail.catalog) {
                  servicesDetails.push({
                    id: detail.catalog.id,
                    name: detail.catalog.service_name,
                    price: detail.catalog.price,
                    category: 'Dịch vụ lẻ'
                  });
                }
                if (detail.combo) {
                  const subServices = detail.combo.catalogs
                    ? detail.combo.catalogs.map((c: any) => c.service_name)
                    : [];
                  servicesDetails.push({
                    id: detail.combo.id,
                    name: detail.combo.combo_name,
                    price: detail.combo.total_price || 0,
                    category: 'Combo dịch vụ',
                    description: detail.combo.description,
                    subServices
                  });
                }
              });
            }

            let appointmentDate = '';
            let appointmentTime = '';
            if (data.scheduled_time) {
              const dateObj = new Date(data.scheduled_time);
              appointmentDate = dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0');
              appointmentTime = String(dateObj.getHours()).padStart(2, '0') + ':' + String(dateObj.getMinutes()).padStart(2, '0');
            }

            setSelectedRecord({
              type: 'appointment',
              id: String(data.id),
              name: data.customer?.user?.fullName || 'Khách vãng lai',
              phone: data.customer?.user?.phoneNumber || data.customer?.phone || '',
              plate: data.vehicle?.license_plate || 'Chưa cập nhật',
              model: data.vehicle?.model ? `${data.vehicle.model.make?.make_name || ''} ${data.vehicle.model.model_name || ''}`.trim() : 'Chưa cập nhật',
              year: data.vehicle?.year || '',
              mileage: data.vehicle?.mileage || '',
              appointmentDate,
              appointmentTime,
              servicesDetails,
            });
            setMode('approved_record');
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoadingRecord(false);
        }
      };
      fetchAppt();
    }
  }, [searchParams]);

  // Search algorithm for Tab 1
  const handleSearchRecord = (val: string) => {
    setRecordSearch(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }

    const valLower = val.toLowerCase();

    // Search in mock appointments
    const filteredAppts = Object.values(MOCK_APPOINTMENT_DATA)
      .filter(
        (a) =>
          a.id.toLowerCase().includes(valLower) ||
          a.customerName.toLowerCase().includes(valLower) ||
          a.customerPhone.includes(val) ||
          a.vehiclePlate.toLowerCase().includes(valLower)
      )
      .map((a) => ({
        type: 'appointment',
        id: a.id,
        name: a.customerName,
        phone: a.customerPhone,
        plate: a.vehiclePlate,
        model: a.vehicleModel,
        year: a.vehicleYear,
        mileage: a.vehicleMileage,
        appointmentDate: a.appointmentDate,
        appointmentTime: a.appointmentTime,
        services: a.services,
      }));

    // Search in existing customers
    const filteredCustomers = MOCK_EXISTING_CUSTOMERS.filter(
      (c) =>
        c.id.toLowerCase().includes(valLower) ||
        c.name.toLowerCase().includes(valLower) ||
        c.phone.includes(val) ||
        c.plate.toLowerCase().includes(valLower)
    ).map((c) => ({
      type: 'customer',
      id: c.id,
      name: c.name,
      phone: c.phone,
      plate: c.plate,
      model: c.model,
      year: c.year,
      mileage: c.mileage,
    }));

    setSearchResults([...filteredAppts, ...filteredCustomers]);
  };

  const handleSelectRecord = (record: any) => {
    setSelectedRecord(record);
    setSelectedServices(new Set());
    setSelectedCombos(new Set());
    setRecordSearch('');
    setSearchResults([]);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const toggleCombo = (comboId: string) => {
    setSelectedCombos((prev) => {
      const next = new Set(prev);
      if (next.has(comboId)) next.delete(comboId);
      else next.add(comboId);
      return next;
    });
  };

  const filteredServices = useMemo(() => {
    if (!serviceSearch) return AVAILABLE_SERVICES;
    const searchLower = serviceSearch.toLowerCase();
    return AVAILABLE_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.category.toLowerCase().includes(searchLower)
    );
  }, [serviceSearch]);

  const filteredCombos = useMemo(() => {
    if (!serviceSearch) return MOCK_COMBOS;
    const searchLower = serviceSearch.toLowerCase();
    return MOCK_COMBOS.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
    );
  }, [serviceSearch]);

  const categoriesWithServices = useMemo(() => {
    const services = serviceSearch
      ? AVAILABLE_SERVICES.filter(
        (s) =>
          s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
          s.category.toLowerCase().includes(serviceSearch.toLowerCase())
      )
      : AVAILABLE_SERVICES;

    const groups: Record<string, ServiceItem[]> = {};
    services.forEach((s) => {
      if (!groups[s.category]) {
        groups[s.category] = [];
      }
      groups[s.category].push(s);
    });

    return Object.entries(groups).map(([categoryName, items]) => {
      const selectedInCat = items.filter((item) => selectedServices.has(item.id)).length;
      return {
        name: categoryName,
        services: items,
        selectedCount: selectedInCat,
      };
    });
  }, [serviceSearch, selectedServices]);

  // Auto expand categories when searching
  useEffect(() => {
    if (serviceSearch.trim()) {
      const matchingCats = categoriesWithServices.map((c) => c.name);
      setExpandedCategories(new Set(matchingCats));
    }
  }, [serviceSearch, categoriesWithServices]);

  const toggleCategoryExpand = (catName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catName)) next.delete(catName);
      else next.add(catName);
      return next;
    });
  };

  const selectedTotal = useMemo(() => {
    if (mode === 'approved_record' && selectedRecord?.type === 'appointment') {
      return (selectedRecord.servicesDetails || []).reduce((sum: number, item: any) => sum + (item.price || 0), 0);
    }
    const servicesPrice = AVAILABLE_SERVICES
      .filter((s) => selectedServices.has(s.id))
      .reduce((sum, s) => sum + s.price, 0);
    const combosPrice = MOCK_COMBOS
      .filter((c) => selectedCombos.has(c.id))
      .reduce((sum, c) => sum + c.price, 0);
    return servicesPrice + combosPrice;
  }, [selectedServices, selectedCombos, mode, selectedRecord]);

  const handleSubmit = async () => {
    try {
      if (mode === 'approved_record') {
        if (!selectedRecord) {
          showToast('Vui lòng tìm kiếm và chọn lịch hẹn hoặc hồ sơ khách hàng.', 'warning');
          return;
        }
        if (!selectedRecord.vehicleId) {
          showToast('Không tìm thấy thông tin xe. Vui lòng cập nhật xe trước.', 'warning');
          return;
        }
      } else {
        if (!manualCustName.trim() || !manualCustPhone.trim() || !manualVehiclePlate.trim() || !manualVehicleModel.trim()) {
          showToast('Vui lòng điền đầy đủ thông tin Khách hàng và Xe.', 'warning');
          return;
        }
      }

      if (!currentOdo.trim()) {
        showToast('Vui lòng nhập số km hiện tại (ODO).', 'warning');
        return;
      }
      if (!bayId) {
        showToast('Vui lòng chọn cầu nâng.', 'warning');
        return;
      }

      if (mode === 'first_time' && selectedServices.size === 0 && selectedCombos.size === 0) {
        showToast('Vui lòng chọn ít nhất 1 dịch vụ hoặc combo.', 'warning');
        return;
      }
      if (mode === 'approved_record' && selectedRecord?.type === 'appointment' && (!selectedRecord.servicesDetails || selectedRecord.servicesDetails.length === 0)) {
        showToast('Lịch hẹn không có dịch vụ nào.', 'warning');
        return;
      }

      // Prepare payload
      const payload: any = {
        vehicle_id: mode === 'approved_record' ? Number(selectedRecord.vehicleId) : null, // Backend doesn't support creating vehicle in this API yet
        bay_id: Number(bayId),
        current_odo: Number(currentOdo),
        estimated_finish_time: null
      };

      if (mode === 'approved_record' && selectedRecord?.type === 'appointment') {
        payload.appointment_id = Number(selectedRecord.id);
      }

      const res = await fetchPrivate(SERVICE_ORDER_API_ENDPOINTS.CREATE, 'POST', payload);
      if (res.success) {
        showToast('Tạo hóa đơn dịch vụ thành công!', 'success');
        setTimeout(() => navigate('/reception/appointments'), 1000);
      } else {
        throw new Error(res.message || 'Lỗi khi tạo hóa đơn dịch vụ');
      }
    } catch (err: any) {
      showToast(err.message, 'warning');
    }
  };

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="flex-1 p-4 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#00285E] tracking-tight leading-none mb-1 flex items-center gap-2">
            <ClipboardPlus className="text-amber-500" size={28} />
            Tạo hóa đơn dịch vụ
          </h1>
          <p className="text-slate-500 text-sm">
            Tạo phiếu tiếp nhận xe và sửa chữa/bảo dưỡng cho khách hàng.
          </p>
        </div>
      </div>

      {/* SEGMENTED TAB CONTROL FOR SECTIONS */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-xl">
        <button
          onClick={() => {
            setMode('approved_record');
            setSelectedRecord(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${mode === 'approved_record'
            ? 'bg-white text-[#00285E] shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <Layers size={14} />
          <span>Lịch hẹn / Khách hàng cũ</span>
        </button>
        <button
          onClick={() => {
            setMode('first_time');
            setSelectedRecord(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${mode === 'first_time'
            ? 'bg-white text-[#00285E] shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <PlusCircle size={14} />
          <span>Khách vãng lai lần đầu</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'approved_record' ? (
          /* SECTION 1: CREATE FROM APPROVED APPOINTMENT OR CHECKED-IN CUSTOMER */
          <motion.div
            key="approved-record"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* SEARCH INPUT BAR */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 space-y-3 relative">
              <h2 className="text-xs font-bold text-[#00285E] uppercase tracking-widest flex items-center gap-2">
                <Search size={14} />
                Tìm kiếm Lịch hẹn hoặc Khách hàng hiện tại
              </h2>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Nhập tên, SĐT, biển số xe, mã lịch hẹn (APT-001, APT-002, CUST-001)..."
                  value={recordSearch}
                  onChange={(e) => handleSearchRecord(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold"
                />
              </div>

              {/* SEARCH RESULTS DROPDOWN */}
              {searchResults.length > 0 && (
                <div className="absolute left-5 right-5 z-20 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectRecord(r)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center justify-between text-sm transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">
                          {r.name} ({r.phone})
                        </span>
                        <span className="text-xs text-slate-400 font-semibold mt-0.5">
                          Xe: {r.plate} • {r.model}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-[10px] font-bold text-[#00285E] bg-[#EDF3FF] px-2 py-0.5 rounded uppercase">
                          {r.type === 'appointment' ? `Lịch hẹn: ${r.id}` : `Hồ sơ: ${r.id}`}
                        </span>
                        <UserCheck size={16} className="text-[#00285E]" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* APPOINTMENT AUTO-FILL CARD */}
            {selectedRecord && selectedRecord.type === 'appointment' && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 space-y-3">
                <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} />
                  Thông tin Lịch hẹn (tự động điền)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-[10px] font-semibold text-blue-400 uppercase block">Mã lịch hẹn</span>
                    <span className="font-bold text-blue-800">{selectedRecord.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-blue-400 uppercase block">Ngày hẹn</span>
                    <span className="font-bold text-blue-800">{selectedRecord.appointmentDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-blue-400 uppercase block">Giờ hẹn</span>
                    <span className="font-bold text-blue-800">{selectedRecord.appointmentTime}</span>
                  </div>
                </div>
                {/* Note about adding services (Câu 62) */}
                <div className="flex items-start gap-2 bg-white/60 border border-blue-200/50 rounded-xl p-3 text-xs text-blue-700 font-semibold leading-relaxed">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    <strong>Thông tin nghiệp vụ:</strong> Lịch hẹn gốc chỉ lưu nhu cầu đặt chỗ. Bạn có thể tự do thay đổi, thêm hoặc bớt dịch vụ thực tế phát sinh bên dưới cho hóa đơn dịch vụ (Service Order).
                  </span>
                </div>
              </div>
            )}

            {/* READONLY CUSTOMER & VEHICLE DISPLAY */}
            {selectedRecord ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* READONLY CUSTOMER INFO */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
                  <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-100 pb-3">
                    <User size={16} className="text-[#00285E]" />
                    Thông tin Khách hàng
                  </h2>
                  <div className="space-y-3">
                    <FormReadonly label="Họ và tên" value={selectedRecord.name} />
                    <FormReadonly
                      label="Số điện thoại"
                      value={selectedRecord.phone}
                      icon={<Phone size={14} className="text-slate-400" />}
                    />
                  </div>
                </div>

                {/* READONLY VEHICLE INFO */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
                  <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-100 pb-3">
                    <Car size={16} className="text-[#00285E]" />
                    Thông tin Xe
                  </h2>
                  <div className="space-y-3">
                    <FormReadonly label="Biển số" value={selectedRecord.plate} highlight />
                    <FormReadonly label="Loại xe" value={selectedRecord.model} />
                    <FormReadonly label="Năm SX" value={selectedRecord.year?.toString() || '—'} />
                    <FormInput
                      label="Số km hiện tại (ODO) *"
                      value={currentOdo}
                      onChange={setCurrentOdo}
                      placeholder={selectedRecord.mileage ? `Lần trước: ${selectedRecord.mileage.toLocaleString('vi-VN')} km` : 'VD: 15000...'}
                      type="number"
                      icon={<Gauge size={14} className="text-slate-400" />}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center text-slate-400 font-semibold text-sm">
                Vui lòng tìm kiếm lịch hẹn hoặc hồ sơ khách hàng hiện có ở thanh tìm kiếm phía trên để hiển thị thông tin.
              </div>
            )}
          </motion.div>
        ) : (
          /* SECTION 2: FOR FIRST-TIME WALK-IN CUSTOMERS WITH EDITABLE FIELDS */
          <motion.div
            key="first-time"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* EDITABLE CUSTOMER INFO */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest border-b border-slate-100 pb-3">
                <User size={16} className="text-[#00285E]" />
                Thông tin Khách hàng mới
              </h2>
              <div className="space-y-4">
                <FormInput
                  label="Họ và tên khách hàng *"
                  value={manualCustName}
                  onChange={setManualCustName}
                  placeholder="Nhập họ và tên khách hàng..."
                />
                <FormInput
                  label="Số điện thoại *"
                  value={manualCustPhone}
                  onChange={setManualCustPhone}
                  placeholder="Nhập số điện thoại khách hàng..."
                  icon={<Phone size={14} className="text-slate-400" />}
                />
              </div>
            </div>

            {/* EDITABLE VEHICLE INFO */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest border-b border-slate-100 pb-3">
                <Car size={16} className="text-[#00285E]" />
                Thông tin Xe tiếp nhận
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormInput
                    label="Biển số xe *"
                    value={manualVehiclePlate}
                    onChange={setManualVehiclePlate}
                    placeholder="VD: 51A-123.45..."
                  />
                </div>
                <div>
                  <FormInput
                    label="Dòng xe / Hiệu xe *"
                    value={manualVehicleModel}
                    onChange={setManualVehicleModel}
                    placeholder="VD: Toyota Camry..."
                  />
                </div>
                <div>
                  <FormInput
                    label="Năm sản xuất"
                    value={manualVehicleYear}
                    onChange={setManualVehicleYear}
                    placeholder="VD: 2022..."
                    type="number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormInput
                    label="Số km hiện tại (ODO) *"
                    value={currentOdo}
                    onChange={setCurrentOdo}
                    placeholder="VD: 15000..."
                    type="number"
                    icon={<Gauge size={14} className="text-slate-400" />}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                    <Wrench size={14} className="text-slate-400" />
                    Cầu nâng *
                  </label>
                  <select
                    value={bayId}
                    onChange={(e) => setBayId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
                  >
                    <option value="1">Cầu nâng số 1</option>
                    <option value="2">Cầu nâng số 2</option>
                    <option value="3">Cầu nâng số 3</option>
                    <option value="4">Cầu nâng số 4</option>
                    <option value="5">Cầu nâng số 5</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SERVICE SELECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
            <Wrench size={16} className="text-[#00285E]" />
            {mode === 'approved_record' && selectedRecord?.type === 'appointment' ? 'Dịch vụ đã đặt ở lịch hẹn' : 'Chọn Dịch vụ'} <span className="text-rose-500">*</span>
          </h2>
          <span className="text-xs font-bold text-[#00285E] bg-[#EDF3FF] px-3 py-1 rounded-lg">
            {mode === 'approved_record' && selectedRecord?.type === 'appointment'
              ? `Số lượng: ${(selectedRecord.servicesDetails || []).length} — Tổng: ${formatPrice(selectedTotal)}`
              : `Đã chọn: ${selectedServices.size + selectedCombos.size} — Tổng: ${formatPrice(selectedTotal)}`
            }
          </span>
        </div>

        {mode === 'approved_record' && selectedRecord?.type === 'appointment' ? (
          /* SHOW BOOKED SERVICES FROM APPOINTMENT */
          <div className="space-y-3">
            {selectedRecord.servicesDetails && selectedRecord.servicesDetails.length > 0 ? (
              selectedRecord.servicesDetails.map((svc: any, idx: number) => (
                <div key={idx} className="flex flex-col px-4 py-3 rounded-xl border border-[#00285E]/20 bg-[#EDF3FF]/30 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckSquare size={18} className="text-[#00285E]" />
                      <div>
                        <p className="text-sm font-semibold text-[#00285E]">{svc.name}</p>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase">{svc.category}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#00285E]">{formatPrice(svc.price || 0)}</span>
                  </div>
                  {svc.subServices && svc.subServices.length > 0 && (
                    <div className="mt-2 pl-8 space-y-1 border-t border-[#00285E]/10 pt-2">
                      <p className="text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Chi tiết gói dịch vụ:</p>
                      {svc.subServices.map((sub: string, subIdx: number) => (
                        <div key={subIdx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <div className="w-1 h-1 rounded-full bg-slate-400" />
                          {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs font-semibold text-slate-400">
                Lịch hẹn này không có dịch vụ nào được đặt trước.
              </div>
            )}
          </div>
        ) : (
          /* SHOW MOCK CATALOG FOR FIRST TIME OR EXISTING CUSTOMER W/O APPOINTMENT */
          <div>

            {/* Sub-tabs Selector */}
            <div className="flex gap-2 mb-4 border-b border-slate-100 pb-3 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveServiceTab('single')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeServiceTab === 'single'
                  ? 'bg-[#00285E] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <Wrench size={14} />
                <span>Dịch vụ lẻ</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('combo')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeServiceTab === 'combo'
                  ? 'bg-[#00285E] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <Package size={14} />
                <span>Combo</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveServiceTab('category')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeServiceTab === 'category'
                  ? 'bg-[#00285E] text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <Folder size={14} />
                <span>Danh mục</span>
              </button>
            </div>

            {/* Service search */}
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={
                  activeServiceTab === 'single'
                    ? 'Tìm dịch vụ lẻ theo tên hoặc danh mục...'
                    : activeServiceTab === 'combo'
                      ? 'Tìm combo theo tên hoặc mô tả...'
                      : 'Tìm danh mục hoặc dịch vụ bên trong...'
                }
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold"
              />
            </div>

            {/* Tab contents */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {activeServiceTab === 'single' && (
                <>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => {
                      const isSelected = selectedServices.has(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${isSelected
                            ? 'bg-[#EDF3FF] border-[#00285E]/30 shadow-sm'
                            : 'bg-white border-slate-200/60 hover:bg-slate-50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            {isSelected ? (
                              <CheckSquare size={18} className="text-[#00285E]" />
                            ) : (
                              <Square size={18} className="text-slate-300" />
                            )}
                            <div>
                              <p className={`text-sm font-semibold ${isSelected ? 'text-[#00285E]' : 'text-slate-700'}`}>
                                {service.name}
                              </p>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase">{service.category}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#00285E]' : 'text-slate-500'}`}>
                            {formatPrice(service.price)}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs font-semibold text-slate-400">
                      Không tìm thấy dịch vụ nào phù hợp.
                    </div>
                  )}
                </>
              )}

              {activeServiceTab === 'combo' && (
                <>
                  {filteredCombos.length > 0 ? (
                    filteredCombos.map((combo) => {
                      const isSelected = selectedCombos.has(combo.id);
                      return (
                        <button
                          key={combo.id}
                          type="button"
                          onClick={() => toggleCombo(combo.id)}
                          className={`w-full flex items-start justify-between px-4 py-3 rounded-xl border transition-all text-left ${isSelected
                            ? 'bg-[#EDF3FF] border-[#00285E]/30 shadow-sm'
                            : 'bg-white border-slate-200/60 hover:bg-slate-50'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {isSelected ? (
                                <CheckSquare size={18} className="text-[#00285E]" />
                              ) : (
                                <Square size={18} className="text-slate-300" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-semibold ${isSelected ? 'text-[#00285E]' : 'text-slate-700'}`}>
                                  {combo.name}
                                </p>
                                <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                  <Tag size={8} />
                                  TIẾT KIỆM
                                </span>
                              </div>
                              <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-md">
                                {combo.description}
                              </p>
                            </div>
                          </div>
                          <span className={`text-sm font-bold whitespace-nowrap ml-2 ${isSelected ? 'text-[#00285E]' : 'text-slate-500'}`}>
                            {formatPrice(combo.price)}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs font-semibold text-slate-400">
                      Không tìm thấy combo nào phù hợp.
                    </div>
                  )}
                </>
              )}

              {activeServiceTab === 'category' && (
                <>
                  {categoriesWithServices.length > 0 ? (
                    categoriesWithServices.map((cat) => {
                      const isExpanded = expandedCategories.has(cat.name);
                      return (
                        <div key={cat.name} className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                          {/* Category Header */}
                          <button
                            type="button"
                            onClick={() => toggleCategoryExpand(cat.name)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/70 hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Folder size={14} className="text-[#00285E]/70" />
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{cat.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-500">
                                {cat.services.length}
                              </span>
                              {cat.selectedCount > 0 && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                                  Đã chọn: {cat.selectedCount}
                                </span>
                              )}
                            </div>
                            {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                          </button>

                          {/* Category Services */}
                          {isExpanded && (
                            <div className="p-2 bg-white divide-y divide-slate-50">
                              {cat.services.map((service) => {
                                const isSelected = selectedServices.has(service.id);
                                return (
                                  <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => toggleService(service.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-left ${isSelected
                                      ? 'bg-[#EDF3FF]/70 text-[#00285E]'
                                      : 'hover:bg-slate-50/50 text-slate-600'
                                      }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {isSelected ? (
                                        <CheckSquare size={16} className="text-[#00285E]" />
                                      ) : (
                                        <Square size={16} className="text-slate-300" />
                                      )}
                                      <span className="text-xs font-semibold">{service.name}</span>
                                    </div>
                                    <span className="text-xs font-bold">{formatPrice(service.price)}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-xs font-semibold text-slate-400">
                      Không tìm thấy danh mục nào.
                    </div>
                  )}
                </>
              )}
            </div>

            {selectedServices.size === 0 && selectedCombos.size === 0 && (
              <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs font-semibold text-amber-600">
                <AlertCircle size={14} />
                Cần chọn ít nhất 1 dịch vụ hoặc combo để tạo hóa đơn dịch vụ.
              </div>
            )}
          </div>
        )}
      </div>

      {/* NOTES */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6">
        <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 uppercase tracking-widest">
          <StickyNote size={16} className="text-[#00285E]" />
          Ghi chú
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú thêm cho hóa đơn dịch vụ (tùy chọn)..."
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all resize-none"
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-3 bg-[#00285E] hover:bg-[#001a3f] text-white rounded-xl text-sm font-bold shadow-md shadow-[#00285E]/15 transition-all transform hover:translate-y-[-1px]"
        >
          <ClipboardPlus size={16} />
          Tạo hóa đơn dịch vụ
        </button>
      </div>
    </div>
  );
}

function FormReadonly({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-1 border-b border-slate-100/50 pb-2 last:border-0 last:pb-0">
      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span
        className={`text-sm font-bold text-right ${highlight ? 'text-[#00285E] bg-[#EDF3FF] px-2 py-0.5 rounded-md' : 'text-slate-700'
          }`}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285E]/10 focus:border-[#00285E] transition-all font-semibold text-slate-700"
      />
    </div>
  );
}
