import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, CheckSquare, QrCode, ChevronDown } from 'lucide-react';

function Sidebar() {
    const [expandedItem, setExpandedItem] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        console.log("Public URL:", process.env.PUBLIC_URL);
    }, []);

    const toggleExpand = (item) => {
        setExpandedItem(expandedItem === item ? null : item);
    };

    const handleImageError = () => {
        console.error("Error loading image");
        setImageError(true);
    };

    return (
        <div className=" bottom-7 top-6 bg-gradient-to-b from-[#1B2F1B] to-[#356E35] text-white w-60 fixed shadow-lg rounded-r-lg">
            <div className="pt-4 flex flex-col items-center border-b border-gray-600">
                {!imageError ? (
                    <img
                        src={`${process.env.PUBLIC_URL}/images/h2.png`}
                        alt="Logo"
                        className="h-20 w-20 object-contain mb-4 rounded-full shadow-md"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="text-center text-sm text-gray-300">Image failed to load</div>
                )}
            </div>

            <div className="py-6">
                <Link to="/home-page" className="flex items-center px-8 py-4 text-gray-100 hover:bg-[#274927] transition-colors duration-300 rounded-lg mb-2 shadow-sm">
                    <LayoutDashboard className="mr-4 text-xl" />Dashboard
                </Link>
                <div className="mb-4">
                    <div className={`flex items-center justify-between px-8 py-4 cursor-pointer hover:bg-[#274927] transition-colors duration-300 rounded-lg shadow-sm ${expandedItem === 'Penyetoran' ? 'bg-[#274927]' : ''}`} onClick={() => toggleExpand('Penyetoran')}>
                        <span className="flex items-center"><Package className="mr-4 text-xl" />Penyetoran</span>
                        <ChevronDown className={`transition-transform duration-300 ${expandedItem === 'Penyetoran' ? 'rotate-180' : ''}`} />
                    </div>
                    {expandedItem === 'Penyetoran' && (
                        <div className="bg-[#274927] py-3 rounded-lg mt-2">
                            <Link to="/farmer-registry" className="block px-16 py-3 text-gray-300 hover:text-white hover:bg-[#356E35] transition-colors duration-300 rounded-md mb-2 shadow-sm">Petani</Link>
                            <Link to="/pucuk-teh" className="block px-16 py-3 text-gray-300 hover:text-white hover:bg-[#356E35] transition-colors duration-300 rounded-md mb-2 shadow-sm">Pucuk Teh</Link>
                            <Link to="/setor-teh" className="block px-16 py-3 text-gray-300 hover:text-white hover:bg-[#356E35] transition-colors duration-300 rounded-md shadow-sm">Setor Teh</Link>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <div className={`flex items-center justify-between px-8 py-4 cursor-pointer hover:bg-[#274927] transition-colors duration-300 rounded-lg shadow-sm ${expandedItem === 'QC' ? 'bg-[#274927]' : ''}`} onClick={() => toggleExpand('QC')}>
                        <span className="flex items-center"><CheckSquare className="mr-4 text-xl" />Quality Control</span>
                        <ChevronDown className={`transition-transform duration-300 ${expandedItem === 'QC' ? 'rotate-180' : ''}`} />
                    </div>
                    {expandedItem === 'QC' && (
                        <div className="bg-[#274927] py-3 rounded-lg mt-2">
                            <Link to="/chop" className="block px-16 py-3 text-gray-300 hover:text-white hover:bg-[#356E35] transition-colors duration-300 rounded-md shadow-sm">Chop</Link>
                        </div>
                    )}
                </div>
                <Link to="/scan-qris" className="flex items-center px-8 py-4 text-gray-100 hover:bg-[#274927] transition-colors duration-300 rounded-lg shadow-sm">
                    <QrCode className="mr-4 text-xl" />Scan QRIS
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
