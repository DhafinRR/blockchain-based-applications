import React, { useState, useEffect, useCallback } from 'react';
import { useEthers } from '../hooks/useEthers';
import { useFarmers } from '../hooks/useFarmers';
import { Users, UserPlus, Search, RefreshCw, ChevronRight, MapPin, User, Hash, Settings } from 'lucide-react';

function FarmerRegistry() {
    const { isConnected, errorMessage, connectWallet } = useEthers();
    const { registerFarmer, refreshFarmers, registeredFarmers, isLoading, getFarmerCount } = useFarmers();
    const [formData, setFormData] = useState({ name: '', address: '', gasOption: 'market' });
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedFarmers, setDisplayedFarmers] = useState([]);
    const [nextFarmerId, setNextFarmerId] = useState('1');

    const updateNextFarmerId = useCallback(async () => {
        const count = await getFarmerCount();
        setNextFarmerId((parseInt(count) + 1).toString());
    }, [getFarmerCount]);

    useEffect(() => { if (!isConnected) connectWallet(); }, [isConnected, connectWallet]);
    useEffect(() => { refreshFarmers(); updateNextFarmerId(); }, [refreshFarmers, updateNextFarmerId]);
    useEffect(() => { setDisplayedFarmers(registeredFarmers); }, [registeredFarmers]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) return alert("Please connect your wallet first.");
        try {
            await registerFarmer(nextFarmerId, formData.name, formData.address, formData.gasOption);
            setFormData({ name: '', address: '', gasOption: 'market' });
            await refreshFarmers();
            await updateNextFarmerId();
        } catch (error) { console.error("Failed to register farmer:", error); }
    };
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setDisplayedFarmers(registeredFarmers.filter(farmer =>
            farmer.id.toString().includes(term) ||
            farmer.name.toLowerCase().includes(term)
        ));
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-4">
                    <div className="flex justify-center mb-4">
                        <Users className="h-16 w-16 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Registrasi Petani
                    </h1>
                    <p className="text-lg text-gray-600">
                        Sistem Pendaftaran dan Manajemen Data Petani
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{errorMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Registration Form Section */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <UserPlus className="h-6 w-6 text-green-600" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Form Registrasi
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Hash className="h-4 w-4 mr-2" />
                                    ID Petani
                                </label>
                                <input
                                    disabled
                                    type="text"
                                    value={nextFarmerId}
                                    className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-500"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <User className="h-4 w-4 mr-2" />
                                    Nama Petani
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Alamat
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Masukkan alamat lengkap"
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Gas Option
                                </label>
                                <select
                                    name="gasOption"
                                    value={formData.gasOption}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                >
                                    <option value="low">Low</option>
                                    <option value="market">Market</option>
                                    <option value="aggressive">Aggressive</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <UserPlus className="h-5 w-5" />
                                <span>{isLoading ? 'Mendaftarkan...' : 'Daftarkan Petani'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Farmers List Section */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <Users className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Data Petani Terdaftar
                            </h2>
                        </div>

                        <div className="relative mb-4">
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan ID atau nama..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {displayedFarmers.map((farmer, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedFarmer(farmer)}
                                    className={`p-4 rounded-lg cursor-pointer transition duration-200 ${selectedFarmer?.id === farmer.id
                                        ? 'bg-blue-50 border border-blue-200'
                                        : 'hover:bg-gray-50 border border-gray-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <User className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {farmer.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ID: {farmer.id}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedFarmer && (
                            <div className="mt-6 p-4 bg-blue-50/50 backdrop-blur-sm rounded-lg border border-blue-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-blue-600" />
                                    Detail Petani
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-sm flex items-center">
                                        <Hash className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">ID:</span>{' '}
                                        <span className="text-gray-600 ml-2">{selectedFarmer.id}</span>
                                    </p>
                                    <p className="text-sm flex items-center">
                                        <User className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">Nama:</span>{' '}
                                        <span className="text-gray-600 ml-2">{selectedFarmer.name}</span>
                                    </p>
                                    <p className="text-sm flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">Alamat:</span>{' '}
                                        <span className="text-gray-600 ml-2">{selectedFarmer.farmerAddress}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={refreshFarmers}
                            disabled={isLoading}
                            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{isLoading ? 'Memperbarui...' : 'Perbarui Data'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerRegistry;