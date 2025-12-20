import React from 'react';
import { Pill, Plus, Trash2, Package } from 'lucide-react';

function MedicinePrescription({ medicines, selectedMedicines, setSelectedMedicines }) {

    const addMedicine = () => {
        setSelectedMedicines([
            ...selectedMedicines,
            { ma_thuoc: '', so_luong: 1, ghi_chu: '' }
        ]);
    };

    const updateMedicine = (index, field, value) => {
        const newList = [...selectedMedicines];
        newList[index][field] = value;
        setSelectedMedicines(newList);
    };

    const removeMedicine = (index) => {
        setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                <h2 className="text-white font-semibold flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Kê Đơn Thuốc
                </h2>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">
                        Danh sách thuốc
                    </label>
                    <button
                        onClick={addMedicine}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm thuốc
                    </button>
                </div>

                {selectedMedicines.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 text-lg">
                            Chưa có thuốc nào được kê
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedMedicines.map((med, index) => {
                            const medInfo = medicines.find(
                                m => m.ma_thuoc === med.ma_thuoc
                            );

                            return (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                    <div className="grid grid-cols-12 gap-3">

                                        {/* Tên thuốc */}
                                        <div className="col-span-4">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Tên thuốc *
                                            </label>
                                            <select
                                                value={med.ma_thuoc}
                                                onChange={(e) =>
                                                    updateMedicine(index, 'ma_thuoc', e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Chọn thuốc</option>
                                                {medicines.map(m => (
                                                    <option key={m.ma_thuoc} value={m.ma_thuoc}>
                                                        {m.ten_thuoc}
                                                    </option>
                                                ))}
                                            </select>

                                            {medInfo && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Tồn kho: {medInfo.so_luong_thuoc_ton_thuoc} {medInfo.don_vi_tinh}
                                                </p>
                                            )}
                                        </div>

                                        {/* Số lượng */}
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Số lượng *
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={medInfo?.so_luong_thuoc_ton_thuoc || 999}
                                                value={med.so_luong}
                                                onChange={(e) =>
                                                    updateMedicine(index, 'so_luong', Number(e.target.value))
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            {medInfo && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Đơn vị: {medInfo.don_vi_tinh}
                                                </p>
                                            )}
                                        </div>

                                        {/* Hướng dẫn */}
                                        <div className="col-span-5">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Hướng dẫn sử dụng *
                                            </label>
                                            <input
                                                type="text"
                                                value={med.ghi_chu}
                                                onChange={(e) =>
                                                    updateMedicine(index, 'ghi_chu', e.target.value)
                                                }
                                                placeholder="VD: Uống 2 viên sau ăn, ngày 3 lần"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>

                                        {/* Xóa */}
                                        <div className="col-span-1 flex items-end">
                                            <button
                                                onClick={() => removeMedicine(index)}
                                                className="w-full p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            >
                                                <Trash2 className="w-4 h-4 mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MedicinePrescription;
