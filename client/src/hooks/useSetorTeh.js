import { useState, useCallback, useEffect } from 'react';
import { useEthers } from './useEthers';
import { ethers } from 'ethers';
import { EXPECTED_CHAIN_ID } from '../utils/constants';

export function useSetorTeh() {
    const [setorTehList, setSetorTehList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { contract, setErrorMessage } = useEthers();
    const [isContractReady, setIsContractReady] = useState(false);

    useEffect(() => {
        if (contract && contract.setorTeh) {
            setIsContractReady(true);
            setIsLoading(false);
        } else {
            setIsContractReady(false);
            setIsLoading(true);
        }
    }, [contract]);

    const loadSetorTeh = useCallback(async () => {
        if (!isContractReady) {
            console.log("SetorTeh contract is not ready yet");
            return [];
        }
        try {
            console.log("Attempting to load Setor Teh data...");
            const data = await contract.setorTeh.getAllSetorTeh();
            console.log("Received Setor Teh data:", data);
            return Array.isArray(data) ? data.map(setor => ({
                id: setor?.id?.toString() || 'N/A',
                idPetani: setor?.idPetani?.toString() || 'N/A',
                bulan: setor?.bulan || 0,
                hari: setor?.hari || 0,
                tahun: setor?.tahun || 0,
                jumlahSetor: setor?.jumlahSetor?.toString() || '0'
            })) : [];
        } catch (error) {
            console.error("Detailed error in loadSetorTeh:", error);
            setErrorMessage(`Failed to load Setor Teh: ${error.message}`);
            return [];
        }
    }, [contract, setErrorMessage, isContractReady]);

    const getNextId = useCallback(async () => {
        if (!isContractReady) {
            return '1';
        }
        try {
            const data = await loadSetorTeh();
            if (!Array.isArray(data) || data.length === 0) {
                return '1';
            }
            const currentIds = data.map(item => parseInt(item.id));
            const maxId = Math.max(...currentIds);
            return (maxId + 1).toString();
        } catch (error) {
            console.error("Error getting next ID:", error);
            return '1';
        }
    }, [isContractReady, loadSetorTeh]);

    const addSetorTeh = async (idPetani, bulan, hari, tahun, jumlahSetor) => {
        console.log("addSetorTeh called with parameters:", { idPetani, bulan, hari, tahun, jumlahSetor });

        if (!isContractReady) {
            console.error("Contract not ready");
            setErrorMessage("SetorTeh contract is not ready yet. Please wait or refresh the page.");
            return;
        }

        if (typeof window.ethereum === 'undefined') {
            console.error("MetaMask not installed");
            setErrorMessage("MetaMask is not installed. Please install MetaMask and try again.");
            return;
        }

        if (!idPetani || !bulan || !hari || !tahun || !jumlahSetor) {
            console.error("Missing fields");
            setErrorMessage("Semua field harus diisi");
            return;
        }

        if (isNaN(parseInt(idPetani)) || isNaN(parseInt(bulan)) || isNaN(parseInt(hari)) || isNaN(parseInt(tahun)) || isNaN(parseInt(jumlahSetor))) {
            console.error("Invalid number input");
            setErrorMessage("Semua field harus berupa angka");
            return;
        }

        const idPetaniInt = Math.floor(Number(idPetani));
        const bulanInt = Math.floor(Number(bulan));
        const hariInt = Math.floor(Number(hari));
        const tahunInt = Math.floor(Number(tahun));
        const jumlahSetorInt = Math.floor(Number(jumlahSetor));

        console.log("Processed inputs:", { idPetaniInt, bulanInt, hariInt, tahunInt, jumlahSetorInt });

        setIsLoading(true);
        const MAX_RETRIES = 3;
        let retries = 0;

        while (retries < MAX_RETRIES) {
            try {
                console.log("Attempt", retries + 1);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contractWithSigner = contract.setorTeh.connect(signer);

                const network = await provider.getNetwork();
                console.log("Current network:", network);
                if (network.chainId !== EXPECTED_CHAIN_ID) {
                    throw new Error(`Please connect to the correct network. Expected chainId: ${EXPECTED_CHAIN_ID}, Got: ${network.chainId}`);
                }

                console.log("Estimating gas...");
                const estimatedGas = await contractWithSigner.estimateGas.addSetorTeh(idPetaniInt, bulanInt, hariInt, tahunInt, jumlahSetorInt);
                console.log("Estimated gas:", estimatedGas.toString());

                console.log("Sending transaction...");
                const transaction = await contractWithSigner.addSetorTeh(
                    idPetaniInt,
                    bulanInt,
                    hariInt,
                    tahunInt,
                    jumlahSetorInt,
                    {
                        gasLimit: estimatedGas.mul(120).div(100)
                    }
                );

                console.log("Transaction sent:", transaction.hash);
                const receipt = await transaction.wait();
                console.log("Transaction confirmed in block:", receipt.blockNumber);

                setErrorMessage('');
                break;
            } catch (error) {
                console.error("Detailed error:", error);
                retries++;
                if (retries === MAX_RETRIES) {
                    let errorMessage = `Failed to add Setor Teh: ${error.message}`;
                    if (error.code === 'INTERNAL_ERROR') {
                        errorMessage = 'An internal error occurred. Please try again or check your MetaMask connection.';
                    } else if (error.code === 'NETWORK_ERROR') {
                        errorMessage = 'Network error. Please check your internet connection and try again.';
                    } else if (error.message.includes('user rejected transaction')) {
                        errorMessage = 'Transaction was rejected. Please try again and confirm the transaction in MetaMask.';
                    }
                    setErrorMessage(errorMessage);
                } else {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }
        setIsLoading(false);
    };

    const refreshSetorTeh = useCallback(async () => {
        if (isContractReady) {
            setIsLoading(true);
            try {
                const data = await loadSetorTeh();
                setSetorTehList(data);
            } catch (error) {
                console.error("Error refreshing Setor Teh:", error);
                setErrorMessage(`Failed to refresh Setor Teh: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    }, [isContractReady, loadSetorTeh, setErrorMessage]);

    useEffect(() => {
        if (isContractReady) {
            refreshSetorTeh();
        }
    }, [isContractReady, refreshSetorTeh]);

    return {
        setorTehList,
        isLoading,
        addSetorTeh,
        refreshSetorTeh,
        getAllSetorTeh: loadSetorTeh,
        getNextId
    };
}