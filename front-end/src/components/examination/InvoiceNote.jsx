import React from 'react';
import { FileText } from 'lucide-react';

function InvoiceNote({ value, onChange }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                Ghi chú hóa đơn
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="VD: Hẹn tái khám sau 1 tuần..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
        </div>
    );
}

export default InvoiceNote;