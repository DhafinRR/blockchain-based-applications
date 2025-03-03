import React, { useState, useEffect, useCallback } from 'react';
import { useEthers } from '../hooks/useEthers';
import { useFarmers } from '../hooks/useFarmers';
import { useSetorTeh } from '../hooks/useSetorTeh';
import { Leaf, Calendar, Users, AlertCircle, Loader2, Plus, ChevronRight } from 'lucide-react';

function SetorTeh() {
    const { isConnected, errorMessage, connectWallet } = useEthers();
    const { farmersList, refreshFarmers, isLoading: isFarmersLoading } = useFarmers();
    const { addSetorTeh, getAllSetorTeh, isLoading: isSetorTehLoading, getNextId } = useSetorTeh();

    const [nextId, setNextId] = useState('1');
    const [formData, setFormData] = useState({ idPetani: '', tanggal: '', jumlahSetor: '' });
    const [setorTehList, setSetorTehList] = useState([]);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        const updateNextId = async () => {
            if (isConnected) {
                try {
                    const id = await getNextId();
                    setNextId(id);
                } catch (error) {
                    setNextId('1');
                }
            }
        };
        updateNextId();
    }, [isConnected, getNextId, setorTehList]);

    const refreshSetorTehList = useCallback(async () => {
        try {
            const list = await getAllSetorTeh();
            setSetorTehList(Array.isArray(list) ? list : []);
        } catch {
            setLocalError("Failed to load Setor Teh data. Please try again.");
        }
    }, [getAllSetorTeh]);

    useEffect(() => {
        if (isConnected) {
            refreshFarmers();
            refreshSetorTehList();
        }
    }, [isConnected, refreshFarmers, refreshSetorTehList]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) return setLocalError("Please connect your wallet first.");
        try {
            const date = new Date(formData.tanggal);
            await addSetorTeh(formData.idPetani, date.getMonth() + 1, date.getDate(), date.getFullYear(), parseInt(formData.jumlahSetor));
            setFormData({ idPetani: '', tanggal: '', jumlahSetor: '' });
            await refreshSetorTehList();
            setNextId((parseInt(nextId) + 1).toString());
            setLocalError('');
        } catch {
            setLocalError("Failed to add Setor Teh. Please try again.");
        }
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Leaf className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-green-800">Setor Teh</h2>
                    <p className="text-gray-600">Connect your wallet to start managing tea submissions</p>
                    <button
                        onClick={connectWallet}
                        className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                        <ChevronRight className="w-5 h-5" />
                        <span>Connect Wallet</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Setor Teh</h2>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    {(errorMessage || localError) && (
                        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700">{errorMessage || localError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <span>ID Setor</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={nextId}
                                        disabled
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Users className="w-4 h-4" />
                                    <span>Petani</span>
                                </label>
                                <select
                                    name="idPetani"
                                    value={formData.idPetani}
                                    onChange={handleChange}
                                    required
                                    disabled={isFarmersLoading}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Pilih Petani</option>
                                    {Array.isArray(farmersList) && farmersList.map((farmer) => (
                                        <option key={farmer.id} value={farmer.id}>
                                            {farmer.id} - {farmer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Calendar className="w-4 h-4" />
                                    <span>Tanggal</span>
                                </label>
                                <input
                                    type="date"
                                    name="tanggal"
                                    value={formData.tanggal}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Leaf className="w-4 h-4" />
                                    <span>Jumlah Teh</span>
                                </label>
                                <input
                                    type="number"
                                    name="jumlahSetor"
                                    value={formData.jumlahSetor}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    min="1"
                                    required
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSetorTehLoading || isFarmersLoading}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isSetorTehLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    <span>Setor Teh</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Data Setor Teh</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(setorTehList) && setorTehList.map((setor, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-xl bg-gradient-to-br from-white to-green-50 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-green-100"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Leaf className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">ID Setor</p>
                                            <p className="text-lg font-semibold text-gray-900">{setor.id}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">ID Petani</span>
                                        <span className="text-sm font-medium text-gray-900">{setor.idPetani}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Tanggal</span>
                                        <span className="text-sm font-medium text-gray-900">{setor.hari}/{setor.bulan}/{setor.tahun}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Jumlah Teh</span>
                                        <span className="text-sm font-medium text-green-600">{setor.jumlahSetor} kg</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetorTeh;