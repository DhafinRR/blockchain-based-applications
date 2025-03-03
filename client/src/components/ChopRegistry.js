import React, { useState, useEffect, useCallback } from 'react';
import { useEthers } from '../hooks/useEthers';
import { useChop } from '../hooks/useChop';
import { Leaf, Calendar, Settings, AlertCircle, Loader2, Plus, Search, ChevronRight } from 'lucide-react';

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
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center space-x-3">
                        <Leaf className="w-8 h-8 text-green-600" />
                        <h2 className="text-3xl font-bold text-gray-800">Chop</h2>
                    </div>
                    <p className="text-gray-600">Sistem Pendaftaran dan Manajemen Data Chop</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Plus className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">From Registrasi</h3>
                        </div>

                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-700">{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Leaf className="w-4 h-4" />
                                    <span>ID Chop</span>
                                </label>
                                <input
                                    type="text"
                                    value={nextChopId}
                                    disabled
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                    <Calendar className="w-4 h-4" />
                                    <span>Tanggal Chop</span>
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
                                    <Settings className="w-4 h-4" />
                                    <span>Gas Option</span>
                                </label>
                                <select
                                    name="gasOption"
                                    value={formData.gasOption}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        <span>Register New Chop</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Data Chop</h3>
                        </div>

                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search by ID or date..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full p-3 pl-11 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>

                        <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2">
                            {displayedChops.map((chop, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-xl bg-gradient-to-br from-white to-green-50 shadow-lg hover:shadow-xl transition-all duration-200 border border-green-100"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Leaf className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">ID Chop</p>
                                                <p className="text-lg font-semibold text-gray-900">#{chop.id_chop}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-600">{chop.tanggal_chop}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChopRegistry;