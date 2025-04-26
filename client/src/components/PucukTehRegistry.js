import React, { useState, useEffect } from 'react';
import { useEthers } from '../hooks/useEthers';
import { usePucukTeh } from '../hooks/usePucukTeh';
import {
    Sprout,
    CirclePlus,
    Search,
    RotateCcw,
    ArrowRight,
    MapPin,
    UserCircle,
    Hash,
    Scale,
    TreePine
} from 'lucide-react';

export default function PucukTehRegistry() {
    const { isConnected, errorMessage, connectWallet } = useEthers();
    const { pucukTehList, isLoading, addPucukTeh, refreshPucukTeh, registeredFarmers, lastPucukTehId } = usePucukTeh();
    const [formData, setFormData] = useState({
        id_teh: '1', koordinat: '', varietas: '', jumlah: '', idPetani: ''
    });
    const [selectedPucukTeh, setSelectedPucukTeh] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedPucukTeh, setDisplayedPucukTeh] = useState([]);
    const [displayedFarmers, setDisplayedFarmers] = useState([]);

    useEffect(() => { if (!isConnected) connectWallet(); }, [isConnected, connectWallet]);
    useEffect(() => { if (isConnected) refreshPucukTeh(); }, [isConnected, refreshPucukTeh]);
    useEffect(() => setDisplayedPucukTeh(pucukTehList), [pucukTehList]);
    useEffect(() => setDisplayedFarmers(registeredFarmers), [registeredFarmers]);
    useEffect(() => { if (lastPucukTehId > 0) setFormData(prev => ({ ...prev, id_teh: lastPucukTehId.toString() })); }, [lastPucukTehId]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-4">
                    <div className="flex justify-center mb-4">
                        <Sprout className="h-16 w-16 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Registrasi Pucuk Teh
                    </h1>
                    <p className="text-lg text-gray-600">
                        Sistem Pendataan dan Manajemen Pucuk Teh
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
                            <CirclePlus className="h-6 w-6 text-green-600" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Form Registrasi
                            </h2>
                        </div>

                        <form
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                addPucukTeh(formData.koordinat, formData.varietas, formData.jumlah, formData.idPetani);
                            }}
                        >
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Hash className="h-4 w-4 mr-2" />
                                    ID Teh
                                </label>
                                <input
                                    type="text"
                                    value={formData.id_teh}
                                    disabled
                                    className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Koordinat Kebun
                                </label>
                                <input
                                    type="text"
                                    name="koordinat"
                                    value={formData.koordinat}
                                    onChange={handleChange}
                                    placeholder="Masukkan koordinat kebun"
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <TreePine className="h-4 w-4 mr-2" />
                                    Varietas Teh
                                </label>
                                <input
                                    type="text"
                                    name="varietas"
                                    value={formData.varietas}
                                    onChange={handleChange}
                                    placeholder="Masukkan varietas teh"
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Scale className="h-4 w-4 mr-2" />
                                    Jumlah Pucuk Teh
                                </label>
                                <input
                                    type="number"
                                    name="jumlah"
                                    value={formData.jumlah}
                                    onChange={handleChange}
                                    placeholder="Masukkan jumlah setor"
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <UserCircle className="h-4 w-4 mr-2" />
                                    Petani
                                </label>
                                <select
                                    name="idPetani"
                                    value={formData.idPetani}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    required
                                >
                                    <option value="">Pilih ID Petani</option>
                                    {displayedFarmers.map((farmer) => (
                                        <option key={farmer.id} value={farmer.id}>
                                            {farmer.id} - {farmer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <CirclePlus className="h-5 w-5" />
                                <span>{isLoading ? 'Mendaftarkan...' : 'Daftarkan Pucuk Teh'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Data List Section */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <Sprout className="h-6 w-6 text-green-600" />
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Data Pucuk Teh
                            </h2>
                        </div>

                        <div className="relative mb-4">
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan koordinat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>

                        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {displayedPucukTeh
                                .filter(p => p.id_teh.includes(searchTerm) || p.koordinat_kebun.toLowerCase().includes(searchTerm))
                                .map((pucuk, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPucukTeh(pucuk)}
                                        className={`p-4 rounded-lg cursor-pointer transition duration-200 ${selectedPucukTeh?.id_teh === pucuk.id_teh
                                            ? 'bg-green-50 border border-green-200'
                                            : 'hover:bg-gray-50 border border-gray-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <Sprout className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        ID: {parseInt(pucuk.id_teh) + 1}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Koordinat: {pucuk.koordinat_kebun}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-green-600" />
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {selectedPucukTeh && (
                            <div className="mt-6 p-4 bg-green-50/50 backdrop-blur-sm rounded-lg border border-green-200">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Sprout className="h-5 w-5 mr-2 text-green-600" />
                                    Detail Pucuk Teh
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-sm flex items-center">
                                        <Hash className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">ID Teh:</span>{' '}
                                        <span className="text-gray-600 ml-2">{parseInt(selectedPucukTeh.id_teh) + 1}</span>
                                    </p>
                                    <p className="text-sm flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">Koordinat:</span>{' '}
                                        <span className="text-gray-600 ml-2">{selectedPucukTeh.koordinat_kebun}</span>
                                    </p>
                                    <p className="text-sm flex items-center">
                                        <TreePine className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">Varietas:</span>{' '}
                                        <span className="text-gray-600 ml-2">{selectedPucukTeh.varietas_teh}</span>
                                    </p>
                                    <p className="text-sm flex items-center">
                                        <Scale className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">Jumlah:</span>{' '}
                                        <span className="text-gray-600 ml-2">{selectedPucukTeh.jumlah_setor}</span>
                                    </p>
                                    <p className="text-sm flex items-center">
                                        <UserCircle className="h-4 w-4 mr-2 text-gray-400" />
                                        <span className="font-medium text-gray-700">ID Petani:</span>{' '}
                                        <span className="text-gray-600 ml-2">{selectedPucukTeh.id_petani}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={refreshPucukTeh}
                            disabled={isLoading}
                            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-22"
                        >
                            <RotateCcw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{isLoading ? 'Memperbarui...' : 'Perbarui Data'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}