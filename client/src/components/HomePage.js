import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../images/hero2.png';

function HomePage() {
    return (
        <div className="h-[94vh] flex flex-col overflow-hidden">
            <motion.div
                className="bg-gradient-to-r from-[#1B2F1B] to-[#356E35] py-6 w-full -ml-[1px] rounded-t-lg"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-5xl font-bold text-white pl-5 m-0">
                    GAMBOENG
                </h1>
            </motion.div>

            <div
                className="flex-grow flex flex-col justify-center items-center mt-3 mb-[0.5px] -ml-[1px] mr-[1px] rounded-b-lg p-5 bg-gradient-to-b from-[#274927] to-[#3e8f3e]"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay'
                }}
            >
                <motion.div
                    className="p-5 rounded-lg"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.h2
                        className="text-7xl text-white m-0 italic drop-shadow-lg"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        WELCOME
                    </motion.h2>
                    <motion.h3
                        className="text-4xl text-white m-0 text-center drop-shadow-lg"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        to SCM Green Tea
                    </motion.h3>
                </motion.div>
            </div>
        </div>
    );
}

export default HomePage;
