// front-end/src/components/medicine/MedicineSearch.jsx
//Component tìm kiếm và chọn thuốc từ API

import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, Package } from 'lucide-react';
import medicineAPI from '../../services/medicineAPI';
import { formatPrice } from '../../util/priceFormatter';

function MedicineSearch({ onSelect, excludeIds = [] }) {
    const [keyword, setKeyword] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResults, setShowResults] = useState(false);

    // Debounce search
    useEffect(() => {
        if (!keyword || keyword.length < 2) {
            setMedicines([]);
            setShowResults(false);
            return;
        }

        const timer = setTimeout(() => {
            searchMedicines();
        }, 500);

        return () => clearTimeout(timer);
    }, [keyword]);

    const searchMedicines = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await medicineAPI.search(keyword);

            // Filter out already selected medicines
            const filtered = response.data.filter(
                med => !excludeIds.includes(med.ma_thuoc)
            );

            setMedicines(filtered);
            setShowResults(true);
        } catch (err) {
            console.error('Search error:', err);
            setError('Không thể tìm kiếm thuốc');
            setMedicines([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (medicine) => {
        onSelect(medicine);
        setKeyword('');
        setMedicines([]);
        setShowResults(false);
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.medicine-search-container')) {
            setShowResults(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="medicine-search-container relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Tìm thuốc
            </label>

            <div className="relative">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Nhập tên thuốc..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none pr-10"
                />

                {loading && (
                    <Loader2 className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 animate-spin" />
                )}
            </div>

            {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Search Results Dropdown */}
            {showResults && medicines.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
                    <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-2">
                            Tìm thấy {medicines.length} kết quả
                        </p>
                        {medicines.map((medicine) => (
                            <button
                                key={medicine.ma_thuoc}
                                onClick={() => handleSelect(medicine)}
                                className="w-full text-left px-3 py-3 hover:bg-teal-50 rounded-lg transition flex items-start gap-3"
                            >
                                <Package className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {medicine.ten_thuoc}
                                    </p>
                                    {medicine.thanh_phan_thuoc && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {medicine.thanh_phan_thuoc}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm font-semibold text-teal-700">
                                            {formatPrice(medicine.don_gia_thuoc)}
                                            {medicine.don_vi_tinh && `/${medicine.don_vi_tinh}`}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Tồn: {medicine.so_luong_thuoc_ton_thuoc}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {showResults && medicines.length === 0 && !loading && keyword.length >= 2 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-4 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Không tìm thấy thuốc phù hợp</p>
                </div>
            )}
        </div>
    );
}

export default MedicineSearch;