import { useState, useCallback, useEffect } from 'react';
import { useEthers } from './useEthers';
import { useFarmers } from './useFarmers';
import { ethers } from 'ethers';
import { EXPECTED_CHAIN_ID } from '../utils/constants';

export function usePucukTeh() {
    const [pucukTehList, setPucukTehList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { contract, setErrorMessage } = useEthers();
    const { registeredFarmers, refreshFarmers } = useFarmers();
    const [lastPucukTehId, setLastPucukTehId] = useState(1);

    const loadPucukTeh = useCallback(async () => {
        if (!contract || !contract.pucukTeh) {
            console.error("PucukTeh contract is not initialized");
            setErrorMessage("PucukTeh contract not initialized. Please check your connection.");
            return;
        }
        console.log("PucukTeh Contract methods:", Object.keys(contract.pucukTeh.functions));
        try {
            console.log("Attempting to load Pucuk Teh data...");
            const data = await contract.pucukTeh.getAllPucukTeh();
            console.log("Received Pucuk Teh data:", data);
            const formattedData = data.map(pucuk => ({
                id_teh: pucuk.id_teh.toString(),
                koordinat_kebun: pucuk.koordinat_kebun,
                varietas_teh: pucuk.varietas_teh,
                jumlah_setor: pucuk.jumlah_setor.toString(),
                id_petani: pucuk.id_petani.toString()
            }));
            setPucukTehList(formattedData);
            if (formattedData.length > 0) {
                const maxId = Math.max(...formattedData.map(item => parseInt(item.id_teh)));
                setLastPucukTehId(maxId + 2); // Tambahkan 2 untuk ID berikutnya
            } else {
                setLastPucukTehId(1);
            }
        } catch (error) {
            console.error("Detailed error in loadPucukTeh:", error);
            setErrorMessage(`Failed to load Pucuk Teh: ${error.message}`);
        }
    }, [contract, setErrorMessage]);

    const addPucukTeh = async (koordinat, varietas, jumlah, idPetani) => {
        if (!koordinat.trim() || !varietas.trim() || !jumlah || !idPetani) {
            setErrorMessage("Semua field harus diisi");
            return;
        }
        if (!contract || !contract.pucukTeh) {
            setErrorMessage("PucukTeh contract not initialized. Please check your connection.");
            return;
        }
        setIsLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractWithSigner = contract.pucukTeh.connect(signer);

            const network = await provider.getNetwork();
            if (network.chainId !== EXPECTED_CHAIN_ID) {
                throw new Error(`Please connect to the correct network. Expected chainId: ${EXPECTED_CHAIN_ID}, Got: ${network.chainId}`);
            }

            console.log("Attempting to add Pucuk Teh:", koordinat, varietas, jumlah, idPetani);
            const transaction = await contractWithSigner.addPucukTeh(koordinat, varietas, jumlah, idPetani);
            console.log("Transaction sent:", transaction.hash);
            const receipt = await transaction.wait();
            console.log("Transaction confirmed in block:", receipt.blockNumber);

            await loadPucukTeh();
            setErrorMessage('');
        } catch (error) {
            console.error("Detailed error:", error);
            setErrorMessage(`Failed to add Pucuk Teh: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshPucukTeh = useCallback(async () => {
        if (contract && contract.pucukTeh) {
            setIsLoading(true);
            await loadPucukTeh();
            setIsLoading(false);
        }
    }, [contract, loadPucukTeh]);

    useEffect(() => {
        if (contract && contract.pucukTeh) {
            console.log("PucukTeh Contract methods in useEffect:", Object.keys(contract.pucukTeh.functions));
            refreshPucukTeh();
            refreshFarmers();
        }
    }, [contract, refreshPucukTeh, refreshFarmers]);

    return { pucukTehList, isLoading, addPucukTeh, refreshPucukTeh, registeredFarmers, lastPucukTehId };
}