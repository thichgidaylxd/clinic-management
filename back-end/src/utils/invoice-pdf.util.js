const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

module.exports = function generateInvoicePDF(invoice, res) {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true
    });
    console.log(invoice)

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        `inline; filename=invoice-${invoice.ma_hoa_don}.pdf`
    );

    doc.pipe(res);

    // ===== ĐĂNG KÝ FONT TIẾNG VIỆT =====
    // Đường dẫn tới thư mục fonts (tạo thư mục fonts/ trong backend)
    const fontRegular = path.join(__dirname, '../fonts/Roboto-Regular.ttf');
    const fontBold = path.join(__dirname, '../fonts/Roboto-Bold.ttf');

    // Kiểm tra và đăng ký font
    if (fs.existsSync(fontRegular) && fs.existsSync(fontBold)) {
        doc.registerFont('Roboto', fontRegular);
        doc.registerFont('RobotoBold', fontBold);
        doc.font('Roboto');
    } else {
        console.warn('⚠️ Font Roboto không tìm thấy. Tải font từ: https://fonts.google.com/specimen/Roboto');
        console.warn('Đặt file Roboto-Regular.ttf và Roboto-Bold.ttf vào thư mục: backend/fonts/');
    }

    // ===== HEADER =====
    doc.fontSize(24)
        .font('RobotoBold')
        .text('HÓA ĐƠN KHÁM BỆNH', { align: 'center' });

    doc.moveDown(1.5);

    // ===== THÔNG TIN HÓA ĐƠN =====
    doc.fontSize(11)
        .font('Roboto')
        .text(`Mã hóa đơn: ${invoice.ma_hoa_don}`, 50)
        .text(`Ngày: ${new Date(invoice.ngay_tao_hoa_don).toLocaleString('vi-VN')}`)
        .moveDown(0.5);

    // ===== THÔNG TIN BỆNH NHÂN =====
    doc.fontSize(11)
        .text(`Bệnh nhân: ${invoice.ho_benh_nhan || ''} ${invoice.ten_benh_nhan || ''}`)
        .moveDown(1);

    // ===== ĐƯỜNG KẺ NGANG =====
    doc.moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

    doc.moveDown(0.5);

    // ===== TIÊU ĐỀ BẢNG =====
    doc.fontSize(13)
        .font('RobotoBold')
        .text('DANH SÁCH THUỐC VÀ DỊCH VỤ', 50);

    doc.moveDown(0.5);

    // ===== HEADER BẢNG =====
    const tableTop = doc.y;
    const colPositions = {
        stt: 50,
        name: 80,
        quantity: 340,
        price: 410,
        total: 490
    };

    doc.fontSize(10)
        .font('RobotoBold');

    doc.text('STT', colPositions.stt, tableTop, { width: 25 });
    doc.text('Tên thuốc', colPositions.name, tableTop, { width: 250 });
    doc.text('SL', colPositions.quantity, tableTop, { width: 60, align: 'center' });
    doc.text('Đơn giá', colPositions.price, tableTop, { width: 70, align: 'right' });
    doc.text('Thành tiền', colPositions.total, tableTop, { width: 70, align: 'right' });

    // Đường kẻ dưới header
    let currentY = tableTop + 20;
    doc.moveTo(50, currentY)
        .lineTo(550, currentY)
        .stroke();

    currentY += 10;

    // ===== NỘI DUNG BẢNG =====
    doc.font('Roboto').fontSize(10);

    invoice.medicines.forEach((med, index) => {
        // Kiểm tra nếu còn đủ chỗ trên trang
        if (currentY > 700) {
            doc.addPage();
            currentY = 50;
        }

        const quantity = med.so_luong_thuoc_hoa_don || 0;
        const unitPrice = Number(med.don_gia_thuoc) || 0;
        const total = quantity * unitPrice;

        doc.text((index + 1).toString(), colPositions.stt, currentY, { width: 25 });
        doc.text(med.ten_thuoc || 'N/A', colPositions.name, currentY, { width: 250 });
        doc.text(quantity.toString(), colPositions.quantity, currentY, { width: 60, align: 'center' });
        doc.text(unitPrice.toLocaleString('vi-VN'), colPositions.price, currentY, { width: 70, align: 'right' });
        doc.text(total.toLocaleString('vi-VN'), colPositions.total, currentY, { width: 70, align: 'right' });

        currentY += 25;
    });

    // ===== ĐƯỜNG KẺ CUỐI BẢNG =====
    doc.moveTo(50, currentY)
        .lineTo(550, currentY)
        .stroke();

    currentY += 15;

    // ===== TỔNG TIỀN =====
    doc.fontSize(14)
        .font('RobotoBold')
        .text('TỔNG TIỀN:', 350, currentY, { width: 130 })
        .text(
            `${Number(invoice.tong_thanh_tien_hoa_don).toLocaleString('vi-VN')} VNĐ`,
            470,
            currentY,
            { width: 80, align: 'right' }
        );

    currentY += 30;

    // ===== TRẠNG THÁI THANH TOÁN =====
    doc.fontSize(11)
        .font('Roboto')
        .text(
            `Trạng thái: ${invoice.trang_thai_hoa_don === 1 ? '✓ Đã thanh toán' : '○ Chưa thanh toán'}`,
            50,
            currentY
        );

    // ===== FOOTER =====
    const footerY = doc.page.height - 80;
    doc.fontSize(9)
        .font('Roboto')
        .text(
            'Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!',
            50,
            footerY,
            { align: 'center', width: 500 }
        );

    doc.end();
};