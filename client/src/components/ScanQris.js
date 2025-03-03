import React, { useState, useCallback } from 'react';
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

    const getFarmerById = useCallback((farmerId) => {
        return registeredFarmers.find(farmer => farmer.id === farmerId);
    }, [registeredFarmers]);

    const getPucukTehById = useCallback((id) => {
        return pucukTehList.find(pucuk => pucuk.id_teh === id);
    }, [pucukTehList]);

    const handleScan = async (id) => {
        try {
            if (!id) {
                throw new Error('ID transaksi tidak valid');
            }

            const allSetorTeh = await getAllSetorTeh();
            const allChop = await getAllChop();

            const setorData = allSetorTeh.find(setor => setor.id === id);
            if (!setorData) {
                throw new Error('Data tidak ditemukan');
            }

            const chopData = allChop.find(chop => chop.id_chop === id);
            const pucukTehData = getPucukTehById(id);
            const farmerData = getFarmerById(setorData.idPetani);

            const combinedData = {
                ...setorData,
                chopData: chopData || {},
                pucukTehData: pucukTehData || {},
                farmerData: farmerData || {}
            };

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

        // Create a temporary canvas to draw the QR code
        const qrContainer = document.getElementById('qrcode');
        const canvas = qrContainer.querySelector('canvas');

        if (!canvas) return;

        // Initialize PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add title and header
        pdf.setFontSize(20);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Tea Transaction Certificate', 105, 20, { align: 'center' });

        // Add QR code
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 70, 40, 70, 70);

        // Add transaction details
        if (scannedData && !scannedData.error) {
            // Transaction Details
            pdf.setFontSize(14);
            pdf.setTextColor(0, 102, 204);
            pdf.text('Transaction Details', 20, 130);

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Transaction ID: ${scannedData.id}`, 20, 140);
            pdf.text(`Date: ${scannedData.hari}/${scannedData.bulan}/${scannedData.tahun}`, 20, 150);
            pdf.text(`Amount: ${scannedData.jumlahSetor} kg`, 20, 160);

            // Farmer Information
            if (scannedData.farmerData) {
                pdf.setFontSize(14);
                pdf.setTextColor(0, 102, 204);
                pdf.text('Farmer Information', 20, 180);

                pdf.setFontSize(12);
                pdf.setTextColor(0, 0, 0);
                pdf.text(`Name: ${scannedData.farmerData.name || '-'}`, 20, 190);
                pdf.text(`Farmer ID: ${scannedData.idPetani}`, 20, 200);
                pdf.text(`Address: ${scannedData.farmerData.farmerAddress || '-'}`, 20, 210);
            }

            // Tea Information
            if (scannedData.pucukTehData) {
                pdf.setFontSize(14);
                pdf.setTextColor(0, 102, 204);
                pdf.text('Tea Information', 20, 230);

                pdf.setFontSize(12);
                pdf.setTextColor(0, 0, 0);
                pdf.text(`Location: ${scannedData.pucukTehData.koordinat_kebun || '-'}`, 20, 240);
                pdf.text(`Variety: ${scannedData.pucukTehData.varietas_teh || '-'}`, 20, 250);
                pdf.text(`Amount Submitted: ${scannedData.pucukTehData.jumlah_setor || '-'} kg`, 20, 260);
            }

            // Footer
            pdf.setFontSize(10);
            pdf.setTextColor(128, 128, 128);
            pdf.text('This is a digitally generated certificate.', 105, 280, { align: 'center' });
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
        }

        // Download PDF
        pdf.save(`tea-transaction-${scannedData?.id || 'certificate'}.pdf`);
    };

    const [combinedData, setCombinedData] = useState([]);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const allSetorTeh = await getAllSetorTeh();
                const allChop = await getAllChop();

                const data = allSetorTeh.map(setor => ({
                    ...setor,
                    chopData: allChop.find(chop => chop.id_chop === setor.id) || {},
                    pucukTehData: getPucukTehById(setor.id) || {},
                    farmerData: getFarmerById(setor.idPetani) || {}
                }));

                setCombinedData(data);
            } catch (error) {
                console.error('Error loading data:', error);
                setCombinedData([]);
            }
        };
        loadData();
    }, [getAllSetorTeh, getAllChop, getPucukTehById, getFarmerById]);

    const handleManualScan = (e) => {
        e.preventDefault();
        handleScan(scanInput);
    };

    return (
        <div className=" p-8">
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
                                    <QRCode
                                        value={JSON.stringify(qrCodeData)}
                                        size={256}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="H"
                                    />
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



// import React, { useState, useCallback } from 'react';
// import { QRCodeCanvas } from 'qrcode.react';
// import { useSetorTeh } from '../hooks/useSetorTeh';
// import { useChop } from '../hooks/useChop';
// import { usePucukTeh } from '../hooks/usePucukTeh';
// import { useFarmers } from '../hooks/useFarmers';
// import { Search, QrCode, User, Leaf, Download } from 'lucide-react';
// import { jsPDF } from 'jspdf';

// const ScanQris = () => {
//     const [scannedData, setScannedData] = useState(null);
//     const [scanInput, setScanInput] = useState('');
//     const [qrCodeData, setQrCodeData] = useState(null);
//     const { getAllSetorTeh } = useSetorTeh();
//     const { getAllChop } = useChop();
//     const { pucukTehList } = usePucukTeh();
//     const { registeredFarmers } = useFarmers();


//     const getFarmerById = useCallback((farmerId) => {
//         return registeredFarmers?.find(farmer => farmer.id === farmerId) || null;
//     }, [registeredFarmers]);

//     const getPucukTehById = useCallback((id) => {
//         return pucukTehList?.find(pucuk => pucuk.id_teh === id) || null;
//     }, [pucukTehList]);

//     const handleScan = async (id) => {
//         try {
//             if (!id) {
//                 throw new Error('ID transaksi tidak valid');
//             }

//             const allSetorTeh = await getAllSetorTeh();
//             const allChop = await getAllChop();

//             const setorData = allSetorTeh?.find(setor => setor.id === id);
//             if (!setorData) {
//                 throw new Error('Data tidak ditemukan');
//             }

//             const chopData = allChop?.find(chop => chop.id_chop === id);
//             const pucukTehData = getPucukTehById(id);
//             const farmerData = getFarmerById(setorData.idPetani);

//             const combinedData = {
//                 ...setorData,
//                 chopData: chopData || {},
//                 pucukTehData: pucukTehData || {},
//                 farmerData: farmerData || {}
//             };

//             setScannedData(combinedData);
//             setQrCodeData(combinedData);
//         } catch (error) {
//             console.error('Gagal memindai QR Code:', error);
//             setScannedData({
//                 error: error.message || 'Gagal memuat data. Coba lagi.',
//                 details: error.toString()
//             });
//             setQrCodeData(null);
//         }
//     };

//     const downloadQRCode = () => {
//         const canvas = document.getElementById('qr-code');
//         if (!canvas || !qrCodeData) return;

//         try {
//             const pdf = new jsPDF({
//                 orientation: 'portrait',
//                 unit: 'mm',
//                 format: 'a4'
//             });

//             const imgData = canvas.toDataURL('image/png');

//             // Add title
//             pdf.setFontSize(20);
//             pdf.setTextColor(0, 0, 0);
//             pdf.text('Tea Transaction Certificate', 105, 20, { align: 'center' });

//             // Add QR code
//             pdf.addImage(imgData, 'PNG', 70, 40, 70, 70);

//             if (scannedData && !scannedData.error) {
//                 // Transaction Details
//                 pdf.setFontSize(14);
//                 pdf.setTextColor(0, 102, 204);
//                 pdf.text('Transaction Details', 20, 130);

//                 pdf.setFontSize(12);
//                 pdf.setTextColor(0, 0, 0);
//                 pdf.text(`Transaction ID: ${scannedData.id}`, 20, 140);
//                 pdf.text(`Date: ${scannedData.hari}/${scannedData.bulan}/${scannedData.tahun}`, 20, 150);
//                 pdf.text(`Amount: ${scannedData.jumlahSetor} kg`, 20, 160);

//                 // Farmer Information
//                 if (scannedData.farmerData) {
//                     pdf.setFontSize(14);
//                     pdf.setTextColor(0, 102, 204);
//                     pdf.text('Farmer Information', 20, 180);

//                     pdf.setFontSize(12);
//                     pdf.setTextColor(0, 0, 0);
//                     pdf.text(`Name: ${scannedData.farmerData.name || '-'}`, 20, 190);
//                     pdf.text(`Farmer ID: ${scannedData.idPetani}`, 20, 200);
//                     pdf.text(`Address: ${scannedData.farmerData.farmerAddress || '-'}`, 20, 210);
//                 }

//                 // Tea Information
//                 if (scannedData.pucukTehData) {
//                     pdf.setFontSize(14);
//                     pdf.setTextColor(0, 102, 204);
//                     pdf.text('Tea Information', 20, 230);

//                     pdf.setFontSize(12);
//                     pdf.setTextColor(0, 0, 0);
//                     pdf.text(`Location: ${scannedData.pucukTehData.koordinat_kebun || '-'}`, 20, 240);
//                     pdf.text(`Variety: ${scannedData.pucukTehData.varietas_teh || '-'}`, 20, 250);
//                     pdf.text(`Amount Submitted: ${scannedData.pucukTehData.jumlah_setor || '-'} kg`, 20, 260);
//                 }

//                 // Footer
//                 pdf.setFontSize(10);
//                 pdf.setTextColor(128, 128, 128);
//                 pdf.text('This is a digitally generated certificate.', 105, 280, { align: 'center' });
//                 pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
//             }

//             // Save the PDF
//             pdf.save(`tea-transaction-${scannedData?.id || 'certificate'}.pdf`);
//         } catch (error) {
//             console.error('Error generating PDF:', error);
//         }
//     };

//     const [combinedData, setCombinedData] = useState([]);

//     React.useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const allSetorTeh = await getAllSetorTeh();
//                 const allChop = await getAllChop();

//                 const data = allSetorTeh?.map(setor => ({
//                     ...setor,
//                     chopData: allChop?.find(chop => chop.id_chop === setor.id) || {},
//                     pucukTehData: getPucukTehById(setor.id) || {},
//                     farmerData: getFarmerById(setor.idPetani) || {}
//                 })) || [];

//                 setCombinedData(data);
//             } catch (error) {
//                 console.error('Error loading data:', error);
//                 setCombinedData([]);
//             }
//         };
//         loadData();
//     }, [getAllSetorTeh, getAllChop, getPucukTehById, getFarmerById]);

//     const handleManualScan = (e) => {
//         e.preventDefault();
//         handleScan(scanInput);
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex items-center gap-3 mb-8">
//                     <QrCode className="w-8 h-8 text-blue-600" />
//                     <h1 className="text-2xl font-bold text-gray-800">Scan QRIS System</h1>
//                 </div>

//                 {/* Search Section */}
//                 <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//                     <form onSubmit={handleManualScan} className="relative">
//                         <div className="flex gap-4">
//                             <div className="relative flex-1">
//                                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                 <input
//                                     type="text"
//                                     value={scanInput}
//                                     onChange={(e) => setScanInput(e.target.value)}
//                                     placeholder="Enter Transaction ID"
//                                     className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                                 />
//                             </div>
//                             <button type="submit" className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md">
//                                 <Search className="w-5 h-5" />
//                                 <span>Scan ID</span>
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//                 {/* QR Code Section */}
//                 <div className="grid md:grid-cols-2 gap-8 mb-8">
//                     <div className="bg-white rounded-2xl shadow-lg p-8">
//                         <div className="flex flex-col items-center">
//                             <div id="qr-canvas" className="bg-gray-50 p-8 rounded-2xl mb-6">
//                                 {qrCodeData ? (
//                                     <QRCodeCanvas
//                                         id="qr-code"
//                                         value={JSON.stringify(qrCodeData)}
//                                         size={256}
//                                         bgColor="#ffffff"
//                                         fgColor="#000000"
//                                         level="H"
//                                         includeMargin={true}
//                                         renderAs="canvas"
//                                     />
//                                 ) : (
//                                     <div className="flex items-center justify-center h-64 w-64 bg-gray-100 rounded-lg">
//                                         <p className="text-gray-500 text-center">Enter an ID to generate QR Code</p>
//                                     </div>
//                                 )}
//                             </div>
//                             {qrCodeData && (
//                                 <button
//                                     onClick={downloadQRCode}
//                                     className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
//                                 >
//                                     <Download className="w-5 h-5" />
//                                     <span>Download QR Code PDF</span>
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
//                         <h3 className="text-xl font-semibold mb-6">Quick Guide</h3>
//                         <ul className="space-y-4">
//                             <li className="flex items-start gap-3">
//                                 <QrCode className="w-6 h-6 mt-1" />
//                                 <p>Scan QR code untuk melihat data Penyetoran dan Quality Control</p>
//                             </li>
//                             <li className="flex items-start gap-3">
//                                 <Search className="w-6 h-6 mt-1" />
//                                 <p>Masukkan ID transaksi secara manual untuk mengambil catatan tertentu</p>
//                             </li>
//                             <li className="flex items-start gap-3">
//                                 <Download className="w-6 h-6 mt-1" />
//                                 <p>Download QR code dan detail transaksi dalam format PDF</p>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Scanned Data Results */}
//                 {scannedData && (
//                     <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
//                         <div className="p-6 border-b border-gray-100">
//                             <h3 className="text-xl font-semibold text-gray-800">Scan Results</h3>
//                         </div>

//                         {scannedData.error ? (
//                             <div className="p-6">
//                                 <div className="bg-red-50 text-red-700 p-4 rounded-xl">
//                                     <p className="font-medium">{scannedData.error}</p>
//                                     <p className="text-sm mt-2 text-red-600">{scannedData.details}</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="grid md:grid-cols-2 gap-6 p-6">
//                                 {/* Transaction Info */}
//                                 <div className="bg-gray-50 rounded-xl p-6">
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <QrCode className="w-6 h-6 text-blue-600" />
//                                         <h4 className="text-lg font-semibold">Transaction Details</h4>
//                                     </div>
//                                     <div className="space-y-3">
//                                         <p><span className="text-gray-600">ID:</span> {scannedData.id}</p>
//                                         <p><span className="text-gray-600">Date:</span> {`${scannedData.hari}/${scannedData.bulan}/${scannedData.tahun}`}</p>
//                                         <p><span className="text-gray-600">Amount:</span> {scannedData.jumlahSetor} kg</p>
//                                     </div>
//                                 </div>

//                                 {/* Farmer Info */}
//                                 <div className="bg-gray-50 rounded-xl p-6">
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <User className="w-6 h-6 text-green-600" />
//                                         <h4 className="text-lg font-semibold">Farmer Information</h4>
//                                     </div>
//                                     <div className="space-y-3">
//                                         <p><span className="text-gray-600">Name:</span> {scannedData.farmerData?.name || '-'}</p>
//                                         <p><span className="text-gray-600">Address:</span> {scannedData.farmerData?.farmerAddress || '-'}</p>
//                                         <p><span className="text-gray-600">ID:</span> {scannedData.idPetani}</p>
//                                     </div>
//                                 </div>

//                                 {/* Tea Info */}
//                                 <div className="bg-gray-50 rounded-xl p-6">
//                                     <div className="flex items-center gap-3 mb-4">
//                                         <Leaf className="w-6 h-6 text-green-600" />
//                                         <h4 className="text-lg font-semibold">Tea Information</h4>
//                                     </div>
//                                     <div className="space-y-3">
//                                         <p><span className="text-gray-600">Location:</span> {scannedData.pucukTehData?.koordinat_kebun || '-'}</p>
//                                         <p><span className="text-gray-600">Variety:</span> {scannedData.pucukTehData?.varietas_teh || '-'}</p>
//                                         <p><span className="text-gray-600">Amount:</span> {scannedData.pucukTehData?.jumlah_setor || '-'}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Data Table */}
//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                     <div className="p-6 border-b border-gray-100">
//                         <h3 className="text-xl font-semibold text-gray-800">Stored QR Code Data</h3>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead>
//                                 <tr className="bg-gray-50">
//                                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Transaction ID</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount (kg)</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">QC Date</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Farmer ID</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {combinedData.map((item, index) => (
//                                     <tr key={`${item.id}-${index}`} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
//                                         <td className="px-6 py-4">{item.id}</td>
//                                         <td className="px-6 py-4">{`${item.hari}/${item.bulan}/${item.tahun}`}</td>
//                                         <td className="px-6 py-4">{item.jumlahSetor}</td>
//                                         <td className="px-6 py-4">{item.chopData?.tanggal_chop || '-'}</td>
//                                         <td className="px-6 py-4">{item.idPetani}</td>
//                                         <td className="px-6 py-4">
//                                             <button
//                                                 onClick={() => handleScan(item.id)}
//                                                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
//                                             >
//                                                 <QrCode className="w-4 h-4" />
//                                                 <span>Generate QR</span>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ScanQris;