import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEthers } from '../hooks/useEthers';
import { useFarmers } from '../hooks/useFarmers';
import { useSetorTeh } from '../hooks/useSetorTeh';
import { Leaf, Calendar, Users, AlertCircle, Loader2, Plus, ChevronRight, ChevronLeft, } from 'lucide-react';

function SetorTeh() {
    const { isConnected, errorMessage, connectWallet } = useEthers();
    const { farmersList, refreshFarmers, isLoading: isFarmersLoading } = useFarmers();
    const { addSetorTeh, getAllSetorTeh, isLoading: isSetorTehLoading, getNextId } = useSetorTeh();

    const [nextId, setNextId] = useState('1');
    const [formData, setFormData] = useState({ idPetani: '', tanggal: '', jumlahSetor: '' });
    const [setorTehList, setSetorTehList] = useState([]);
    const [localError, setLocalError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'
    const carouselRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

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
            // Reset to first page when new data is loaded
            setCurrentPage(1);
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(setorTehList)
        ? setorTehList.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    const totalPages = Math.ceil((Array.isArray(setorTehList) ? setorTehList.length : 0) / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Carousel navigation
    const navigateCarousel = (direction) => {
        if (direction === 'next' && activeIndex < setorTehList.length - 1) {
            setActiveIndex(activeIndex + 1);
        } else if (direction === 'prev' && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
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
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Leaf className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Data Setor Teh</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">View:</span>
                                <select
                                    value={viewMode}
                                    onChange={(e) => setViewMode(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-lg p-2"
                                >
                                    <option value="grid">Grid</option>
                                    <option value="carousel">Carousel</option>
                                </select>
                            </div>
                            {viewMode === 'grid' && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">Items per page:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="text-sm border border-gray-200 rounded-lg p-2"
                                    >
                                        <option value={3}>3</option>
                                        <option value={6}>6</option>
                                        <option value={9}>9</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {viewMode === 'grid' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentItems.map((setor, index) => (
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

                            {/* Pagination Controls */}
                            {Array.isArray(setorTehList) && setorTehList.length > 0 && (
                                <div className="mt-8 flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:text-gray-300 disabled:border-gray-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium">
                                        {currentPage} / {totalPages}
                                    </div>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:text-gray-300 disabled:border-gray-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative">
                            {Array.isArray(setorTehList) && setorTehList.length > 0 ? (
                                <>
                                    <div
                                        ref={carouselRef}
                                        className="overflow-hidden"
                                    >
                                        <div
                                            className="flex transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                                        >
                                            {setorTehList.map((setor, index) => (
                                                <div
                                                    key={index}
                                                    className="w-full flex-shrink-0 p-6"
                                                >
                                                    <div className="mx-auto max-w-md p-6 rounded-xl bg-gradient-to-br from-white to-green-50 shadow-lg border border-green-100">
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
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Carousel Navigation */}
                                    <div className="mt-6 flex items-center justify-center space-x-4">
                                        <button
                                            onClick={() => navigateCarousel('prev')}
                                            disabled={activeIndex === 0}
                                            className="p-3 rounded-full bg-green-100 text-green-600 disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div className="px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium">
                                            {activeIndex + 1} / {setorTehList.length}
                                        </div>
                                        <button
                                            onClick={() => navigateCarousel('next')}
                                            disabled={activeIndex === setorTehList.length - 1}
                                            className="p-3 rounded-full bg-green-100 text-green-600 disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8 text-gray-500">
                                    No data available
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SetorTeh;