import React, { useState, useEffect, useCallback } from 'react';
import { useEthers } from '../hooks/useEthers';
import { useChop } from '../hooks/useChop';
import { Leaf, Calendar, Settings, Loader2, Plus, Search, ChevronRight } from 'lucide-react';

function ChopRegistry() {
    const { isConnected, errorMessage, connectWallet } = useEthers();
    const { addChop, registeredChops, isLoading, getChopCount, checkContractInitialization } = useChop();
    const [formData, setFormData] = useState({
        tanggal: '',
        gasOption: 'market'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedChops, setDisplayedChops] = useState([]);
    const [nextChopId, setNextChopId] = useState('1');

    const updateNextChopId = useCallback(async () => {
        if (checkContractInitialization()) {
            const count = await getChopCount();
            setNextChopId((parseInt(count) + 1).toString());
        }
    }, [getChopCount, checkContractInitialization]);

    useEffect(() => { if (!isConnected) connectWallet(); }, [isConnected, connectWallet]);
    useEffect(() => { if (isConnected) updateNextChopId(); }, [isConnected, updateNextChopId]);
    useEffect(() => setDisplayedChops(registeredChops), [registeredChops]);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) { alert("Please connect your wallet first."); await connectWallet(); return; }
        if (!checkContractInitialization()) { alert("Contract not initialized. Please check your connection."); return; }
        try {
            await addChop(formData.tanggal, formData.gasOption);
            setFormData({ tanggal: '', gasOption: 'market' });
            await updateNextChopId();
        } catch (error) {
            console.error("Failed to add chop:", error);
        }
    };

    const handleSearch = e => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = registeredChops.filter(chop =>
            chop.id_chop.toString().includes(term) ||
            chop.tanggal_chop.toLowerCase().includes(term)
        );
        setDisplayedChops(filtered);
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Leaf className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-green-800">Chop Registry</h2>
                    <p className="text-gray-600">Connect your wallet to start managing chop registrations</p>
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
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-4">
                    <div className="flex justify-center mb-4">
                        <Leaf className="h-16 w-16 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Data Chop
                    </h1>
                    <p className="text-lg text-gray-600">
                        Sistem Pendataan dan Manajemen Data Chop
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{errorMessage}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="flex flex-col h-full">
                        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-6 flex-1">
                            <div className="flex items-center space-x-2 mb-6">
                                <Plus className="h-6 w-6 text-green-600" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Form Registrasi
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <Leaf className="h-4 w-4 mr-2" />
                                        ID Chop
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        value={nextChopId}
                                        className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-lg text-gray-500"
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Tanggal Chop
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal"
                                        value={formData.tanggal}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                            </form>
                        </div>

                        {/* Submit Button - Positioned below form */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Mendaftarkan...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    <span>Tambah Chop</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Chops List Section */}
                    <div className="flex flex-col h-full">
                        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg p-6 flex-1 flex flex-col">
                            <div className="flex items-center space-x-2 mb-6">
                                <Leaf className="h-6 w-6 text-blue-600" />
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Data Chop Terdaftar
                                </h2>
                            </div>

                            <div className="relative mb-4">
                                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan ID atau tanggal..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                            </div>

                            {/* Flexible height scrollable list */}
                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-96">
                                {displayedChops.map((chop, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-50 border border-gray-100"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <Leaf className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        Chop #{chop.id_chop}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="flex items-center">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {chop.tanggal_chop}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={async () => {
                                if (checkContractInitialization()) {
                                    await updateNextChopId();
                                    // Refresh halaman setelah data diperbarui
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1000);
                                }
                            }}
                            disabled={isLoading}
                            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <Loader2 className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{isLoading ? 'Memperbarui...' : 'Perbarui Data'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChopRegistry;