import React, { useState } from 'react';
import { Search, ArrowRight, Users, FileText, Video, Shield } from 'lucide-react';
import LoginModal from '../components/modal/LoginModal';
import RegisterModal from '../components/modal/RegisterModal';
import { useNavigate } from 'react-router-dom';
export default function Home() {
    const navigate = useNavigate(); // <-- khai báo navigate
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Hero Section */}
            <section className="container mx-auto py-10 px-10">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Content */}
                    <div className='px-10'>
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight lg:leading-tight">
                            Sức Khỏe Của Bạn<br />
                            Xứng Đáng Có <span className="italic font-serif text-teal-700">chuyên gia</span><br />
                            <span className="italic font-serif text-teal-700">phù hợp</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Kết nối với các bác sĩ hàng đầu, những người lắng nghe<br />
                            và ưu tiên hành trình sức khỏe của bạn
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                onClick={() => navigate('/booking')}
                                className="flex items-center justify-center gap-2 bg-teal-800 border-2 border-teal-700 text-white px-8 py-4 rounded-full hover:text-teal-800 hover:bg-teal-50 transition font-medium"
                            >
                                Đặt Lịch Ngay
                            </button>
                            <button
                                onClick={() => navigate('/booking')}
                                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 transition font-medium"
                            >
                                <Search className="w-5 h-5" />
                                Tìm bác sĩ
                            </button>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition">
                                <h3 className="font-bold text-gray-900 mb-2">Khám Miễn Phí</h3>
                                <p className="text-gray-600 text-sm">
                                    Đánh giá toàn diện không tính phí trước. Ưu đãi có thời hạn.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition">
                                <h3 className="font-bold text-gray-900 mb-2">Kế Hoạch Điều Trị Cá Nhân</h3>
                                <p className="text-gray-600 text-sm">
                                    Từ chẩn đoán đến hồi phục, chúng tôi lập kế hoạch cho nhu cầu riêng của bạn.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Doctor Image & Cards */}
                    <div className="relative">
                        {/* Main Doctor Card - Ảnh làm nền */}
                        <div className="relative rounded-3xl overflow-hidden min-h-[600px]">
                            {/* Doctor Image - Full background */}
                            <img
                                src="/doctor-no-trans.webp"
                                alt="Doctor"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Overlay để làm nổi bật các card */}
                            <div className="absolute inset-0 bg-gradient-to-t from-teal-400/20 via-transparent to-transparent"></div>


                            {/* Floating Cards */}
                            {/* Top Right Card */}
                            <div className="absolute top-8 right-8 bg-white p-4 rounded-2xl shadow-xl max-w-[200px] z-20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-5 h-5 text-teal-700" />
                                    <span className="text-xs font-medium text-gray-500">BẢO MẬT</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Toàn bộ lịch sử y tế của bạn có sẵn cho mọi bác sĩ
                                </p>
                            </div>

                            {/* Bottom Left Card */}
                            <div className="absolute bottom-8 left-8 bg-white p-4 rounded-2xl shadow-xl max-w-[220px] z-20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white"></div>
                                        <div className="w-8 h-8 rounded-full bg-teal-300 border-2 border-white"></div>
                                        <div className="w-8 h-8 rounded-full bg-purple-300 border-2 border-white"></div>
                                        <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                                            30M+
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                    Hàng triệu người đã tìm thấy bác sĩ phù hợp cho nhu cầu sức khỏe riêng của họ.
                                </p>
                            </div>

                            {/* Bottom Right Card */}
                            <div className="absolute bottom-8 right-8 bg-white p-4 rounded-2xl shadow-xl max-w-[200px] z-20">
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Video className="w-6 h-6 text-teal-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">Chăm Sóc Trực Tuyến 24/7</h4>
                                        <p className="text-xs text-gray-600">Đội Ngũ Tại Dịch Vụ Của Bạn</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Bác sĩ được chứng nhận có sẵn mọi lúc
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-teal-700 mb-2">30M+</div>
                            <div className="text-gray-600">Bệnh Nhân</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-700 mb-2">15K+</div>
                            <div className="text-gray-600">Bác Sĩ</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-700 mb-2">50+</div>
                            <div className="text-gray-600">Chuyên Khoa</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-700 mb-2">24/7</div>
                            <div className="text-gray-600">Hỗ Trợ</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Dịch Vụ Của Chúng Tôi
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho bạn và gia đình
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition">
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                                <Search className="w-7 h-7 text-teal-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Tìm Chuyên Gia</h3>
                            <p className="text-gray-600">
                                Tìm kiếm và đặt lịch với các bác sĩ chuyên khoa hàng đầu phù hợp với nhu cầu của bạn
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <Video className="w-7 h-7 text-blue-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Khám Trực Tuyến</h3>
                            <p className="text-gray-600">
                                Tư vấn video an toàn với bác sĩ từ sự thoải mái tại nhà của bạn
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl hover:shadow-xl transition">
                            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <FileText className="w-7 h-7 text-purple-700" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Hồ Sơ Y Tế</h3>
                            <p className="text-gray-600">
                                Truy cập và quản lý hồ sơ sức khỏe của bạn một cách an toàn mọi lúc mọi nơi
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-teal-700 to-teal-900 py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Sẵn Sàng Bắt Đầu Hành Trình Sức Khỏe?
                    </h2>
                    <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                        Tham gia hàng triệu người đã tìm thấy sự chăm sóc y tế phù hợp
                    </p>
                    <button className="bg-white text-teal-800 px-10 py-4 rounded-full hover:bg-gray-50 transition text-lg font-bold inline-flex items-center gap-2">
                        Tìm Bác Sĩ Của Bạn
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white rounded"></div>
                                </div>
                                <span className="text-2xl font-semibold">MedSphere</span>
                            </div>
                            <p className="text-gray-400">
                                Nền tảng kết nối bệnh nhân với các chuyên gia y tế hàng đầu
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Dành Cho Bệnh Nhân</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Tìm Bác Sĩ</a></li>
                                <li><a href="#" className="hover:text-white transition">Đặt Lịch Hẹn</a></li>
                                <li><a href="#" className="hover:text-white transition">Khám Trực Tuyến</a></li>
                                <li><a href="#" className="hover:text-white transition">Hồ Sơ Của Tôi</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Dành Cho Bác Sĩ</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Đăng Ký</a></li>
                                <li><a href="#" className="hover:text-white transition">Đăng Nhập</a></li>
                                <li><a href="#" className="hover:text-white transition">Tài Nguyên</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Công Ty</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Về Chúng Tôi</a></li>
                                <li><a href="#" className="hover:text-white transition">Liên Hệ</a></li>
                                <li><a href="#" className="hover:text-white transition">Bảo Mật</a></li>
                                <li><a href="#" className="hover:text-white transition">Điều Khoản</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 MedSphere. Bảo lưu mọi quyền.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

