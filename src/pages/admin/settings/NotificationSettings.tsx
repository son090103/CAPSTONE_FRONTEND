import { useState } from 'react';
import { BellRing, Save } from 'lucide-react';

interface NotificationSettingsProps {
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function NotificationSettings({ showToast }: NotificationSettingsProps) {
  // Notification States
  const [notifications, setNotifications] = useState({
    smsOnComplete: true,
    emailWeekly: true,
    autoReminder: false,
    telegramAlert: true
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const handleSaveNotifications = () => {
    setIsSavingNotifications(true);
    setTimeout(() => {
      setIsSavingNotifications(false);
      showToast('Đã đồng bộ tùy chọn thông báo hệ thống!', 'success');
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <BellRing className="text-[#00285E]" size={20} />
        Cấu hình thông báo tự động
      </h2>

      <div className="space-y-6">
        {/* SMS On Complete */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-slate-800 text-sm md:text-base block">
              Gửi SMS khi hoàn thành sửa chữa
            </span>
            <span className="text-xs text-slate-400 font-semibold block">
              Tự động nhắn tin Zalo/SMS cho chủ xe kèm link hóa đơn điện tử khi KTV hoàn tất xe.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.smsOnComplete}
              onChange={(e) => setNotifications({ ...notifications, smsOnComplete: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
          </label>
        </div>

        {/* Weekly email report */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-slate-800 text-sm md:text-base block">
              Báo cáo tuần cho Quản trị viên
            </span>
            <span className="text-xs text-slate-400 font-semibold block">
              Gửi email tổng hợp doanh thu, lượng xe dịch vụ và các mặt hàng sắp hết kho vào mỗi thứ 2.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emailWeekly}
              onChange={(e) => setNotifications({ ...notifications, emailWeekly: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
          </label>
        </div>

        {/* Auto maintenance reminder */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-slate-800 text-sm md:text-base block">
              Tự động nhắc lịch bảo dưỡng định kỳ
            </span>
            <span className="text-xs text-slate-400 font-semibold block">
              Hệ thống tự động liên hệ khách hàng sau 6 tháng kể từ đợt dịch vụ trước để đặt lịch hẹn.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.autoReminder}
              onChange={(e) => setNotifications({ ...notifications, autoReminder: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
          </label>
        </div>

        {/* Telegram alerts */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="space-y-0.5 pr-4">
            <span className="font-bold text-slate-800 text-sm md:text-base block">
              Cảnh báo khẩn cấp qua Telegram
            </span>
            <span className="text-xs text-slate-400 font-semibold block">
              Nhận tin nhắn báo cáo tức thời khi có lịch hẹn bị quá giờ hoặc khi kho cạn kiệt.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.telegramAlert}
              onChange={(e) => setNotifications({ ...notifications, telegramAlert: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#00285E]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00285E]"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-6 mt-6">
        <button
          onClick={handleSaveNotifications}
          disabled={isSavingNotifications}
          className="flex items-center gap-2 px-6 py-3 bg-[#00285E] hover:bg-[#062047] disabled:bg-slate-400 text-white rounded-xl text-sm font-semibold shadow-md shadow-[#00285E]/10 hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Save size={16} />
          <span>{isSavingNotifications ? 'Đang đồng bộ...' : 'Đồng bộ cấu hình'}</span>
        </button>
      </div>
    </div>
  );
}
