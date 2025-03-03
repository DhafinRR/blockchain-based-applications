import { useState, useCallback, useEffect } from 'react';
import { useEthers } from './useEthers';
import { ethers } from 'ethers';
import { EXPECTED_CHAIN_ID } from '../utils/constants';

export function useChop() {
    const [registeredChops, setRegisteredChops] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { contract, setErrorMessage, isConnected, connectWallet } = useEthers();

    const checkContractInitialization = useCallback(() => {
        if (!contract || !contract.chop) {
            setErrorMessage("Chop contract not found. Please check your connection and contract configuration.");
            return false;
        }
        return true;
    }, [contract, setErrorMessage]);

    const getAllChop = useCallback(async () => {
        if (!checkContractInitialization()) return [];

        try {
            const data = await contract.chop.getAllChop();
            return data;
        } catch (error) {
            console.error("Error fetching all chops:", error);
            return [];
        }
    }, [contract, checkContractInitialization]);

    const getChopCount = useCallback(async () => {
        if (!checkContractInitialization()) return '1';
        try {
            const count = await contract.chop.getCountChop();
            return count.toString();
        } catch (error) {
            console.error("Error getting chop count:", error);
            return '1';
        }
    }, [contract, checkContractInitialization]);

    const loadChops = useCallback(async () => {
        if (!checkContractInitialization()) return [];

        try {
            const data = await contract.chop.getAllChop();
            const formattedData = data.map(chop => ({
                id_chop: chop.id_chop.toString(),
                tanggal_chop: chop.tanggal_chop
            }));

            setRegisteredChops(formattedData);
            return formattedData;
        } catch (error) {
            console.error("Detailed error in loadChops:", error);
            setErrorMessage(`Failed to load chops: ${error.message}`);
            return [];
        }
    }, [contract, setErrorMessage, checkContractInitialization]);

    const addChop = async (tanggal, gasOption = 'market') => {
        if (!isConnected) {
            const errorMsg = "Wallet not connected. Please connect your wallet first.";
            setErrorMessage(errorMsg);
            await connectWallet();
            return false;
        }

        if (!tanggal) {
            const errorMsg = "Tanggal chop harus diisi";
            setErrorMessage(errorMsg);
            return false;
        }

        if (!checkContractInitialization()) return false;

        setIsLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            if (network.chainId !== EXPECTED_CHAIN_ID) {
                throw new Error(`Please connect to the correct network. Expected chainId: ${EXPECTED_CHAIN_ID}, Got: ${network.chainId}`);
            }

            const gasEstimate = await contract.chop.estimateGas.addChop(tanggal);
            const gasLimit = await getGasLimit(gasEstimate, gasOption);

            const transaction = await contract.chop.addChop(tanggal, { gasLimit });
            await transaction.wait();

            await loadChops();
            return true;
        } catch (error) {
            console.error("Detailed error in addChop:", error);
            setErrorMessage(`Failed to add chop: ${error.message}`);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const getGasLimit = useCallback(async (estimatedGas, gasOption) => {
        switch (gasOption) {
            case 'low':
                return estimatedGas.mul(105).div(100);
            case 'market':
                return estimatedGas.mul(110).div(100);
            case 'aggressive':
                return estimatedGas.mul(120).div(100);
            case 'advanced':
                return estimatedGas.mul(150).div(100);
            default:
                return estimatedGas.mul(110).div(100);
        }
    }, []);

    useEffect(() => {
        if (isConnected && contract && contract.chop) {
            loadChops();
        }
    }, [isConnected, contract, loadChops]);

    return {
        registeredChops,
        isLoading,
        addChop,
        getChopCount, // Pastikan ini ada
        getAllChop,
        checkContractInitialization,
        loadChops
    };
}
