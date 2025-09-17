// src/components/Address/index.jsx
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProvinces,
    fetchDistricts,
    fetchWards,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    clearDistricts,
    clearWards,
    searchProvincesAsync,
    searchDistrictsAsync,
    searchWardsAsync,
    clearSearchResults,
} from "@/features/province/provinceSlice";
import SelectForm from "../SelectForm";
import InputReadOnly from "../InputReadOnly";
import { useDebounce } from "@/hooks/useDebounce";

const Address = ({ payload, setPayload }) => {
    const dispatch = useDispatch();
    const [exactAddress, setExactAddress] = useState(payload.exactAddress || "");

    const debouncedExactAddress = useDebounce(exactAddress, 1000);

    const {
        provinces,
        districts,
        wards,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        searchResults,
        loading,
        error,
    } = useSelector((state) => state.provinces);

    // Load provinces khi component mount
    useEffect(() => {
        if (provinces.length === 0) {
            dispatch(fetchProvinces());
        }
    }, [dispatch, provinces.length]);

    // Cập nhật exactAddress từ payload
    useEffect(() => {
        setExactAddress(payload.exactAddress || "");
    }, [payload.exactAddress]);

    // Xử lý chọn tỉnh/thành phố
    const handleProvinceChange = (province) => {
        dispatch(setSelectedProvince(province));
        if (province && province.province_id) {
            dispatch(fetchDistricts(province.province_id));
        } else {
            dispatch(clearDistricts());
        }
        dispatch(clearSearchResults());
    };

    // Xử lý chọn quận/huyện
    const handleDistrictChange = (district) => {
        dispatch(setSelectedDistrict(district));
        if (district && district.district_id) {
            dispatch(fetchWards(district.district_id));
        } else {
            dispatch(clearWards());
        }
        dispatch(clearSearchResults());
    };

    // Xử lý chọn phường/xã
    const handleWardChange = (ward) => {
        dispatch(setSelectedWard(ward));
        dispatch(clearSearchResults());
    };

    // Xử lý tìm kiếm tỉnh/thành phố
    const handleProvinceSearch = (searchTerm) => {
        if (searchTerm.trim()) {
            dispatch(searchProvincesAsync(searchTerm));
        } else {
            dispatch(clearSearchResults());
        }
    };

    // Xử lý tìm kiếm quận/huyện
    const handleDistrictSearch = (searchTerm) => {
        if (searchTerm.trim() && selectedProvince) {
            dispatch(
                searchDistrictsAsync({
                    provinceId: selectedProvince.province_id,
                    searchTerm,
                }),
            );
        } else {
            dispatch(clearSearchResults());
        }
    };

    // Xử lý tìm kiếm phường/xã
    const handleWardSearch = (searchTerm) => {
        if (searchTerm.trim() && selectedDistrict) {
            dispatch(
                searchWardsAsync({
                    districtId: selectedDistrict.district_id,
                    searchTerm,
                }),
            );
        } else {
            dispatch(clearSearchResults());
        }
    };

    // Xử lý thay đổi địa chỉ chính xác
    const handleExactAddressChange = (e) => {
        setExactAddress(e.target.value);
    };

    // Tạo địa chỉ đầy đủ
    const getFullAddress = () => {
        const parts = [];
        if (debouncedExactAddress) parts.push(debouncedExactAddress);
        if (selectedWard) parts.push(selectedWard.ward_name);
        if (selectedDistrict) parts.push(selectedDistrict.district_name);
        if (selectedProvince) parts.push(selectedProvince.province_name);

        return parts.join(", ");
    };

    useEffect(() => {
        if (setPayload) {
            setPayload((prev) => ({
                ...prev,
                address: getFullAddress(),
                exactAddress: debouncedExactAddress,
                province: selectedProvince?.province_name || "",
                district: selectedDistrict?.district_name || "",
                ward: selectedWard?.ward_name || "",
            }));
        }
    }, [selectedProvince, selectedDistrict, selectedWard, debouncedExactAddress, setPayload]);

    return (
        <div>
            <h2 className="font-semibold text-xl py-4">Địa chỉ cho thuê</h2>
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    Có lỗi xảy ra: {error.message}
                </div>
            )}

            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Tỉnh/Thành phố */}
                    <div className="flex-1 min-w-0">
                        <SelectForm
                            label="Tỉnh/Thành phố"
                            options={provinces}
                            searchResults={searchResults.provinces}
                            selectedValue={selectedProvince}
                            onSelectionChange={handleProvinceChange}
                            onSearch={handleProvinceSearch}
                            loading={loading.provinces || loading.search}
                            placeholder="Tìm tỉnh/thành phố..."
                            displayField="province_name"
                            valueField="province_id"
                        />
                    </div>

                    {/* Quận/Huyện */}
                    <div className="flex-1 min-w-0">
                        <SelectForm
                            label="Quận/Huyện"
                            options={districts}
                            searchResults={searchResults.districts}
                            selectedValue={selectedDistrict}
                            onSelectionChange={handleDistrictChange}
                            onSearch={handleDistrictSearch}
                            loading={loading.districts || loading.search}
                            placeholder="Tìm quận/huyện..."
                            displayField="district_name"
                            valueField="district_id"
                            disabled={!selectedProvince}
                        />
                    </div>

                    {/* Phường/Xã */}
                    <div className="flex-1 min-w-0">
                        <SelectForm
                            label="Phường/Xã"
                            options={wards}
                            searchResults={searchResults.wards}
                            selectedValue={selectedWard}
                            onSelectionChange={handleWardChange}
                            onSearch={handleWardSearch}
                            loading={loading.wards || loading.search}
                            placeholder="Tìm phường/xã..."
                            displayField="ward_name"
                            valueField="ward_id"
                            disabled={!selectedDistrict}
                        />
                    </div>
                </div>

                {/* Địa chỉ chính xác */}
                <div>
                    <p className="mb-2 mt-3 font-medium">Địa chỉ chính xác</p>
                    <input
                        type="text"
                        value={exactAddress}
                        onChange={handleExactAddressChange}
                        placeholder="Nhập số nhà, tên đường..."
                        className="border border-gray-300 rounded-md w-full p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                    {/* Hiển thị địa chỉ đầy đủ */}
                    {getFullAddress() && (
                        <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                            <p className="text-sm text-gray-600 mb-1">Địa chỉ đầy đủ:</p>
                            <p className="text-sm font-medium">{getFullAddress()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Address);
