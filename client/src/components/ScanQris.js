import React, { useState, useCallback, useEffect } from 'react';
import { QRCode } from 'react-qr-code';
import { useSetorTeh } from '../hooks/useSetorTeh';
import { useChop } from '../hooks/useChop';
import { usePucukTeh } from '../hooks/usePucukTeh';
import { useFarmers } from '../hooks/useFarmers';
import { Search, QrCode, User, Leaf, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ScanQris = () => {
    const [scannedData, setScannedData] = useState(null);
    const [scanInput, setScanInput] = useState('');
    const [qrCodeData, setQrCodeData] = useState(null);
    const { getAllSetorTeh } = useSetorTeh();
    const { getAllChop } = useChop();
    const { pucukTehList } = usePucukTeh();
    const { registeredFarmers } = useFarmers();
    const [combinedData, setCombinedData] = useState([]);

    // Debug logging for data
    useEffect(() => {
        console.log("Current pucukTehList:", pucukTehList);
        console.log("Current registeredFarmers:", registeredFarmers);
    }, [pucukTehList, registeredFarmers]);

    const getFarmerById = useCallback((farmerId) => {
        if (!farmerId) return null;
        const farmer = registeredFarmers.find(farmer => farmer.id === farmerId);
        console.log("Looking for farmer with ID:", farmerId, "Found:", farmer);
        return farmer;
    }, [registeredFarmers]);

    const getPucukTehById = useCallback((id) => {
        // Log the search parameters
        console.log("Searching for tea data with ID:", id);
        console.log("Available pucukTehList entries:", pucukTehList.length);

        if (!id) {
            console.log("No ID provided to getPucukTehById");
            return null;
        }

        // Convert id to string for safer comparison
        const searchId = String(id).trim();

        // Try all possible fields with extensive logging
        for (const pucuk of pucukTehList) {
            // Create an array of all potential ID fields to check
            const fieldsToCheck = [
                { name: 'id_teh', value: pucuk.id_teh },
                { name: 'id', value: pucuk.id },
                { name: 'transaction_id', value: pucuk.transaction_id },
                { name: 'setor_id', value: pucuk.setor_id },
                { name: 'id_setor', value: pucuk.id_setor },
                { name: 'id_transaksi', value: pucuk.id_transaksi }
            ];

            // Check each field
            for (const field of fieldsToCheck) {
                if (field.value && String(field.value).trim() === searchId) {
                    console.log(`Match found on field "${field.name}" with value "${field.value}"`);
                    return pucuk;
                }
            }
        }

        console.log("No matching tea data found for ID:", searchId);
        return null;
    }, [pucukTehList]);

    const handleScan = async (id) => {
        try {
            if (!id) {
                throw new Error('ID transaksi tidak valid');
            }

            console.log("Starting scan for ID:", id);

            // Check if data is loaded
            if (!pucukTehList || pucukTehList.length === 0) {
                console.log("Tea data not yet loaded, waiting...");
                // Could add a loading mechanism here
            }

            const allSetorTeh = await getAllSetorTeh();
            const allChop = await getAllChop();

            console.log("Retrieved setor data:", allSetorTeh.length, "entries");
            console.log("Retrieved chop data:", allChop.length, "entries");

            const setorData = allSetorTeh.find(setor => setor.id === id);
            if (!setorData) {
                throw new Error('Data tidak ditemukan');
            }
            console.log("Found setor data:", setorData);

            const chopData = allChop.find(chop => chop.id_chop === id);
            console.log("Found chop data:", chopData || "None");

            // Log before attempting to find pucukTehData
            console.log("Looking for tea data with transaction ID:", id);

            // Try multiple strategies to find the tea data
            let pucukTehData = getPucukTehById(id);

            // If no direct match, try using the setor ID as a fallback
            if (!pucukTehData && setorData.id) {
                console.log("Trying alternate lookup using setor ID:", setorData.id);
                pucukTehData = getPucukTehById(setorData.id);
            }

            // If still no match and we have a farmer ID, try finding tea data by farmer ID
            if (!pucukTehData && setorData.idPetani) {
                console.log("Trying to find any tea data for farmer ID:", setorData.idPetani);
                pucukTehData = pucukTehList.find(p => p.id_petani === setorData.idPetani);
            }

            console.log("Final pucukTehData found:", pucukTehData);

            const farmerData = getFarmerById(setorData.idPetani);
            console.log("Found farmer data:", farmerData || "None");

            // Handle the case where we don't have tea data more gracefully
            const normalizedPucukTehData = pucukTehData ? {
                koordinat_kebun: pucukTehData.koordinat_kebun || pucukTehData.lokasi || pucukTehData.location || '',
                varietas_teh: pucukTehData.varietas_teh || pucukTehData.varietas || pucukTehData.variety || '',
                jumlah_setor: pucukTehData.jumlah_setor || pucukTehData.jumlah || pucukTehData.amount || setorData.jumlahSetor || ''
            } : {
                // Default values when no tea data found
                koordinat_kebun: 'Data tidak tersedia',
                varietas_teh: 'Data tidak tersedia',
                jumlah_setor: setorData.jumlahSetor || 'Data tidak tersedia'
            };

            const combinedData = {
                ...setorData,
                chopData: chopData || {},
                pucukTehData: normalizedPucukTehData,
                farmerData: farmerData || {}
            };

            console.log("Final combined data:", combinedData);
            setScannedData(combinedData);
            setQrCodeData(combinedData);
        } catch (error) {
            console.error('Gagal memindai QR Code:', error);
            setScannedData({
                error: error.message || 'Gagal memuat data. Coba lagi.',
                details: error.toString()
            });
            setQrCodeData(null);
        }
    };

    const downloadQRCode = () => {
        if (!qrCodeData) return;

        // Get the QR code container
        const qrContainer = document.getElementById('qrcode');
        if (!qrContainer) {
            console.error('QR code container not found');
            return;
        }

        // Get the SVG or canvas from the container
        const canvas = qrContainer.querySelector('canvas') || qrContainer.querySelector('svg');
        if (!canvas) {
            console.error('Canvas or SVG element not found');
            return;
        }

        // For SVG elements, we need to convert to canvas first
        const isCanvas = canvas.tagName.toLowerCase() === 'canvas';

        // Initialize PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Get image data - different methods for canvas vs SVG
        let imgData;
        if (isCanvas) {
            imgData = canvas.toDataURL('image/png');
            addContentToPdf(pdf, imgData);
            pdf.save(`tea-transaction-${scannedData?.id || 'certificate'}.pdf`);
        } else {
            // Convert SVG to canvas
            const svgData = new XMLSerializer().serializeToString(canvas);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const DOMURL = window.URL || window.webkitURL || window;
            const img = new Image();
            const url = DOMURL.createObjectURL(svgBlob);

            // Create a temporary canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width.baseVal.value;
            tempCanvas.height = canvas.height.baseVal.value;
            const ctx = tempCanvas.getContext('2d');

            // Draw on the temp canvas when image loads
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                imgData = tempCanvas.toDataURL('image/png');
                DOMURL.revokeObjectURL(url);

                // Continue with PDF generation
                addContentToPdf(pdf, imgData);
                pdf.save(`tea-transaction-${scannedData?.id || 'certificate'}.pdf`);
            };
            img.src = url;
        }
    };

    // Helper function to add content to PDF
    const addContentToPdf = (pdf, imgData) => {
        // Add title and header
        pdf.setFontSize(20);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Tea Transaction', 105, 20, { align: 'center' });

        // Add QR code
        pdf.addImage(imgData, 'PNG', 70, 40, 70, 70);

        // Add transaction details
        if (scannedData && !scannedData.error) {
            // Transaction Details section
            pdf.setFontSize(14);
            pdf.setTextColor(0, 102, 204);
            pdf.text('Transaction Details', 20, 130);

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Transaction ID: ${scannedData.id}`, 20, 140);
            pdf.text(`Date: ${scannedData.hari}/${scannedData.bulan}/${scannedData.tahun}`, 20, 150);
            pdf.text(`Amount: ${scannedData.jumlahSetor} kg`, 20, 160);

            // Farmer Details section
            pdf.setFontSize(14);
            pdf.setTextColor(0, 102, 204);
            pdf.text('Farmer Information', 20, 180);

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Name: ${scannedData.farmerData?.name || 'Not available'}`, 20, 190);
            pdf.text(`Address: ${scannedData.farmerData?.farmerAddress || 'Not available'}`, 20, 200);
            pdf.text(`ID: ${scannedData.idPetani || 'Not available'}`, 20, 210);

            // Tea Details section
            pdf.setFontSize(14);
            pdf.setTextColor(0, 102, 204);
            pdf.text('Tea Information', 20, 230);

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Location: ${scannedData.pucukTehData?.koordinat_kebun || 'Not available'}`, 20, 240);
            pdf.text(`Variety: ${scannedData.pucukTehData?.varietas_teh || 'Not available'}`, 20, 250);
            pdf.text(`Amount: ${scannedData.pucukTehData?.jumlah_setor || 'Not available'}`, 20, 260);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const allSetorTeh = await getAllSetorTeh();
                const allChop = await getAllChop();

                console.log("Loaded setor data:", allSetorTeh);
                console.log("Loaded chop data:", allChop);

                const data = allSetorTeh.map(setor => {
                    // Find associated tea data with more flexible lookup
                    let pucukData = getPucukTehById(setor.id);

                    // If not found, try by farmer ID
                    if (!pucukData && setor.idPetani) {
                        pucukData = pucukTehList.find(p => p.id_petani === setor.idPetani);
                    }

                    // Normalize pucuk data
                    const normalizedPucukTehData = pucukData ? {
                        koordinat_kebun: pucukData.koordinat_kebun || pucukData.lokasi || pucukData.location || '',
                        varietas_teh: pucukData.varietas_teh || pucukData.varietas || pucukData.variety || '',
                        jumlah_setor: pucukData.jumlah_setor || pucukData.jumlah || pucukData.amount || setor.jumlahSetor || ''
                    } : {
                        koordinat_kebun: 'Data tidak tersedia',
                        varietas_teh: 'Data tidak tersedia',
                        jumlah_setor: setor.jumlahSetor || 'Data tidak tersedia'
                    };

                    return {
                        ...setor,
                        chopData: allChop.find(chop => chop.id_chop === setor.id) || {},
                        pucukTehData: normalizedPucukTehData,
                        farmerData: getFarmerById(setor.idPetani) || {}
                    };
                });

                setCombinedData(data);
            } catch (error) {
                console.error('Error loading data:', error);
                setCombinedData([]);
            }
        };
        loadData();
    }, [getAllSetorTeh, getAllChop, getPucukTehById, getFarmerById, pucukTehList]);

    const handleManualScan = (e) => {
        e.preventDefault();
        handleScan(scanInput);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <QrCode className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Scan QRIS System</h1>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <form onSubmit={handleManualScan} className="relative">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={scanInput}
                                    onChange={(e) => setScanInput(e.target.value)}
                                    placeholder="Enter Transaction ID"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <button type="submit" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md">
                                <Search className="w-5 h-5" />
                                <span>Scan ID</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* QR Code Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex flex-col items-center">
                            <div id="qrcode" className="bg-gray-50 p-8 rounded-lg mb-6">
                                {qrCodeData ? (
                                    <div id="qrcode">
                                        <QRCode
                                            value={JSON.stringify(qrCodeData)}
                                            size={256}
                                            bgColor="#ffffff"
                                            fgColor="#000000"
                                            level="H"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-64 w-64 bg-gray-100 rounded-lg">
                                        <p className="text-gray-500 text-center">Enter an ID to generate QR Code</p>
                                    </div>
                                )}
                            </div>
                            {qrCodeData && (
                                <button
                                    onClick={downloadQRCode}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
                                >
                                    <Download className="w-5 h-5" />
                                    <span>Download QR Code PDF</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-8 text-white">
                        <h3 className="text-xl font-semibold mb-6">Quick Guide</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <QrCode className="w-6 h-6 mt-1" />
                                <p>Scan QR code untuk melihat data Penyetoran dan Quality Control</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <Search className="w-6 h-6 mt-1" />
                                <p>Masukkan ID transaksi secara manual untuk mengambil catatan tertentu</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <Download className="w-6 h-6 mt-1" />
                                <p>Download QR code dan detail transaksi dalam format PDF</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Scanned Data Results */}
                {scannedData && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800">Scan Results</h3>
                        </div>

                        {scannedData.error ? (
                            <div className="p-6">
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl">
                                    <p className="font-medium">{scannedData.error}</p>
                                    <p className="text-sm mt-2 text-red-600">{scannedData.details}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6 p-6">
                                {/* Farmer Info */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <User className="w-6 h-6 text-green-600" />
                                        <h4 className="text-lg font-semibold">Farmer Information</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <p><span className="text-gray-600">Name:</span> {scannedData.farmerData?.name || '-'}</p>
                                        <p><span className="text-gray-600">Address:</span> {scannedData.farmerData?.farmerAddress || '-'}</p>
                                        <p><span className="text-gray-600">ID:</span> {scannedData.idPetani}</p>
                                    </div>
                                </div>
                                {/* Transaction Info */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <QrCode className="w-6 h-6 text-blue-600" />
                                        <h4 className="text-lg font-semibold">Transaction Details</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <p><span className="text-gray-600">ID:</span> {scannedData.id}</p>
                                        <p><span className="text-gray-600">Date:</span> {`${scannedData.hari}/${scannedData.bulan}/${scannedData.tahun}`}</p>
                                        <p><span className="text-gray-600">Amount:</span> {scannedData.jumlahSetor} kg</p>
                                    </div>
                                </div>


                                {/* Tea Info */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Leaf className="w-6 h-6 text-green-600" />
                                        <h4 className="text-lg font-semibold">Tea Information</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <p><span className="text-gray-600">Location:</span> {scannedData.pucukTehData?.koordinat_kebun || '-'}</p>
                                        <p><span className="text-gray-600">Variety:</span> {scannedData.pucukTehData?.varietas_teh || '-'}</p>
                                        <p><span className="text-gray-600">Amount:</span> {scannedData.pucukTehData?.jumlah_setor || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800">Stored QR Code Data</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Transaction ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount (kg)</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">QC Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Farmer ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combinedData.map((item, index) => (
                                    <tr key={`${item.id}-${index}`} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">{item.id}</td>
                                        <td className="px-6 py-4">{`${item.hari}/${item.bulan}/${item.tahun}`}</td>
                                        <td className="px-6 py-4">{item.jumlahSetor}</td>
                                        <td className="px-6 py-4">{item.chopData?.tanggal_chop || '-'}</td>
                                        <td className="px-6 py-4">{item.idPetani}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleScan(item.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                                            >
                                                <QrCode className="w-4 h-4" />
                                                <span>Generate QR</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanQris;