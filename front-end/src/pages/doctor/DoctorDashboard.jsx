// import React, { useEffect, useState } from 'react';
// import {
//     Calendar,
//     Clock,
//     CheckCircle,
//     TrendingUp,
//     Users,
//     Stethoscope,
//     FileText,
//     Pill
// } from 'lucide-react';

// import { useNavigate } from 'react-router-dom';
// import { doctorAPI } from '../../services/doctorAPI';

// function DoctorDashboard() {
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(true);
//     const [todayAppointments, setTodayAppointments] = useState([]);

//     useEffect(() => {
//         loadTodayAppointments();
//     }, []);

//     const loadTodayAppointments = async () => {
//         setLoading(true);
//         try {

//             const res = await doctorAPI.getTodayAppointments();
//             console.log('Today appointments:', res);
//             setTodayAppointments(res.data || []);
//         } catch (error) {
//             console.error('Load today appointments error:', error);
//             alert('Không thể tải lịch hẹn hôm nay');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatTime = (time) => {
//         if (!time) return '--:--';
//         return time.substring(0, 5);
//     };

//     const getStatusBadge = (status) => {
//         const map = {
//             0: ['Chờ xác nhận', 'bg-yellow-100 text-yellow-700'],
//             1: ['Đã xác nhận', 'bg-blue-100 text-blue-700'],
//             2: ['Đã check-in', 'bg-teal-100 text-teal-700'],
//             3: ['Đang khám', 'bg-purple-100 text-purple-700'],
//             4: ['Hoàn thành', 'bg-green-100 text-green-700'],
//             5: ['Đã hủy', 'bg-red-100 text-red-700'],
//             6: ['Không đến', 'bg-gray-100 text-gray-700']
//         };

//         const [label, color] = map[status] || map[0];

//         return (
//             <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
//                 {label}
//             </span>
//         );
//     };

//     const handleStartExam = (apt) => {
//         if (apt.trang_thai_lich_hen === 2 || apt.trang_thai_lich_hen === 3) {
//             navigate(`/doctor/prescription/${apt.ma_lich_hen}`);
//         } else {
//             alert('Bệnh nhân chưa sẵn sàng để khám');
//         }
//     };

//     const getActionButton = (apt) => {
//         if (apt.trang_thai_lich_hen === 2) {
//             return (
//                 <button
//                     onClick={() => handleStartExam(apt)}
//                     className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 flex items-center gap-2"
//                 >
//                     <Pill className="w-4 h-4" />
//                     Kê đơn
//                 </button>
//             );
//         }

//         if (apt.trang_thai_lich_hen === 3) {
//             return (
//                 <button
//                     onClick={() => handleStartExam(apt)}
//                     className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-2"
//                 >
//                     <FileText className="w-4 h-4" />
//                     Tiếp tục
//                 </button>
//             );
//         }

//         if (apt.trang_thai_lich_hen === 4) {
//             return (
//                 <span className="text-green-600 text-sm font-medium flex items-center gap-1">
//                     <CheckCircle className="w-4 h-4" />
//                     Đã xong
//                 </span>
//             );
//         }

//         return null;
//     };

//     // Quick stats từ chính todayAppointments
//     const waitingCount = todayAppointments.filter(a => a.trang_thai_lich_hen === 2).length;
//     const inProgressCount = todayAppointments.filter(a => a.trang_thai_lich_hen === 3).length;
//     const completedCount = todayAppointments.filter(a => a.trang_thai_lich_hen === 4).length;

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Dashboard Bác sĩ</h1>
//                 <p className="text-gray-600 mt-1">
//                     {new Date().toLocaleDateString('vi-VN', {
//                         weekday: 'long',
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                     })}
//                 </p>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-white rounded-2xl p-6 shadow border">
//                     <Users className="w-6 h-6 text-teal-600 mb-2" />
//                     <div className="text-2xl font-bold">{waitingCount}</div>
//                     <div className="text-sm text-gray-600">Chờ khám</div>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow border">
//                     <Stethoscope className="w-6 h-6 text-purple-600 mb-2" />
//                     <div className="text-2xl font-bold">{inProgressCount}</div>
//                     <div className="text-sm text-gray-600">Đang khám</div>
//                 </div>

//                 <div className="bg-white rounded-2xl p-6 shadow border">
//                     <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
//                     <div className="text-2xl font-bold">{completedCount}</div>
//                     <div className="text-sm text-gray-600">Hoàn thành</div>
//                 </div>
//             </div>

//             {/* Today Appointments */}
//             <div className="bg-white rounded-2xl p-6 shadow border">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold">Lịch hẹn hôm nay</h2>
//                     <button
//                         onClick={() => navigate('/doctor/examination')}
//                         className="text-teal-600 hover:underline text-sm"
//                     >
//                         Xem tất cả →
//                     </button>
//                 </div>

//                 {todayAppointments.length === 0 ? (
//                     <div className="text-center py-12">
//                         <Calendar className="w-14 h-14 text-gray-300 mx-auto mb-3" />
//                         <p className="text-gray-600">Không có lịch hẹn hôm nay</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {todayAppointments.slice(0, 5).map((apt) => (
//                             <div
//                                 key={apt.ma_lich_hen}
//                                 className="border rounded-xl p-4 hover:bg-teal-50 transition"
//                             >
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex items-center gap-4">
//                                         <div className="flex items-center gap-1 text-gray-700">
//                                             <Clock className="w-4 h-4" />
//                                             <span className="font-semibold">
//                                                 {formatTime(apt.gio_bat_dau)}
//                                             </span>
//                                         </div>

//                                         <div>
//                                             <div className="font-medium">
//                                                 {apt.ho_benh_nhan} {apt.ten_benh_nhan}
//                                             </div>
//                                             <div className="text-sm text-gray-600">
//                                                 {apt.ly_do_kham_lich_hen || 'Khám tổng quát'}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center gap-3">
//                                         {getStatusBadge(apt.trang_thai_lich_hen)}
//                                         {getActionButton(apt)}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default DoctorDashboard;
