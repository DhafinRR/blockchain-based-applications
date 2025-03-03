import { useState, useCallback, useEffect } from 'react';
import { useEthers } from './useEthers';
import { ethers } from 'ethers';
import { EXPECTED_CHAIN_ID } from '../utils/constants';

export function useFarmers() {
    const [registeredFarmers, setRegisteredFarmers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [farmerRegisteredEvents, setFarmerRegisteredEvents] = useState([]);
    const { contract, setErrorMessage } = useEthers();

    const loadFarmers = useCallback(async () => {
        if (!contract || !contract.farmerRegistry) {
            console.error("FarmerRegistry contract not initialized");
            return;
        }
        setIsLoading(true);
        try {
            console.log("Attempting to load farmers data...");
            const data = await contract.farmerRegistry.getFarmers();
            console.log("Received farmers data:", data);
            const formattedData = data.map(farmer => ({
                id: farmer.id,
                name: farmer.name,
                farmerAddress: farmer.farmerAddress
            }));
            setRegisteredFarmers(formattedData);
        } catch (error) {
            console.error("Detailed error in loadFarmers:", error);
            setErrorMessage(`Failed to load farmers: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [contract, setErrorMessage]);

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
        if (contract && contract.farmerRegistry) {
            const farmerRegisteredFilter = contract.farmerRegistry.filters.FarmerRegistered();
            const listener = (id, name, farmerAddress) => {
                setFarmerRegisteredEvents(prev => [...prev, { id, name, farmerAddress }]);
            };
            contract.farmerRegistry.on(farmerRegisteredFilter, listener);

            return () => {
                contract.farmerRegistry.off(farmerRegisteredFilter, listener);
            };
        }
    }, [contract]);

    const registerFarmer = async (farmerId, farmerName, farmerAddress, gasOption) => {
        if (!farmerId.trim() || !farmerName.trim() || !farmerAddress.trim()) {
            setErrorMessage("Semua field harus diisi");
            return;
        }
        if (!contract || !contract.farmerRegistry) {
            setErrorMessage("FarmerRegistry contract not initialized. Please check your connection.");
            return;
        }
        setIsLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            if (network.chainId !== EXPECTED_CHAIN_ID) {
                throw new Error(`Please connect to the correct network. Expected chainId: ${EXPECTED_CHAIN_ID}, Got: ${network.chainId}`);
            }

            console.log("Attempting to register farmer:", farmerName, farmerId, farmerAddress);
            const gasEstimate = await contract.farmerRegistry.estimateGas.registerFarmer(farmerId, farmerName, farmerAddress);
            console.log("Estimated gas:", gasEstimate.toString());

            const gasLimit = await getGasLimit(gasEstimate, gasOption);
            const maxGasLimit = ethers.BigNumber.from(300000);
            const finalGasLimit = gasLimit.lt(maxGasLimit) ? gasLimit : maxGasLimit;

            const transaction = await contract.farmerRegistry.registerFarmer(farmerId, farmerName, farmerAddress, {
                gasLimit: finalGasLimit
            });
            console.log("Transaction sent:", transaction.hash);
            const receipt = await transaction.wait();
            console.log("Transaction confirmed in block:", receipt.blockNumber);

            await loadFarmers();
            setErrorMessage('');
        } catch (error) {
            console.error("Detailed error:", error);
            setErrorMessage(`Failed to register farmer: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshFarmers = useCallback(async () => {
        if (contract && contract.farmerRegistry) {
            setIsLoading(true);
            try {
                await loadFarmers();
            } catch (error) {
                console.error("Error refreshing farmers:", error);
                setErrorMessage(`Failed to refresh farmers: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    }, [contract, loadFarmers, setErrorMessage]);

    const getFarmerCount = useCallback(async () => {
        if (!contract || !contract.farmerRegistry) return '0';
        try {
            const count = await contract.farmerRegistry.getFarmerCount();
            return count.toString();
        } catch (error) {
            console.error("Error getting farmer count:", error);
            return '0';
        }
    }, [contract]);

    useEffect(() => {
        if (contract && contract.farmerRegistry) {
            refreshFarmers();
        }
    }, [contract, refreshFarmers]);

    return {
        registeredFarmers,
        isLoading,
        registerFarmer,
        refreshFarmers,
        farmerRegisteredEvents,
        getFarmerCount,
        farmersList: registeredFarmers
    };
}