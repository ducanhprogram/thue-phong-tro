// Address.jsx
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

    // Load provinces when component mounts
    useEffect(() => {
        if (provinces.length === 0) {
            dispatch(fetchProvinces());
        }
    }, [dispatch, provinces.length]);

    // Initialize province, district, and ward from payload
    useEffect(() => {
        if (payload.province && provinces.length > 0 && !selectedProvince) {
            const foundProvince = provinces.find((p) => {
                const cleanProvinceName = p.province_name.replace("Thành phố ", "").replace("Tỉnh ", "").trim();
                const cleanPayloadProvince = payload.province.replace("Thành phố ", "").replace("Tỉnh ", "").trim();
                return cleanProvinceName === cleanPayloadProvince || p.province_name === payload.province;
            });

            if (foundProvince) {
                dispatch(setSelectedProvince(foundProvince));
                dispatch(fetchDistricts(foundProvince.province_id));
            }
        }
    }, [payload.province, provinces, selectedProvince, dispatch]);

    // Initialize district when districts are available
    useEffect(() => {
        if (payload.district && districts.length > 0 && selectedProvince && !selectedDistrict && !loading.districts) {
            const foundDistrict = districts.find((d) => {
                const cleanDistrictName = d.district_name
                    .replace("Quận ", "")
                    .replace("Huyện ", "")
                    .replace("Thị xã ", "")
                    .replace("Thành phố ", "")
                    .trim();
                const cleanPayloadDistrict = payload.district
                    .replace("Quận ", "")
                    .replace("Huyện ", "")
                    .replace("Thị xã ", "")
                    .replace("Thành phố ", "")
                    .trim();
                return cleanDistrictName === cleanPayloadDistrict || d.district_name === payload.district;
            });

            if (foundDistrict) {
                dispatch(setSelectedDistrict(foundDistrict));
                dispatch(fetchWards(foundDistrict.district_id));
            }
        }
    }, [payload.district, districts, selectedProvince, selectedDistrict, loading.districts, dispatch]);

    // Initialize ward when wards are available
    useEffect(() => {
        if (payload.ward && wards.length > 0 && selectedDistrict && !selectedWard && !loading.wards) {
            const foundWard = wards.find((w) => {
                const cleanWardName = w.ward_name
                    .replace("Phường ", "")
                    .replace("Xã ", "")
                    .replace("Thị trấn ", "")
                    .trim();
                const cleanPayloadWard = payload.ward
                    .replace("Phường ", "")
                    .replace("Xã ", "")
                    .replace("Thị trấn ", "")
                    .trim();
                return cleanWardName === cleanPayloadWard || w.ward_name === payload.ward;
            });

            if (foundWard) {
                dispatch(setSelectedWard(foundWard));
            }
        }
    }, [payload.ward, wards, selectedDistrict, selectedWard, loading.wards, dispatch]);

    // Update exactAddress from payload
    useEffect(() => {
        setExactAddress(payload.exactAddress || "");
    }, [payload.exactAddress]);

    // Handle province change
    const handleProvinceChange = (province) => {
        dispatch(setSelectedProvince(province));
        if (province && province.province_id) {
            dispatch(fetchDistricts(province.province_id));
        } else {
            dispatch(clearDistricts());
        }
        dispatch(clearSearchResults());
    };

    // Handle district change
    const handleDistrictChange = (district) => {
        dispatch(setSelectedDistrict(district));
        if (district && district.district_id) {
            dispatch(fetchWards(district.district_id));
        } else {
            dispatch(clearWards());
        }
        dispatch(clearSearchResults());
    };

    // Handle ward change
    const handleWardChange = (ward) => {
        dispatch(setSelectedWard(ward));
        dispatch(clearSearchResults());
    };

    // Handle search for provinces
    const handleProvinceSearch = (searchTerm) => {
        if (searchTerm.trim()) {
            dispatch(searchProvincesAsync(searchTerm));
        } else {
            dispatch(clearSearchResults());
        }
    };

    // Handle search for districts
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

    // Handle search for wards
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

    // Handle exact address change
    const handleExactAddressChange = (e) => {
        setExactAddress(e.target.value);
    };

    // Generate full address
    const getFullAddress = () => {
        const parts = [];
        if (debouncedExactAddress) parts.push(debouncedExactAddress);
        if (selectedWard) parts.push(selectedWard.ward_name);
        if (selectedDistrict) parts.push(selectedDistrict.district_name);
        if (selectedProvince) parts.push(selectedProvince.province_name);

        return parts.join(", ");
    };

    // Update payload with full address
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
                    {/* Province */}
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

                    {/* District */}
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

                    {/* Ward */}
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

                {/* Exact Address */}
                <div>
                    <p className="mb-2 mt-3 font-medium">Địa chỉ chính xác</p>
                    <input
                        type="text"
                        value={exactAddress}
                        onChange={handleExactAddressChange}
                        placeholder="Nhập số nhà, tên đường..."
                        className="border border-gray-300 rounded-md w-full p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                    {/* Display Full Address */}
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
