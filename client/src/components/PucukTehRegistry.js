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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) return alert("Please connect your wallet first.");
        try {
            await addPucukTeh(formData.koordinat, formData.varietas, formData.jumlah, formData.idPetani);
            setFormData({ id_teh: (lastPucukTehId + 1).toString(), koordinat: '', varietas: '', jumlah: '', idPetani: '' });
            await refreshPucukTeh();
        } catch (error) { console.error("Failed to register pucuk teh:", error); }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setDisplayedPucukTeh(pucukTehList.filter(pucuk =>
            pucuk.id_teh.toString().includes(term) ||
            pucuk.koordinat_kebun.toLowerCase().includes(term) ||
            pucuk.varietas_teh.toLowerCase().includes(term)
        ));
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-1">
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
                    <div className="flex flex-col h-full">
                        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-6 flex-1">
                            <div className="flex items-center space-x-2 mb-6">
                                <CirclePlus className="h-6 w-6 text-green-600" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Form Registrasi
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                        readOnly
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
                            </form>
                        </div>

                        {/* Register Button - Positioned below form */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <CirclePlus className="h-5 w-5" />
                            <span>{isLoading ? 'Mendaftarkan...' : 'Daftarkan Pucuk Teh'}</span>
                        </button>
                    </div>

                    {/* Data List Section */}
                    <div className="flex flex-col h-full">
                        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-6 flex-1 flex flex-col">
                            <div className="flex items-center space-x-2 mb-6">
                                <Sprout className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Data Pucuk Teh Terdaftar
                                </h2>
                            </div>

                            <div className="relative mb-4">
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan ID atau koordinat..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Flexible height scrollable list */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-96">
                                {displayedPucukTeh.map((pucuk, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPucukTeh(pucuk)}
                                        className={`p-4 rounded-lg cursor-pointer transition duration-200 ${selectedPucukTeh?.id_teh === pucuk.id_teh
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'hover:bg-gray-50 border border-gray-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <Sprout className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {pucuk.varietas_teh}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ID: {parseInt(pucuk.id_teh) + 1}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Detail Pucuk Teh section tetap di bawah */}
                            {selectedPucukTeh && (
                                <div className="mt-6 p-4 bg-blue-50/50 backdrop-blur-sm rounded-lg border border-blue-200">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Sprout className="h-5 w-5 mr-2 text-blue-600" />
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
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={() => {
                                refreshPucukTeh();
                                // Refresh halaman setelah data diperbarui
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000); // Delay 1 detik untuk memastikan data sudah terupdate
                            }}
                            disabled={isLoading}
                            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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