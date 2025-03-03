import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import {
    contractABI,
    PucukTehABI,
    SetorTehABI,
    ChopABI,
    contractAddress,
    pucukTehAddress,
    setorTehAddress,
    ChopAddress,
} from '../utils/contractConfig';
import { EXPECTED_CHAIN_ID } from '../utils/constants';

const WALLET_CONNECTED_KEY = 'walletConnected';

export function useEthers() {
    const [contract, setContract] = useState({
        farmerRegistry: null,
        pucukTeh: null,
        setorTeh: null,
        chop: null,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const initializeContract = async (address, abi, name, signer) => {
        try {
            console.log(`Initializing ${name} contract...`);
            console.log(`${name} address:`, address);
            console.log(`${name} ABI:`, abi);
            const contractInstance = new ethers.Contract(address, abi, signer);
            console.log(`${name} contract initialized:`, contractInstance.address);
            return contractInstance;
        } catch (error) {
            console.error(`Failed to initialize ${name} contract:`, error);
            if (error.message.includes("invalid address")) {
                setErrorMessage(`Invalid address for ${name} contract. Please check the contract address.`);
            } else if (error.message.includes("invalid argument")) {
                setErrorMessage(`Invalid ABI for ${name} contract. Please check the ABI.`);
            } else {
                setErrorMessage(`Failed to initialize ${name} contract: ${error.message}`);
            }
            return null;
        }
    };

    // Improved gas estimation function
    const estimateGas = async (contractInstance, methodName, args) => {
        try {
            if (!contractInstance || !contractInstance[methodName]) {
                throw new Error(`Method ${methodName} not found on contract`);
            }

            // Estimate gas for the method
            const gasEstimate = await contractInstance.estimateGas[methodName](...args);

            // Add 20% buffer for safety
            const gasLimit = gasEstimate.mul(120).div(100);

            console.log(`Gas estimation for ${methodName}:`, gasLimit.toString());
            return gasLimit;
        } catch (error) {
            console.error("Gas estimation failed:", error);
            // Return default gas limit if estimation fails
            return ethers.BigNumber.from("300000");
        }
    };

    const setupEventListeners = (contractInstance) => {
        if (contractInstance.filters.SetorTehAdded) {
            contractInstance.on("SetorTehAdded", (id, idPetani, bulan, hari, tahun, jumlahSetor) => {
                console.log("New SetorTeh added:", { id, idPetani, bulan, hari, tahun, jumlahSetor });
            });
        }
    };

    const addSetorTeh = async (idPetani, bulan, hari, tahun, jumlahSetor) => {
        if (!contract.setorTeh) {
            throw new Error("SetorTeh contract not initialized");
        }
        try {
            const gasLimit = await estimateGas(
                contract.setorTeh,
                'addSetorTeh',
                [idPetani, bulan, hari, tahun, jumlahSetor]
            );

            const tx = await contract.setorTeh.addSetorTeh(
                idPetani, bulan, hari, tahun, jumlahSetor,
                { gasLimit }
            );
            await tx.wait();
            return tx;
        } catch (error) {
            console.error("Error in addSetorTeh:", error);
            throw error;
        }
    };

    const addChop = async (tanggal) => {
        if (!contract.chop) {
            throw new Error("Chop contract not initialized");
        }
        try {
            const gasLimit = await estimateGas(
                contract.chop,
                'addChop',
                [tanggal]
            );

            const tx = await contract.chop.addChop(
                tanggal,
                { gasLimit }
            );
            const receipt = await tx.wait();

            // Get the ChopAdded event from the transaction receipt
            const event = receipt.events?.find(event => event.event === 'ChopAdded');
            if (event) {
                return event.args.id_chop.toNumber();
            }

            // Fallback: get the next ID minus 1
            const nextId = await contract.chop.getNextId();
            return nextId.sub(1).toNumber();
        } catch (error) {
            console.error("Error in addChop:", error);
            throw error;
        }
    };


    const initEthers = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                console.log("Initializing Ethers...");
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();

                if (accounts.length === 0) {
                    throw new Error("No authorized account found. Please connect your wallet.");
                }

                const network = await provider.getNetwork();
                console.log("Connected to network:", network);

                if (network.chainId !== EXPECTED_CHAIN_ID) {
                    throw new Error(`Network mismatch. Please switch to the correct network. Expected chainId: ${EXPECTED_CHAIN_ID}, Current: ${network.chainId}`);
                }

                const signer = provider.getSigner();
                console.log("Signer address:", await signer.getAddress());

                const farmerContract = await initializeContract(contractAddress, contractABI, "FarmerRegistry", signer);
                const pucukTehContract = await initializeContract(pucukTehAddress, PucukTehABI, "PucukTeh", signer);
                const setorTehContract = await initializeContract(setorTehAddress, SetorTehABI, "SetorTeh", signer);
                const chopContract = await initializeContract(ChopAddress, ChopABI, "Chop", signer);

                if (farmerContract && pucukTehContract && setorTehContract && chopContract) {
                    setContract({
                        farmerRegistry: farmerContract,
                        pucukTeh: pucukTehContract,
                        setorTeh: setorTehContract,
                        chop: chopContract,
                    });
                    setIsConnected(true);
                    localStorage.setItem(WALLET_CONNECTED_KEY, 'true');
                    console.log("Ethers initialization complete");

                    // Log contract methods
                    if (setorTehContract.addSetorTeh) {
                        console.log("addSetorTeh function exists in the contract");
                    }

                    if (chopContract) {
                        console.log("Chop contract methods:", Object.keys(chopContract.functions));
                    }

                    setupEventListeners(setorTehContract);
                } else {
                    throw new Error("Failed to initialize one or more contracts");
                }
            } catch (error) {
                console.error("Error in initEthers:", error);
                setErrorMessage(`Initialization failed: ${error.message}`);
                setIsConnected(false);
                localStorage.removeItem(WALLET_CONNECTED_KEY);
            }
        } else {
            setErrorMessage("Ethereum provider not detected. Please install MetaMask.");
        }
    }, []);

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                console.log("Connecting wallet...");
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                await initEthers();
            } catch (error) {
                console.error("Wallet connection failed:", error);
                setErrorMessage(`Wallet connection failed: ${error.message}`);
                localStorage.removeItem(WALLET_CONNECTED_KEY);
            }
        } else {
            setErrorMessage("Ethereum provider not detected. Please install MetaMask.");
        }
    }, [initEthers]);

    useEffect(() => {
        const checkConnection = async () => {
            if (localStorage.getItem(WALLET_CONNECTED_KEY) === 'true') {
                console.log("Restoring previous wallet connection...");
                await initEthers();
            }
        };

        checkConnection();

        const handleAccountsChanged = (accounts) => {
            console.log("Accounts changed:", accounts);
            if (accounts.length === 0) {
                setIsConnected(false);
                localStorage.removeItem(WALLET_CONNECTED_KEY);
                setErrorMessage("Wallet disconnected. Please reconnect.");
            } else {
                initEthers();
            }
        };

        const handleChainChanged = (chainId) => {
            console.log("Chain changed to:", chainId);
            window.location.reload();
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [initEthers]);

    return {
        contract,
        errorMessage,
        isConnected,
        connectWallet,
        setErrorMessage,
        addSetorTeh,
        addChop,
    };
}