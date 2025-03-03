export const contractAddress = "0x19922C1093277b445bBbf9c5daeE2beF8dc65F2F"
export const pucukTehAddress = "0xA37591dEB1bc473984Dd3bE81bc9953584a85A04"
export const setorTehAddress = "0x97cAa8d3B3d53C9ef90cF459d2091D8E176bdA60"
export const ChopAddress = "0x0F7b4Fb107E32b454cef101eD877F172A664a845"


export const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "id",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "farmerAddress",
                "type": "string"
            }
        ],
        "name": "FarmerRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "id",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "farmerAddress",
                "type": "string"
            }
        ],
        "name": "FarmerUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "farmerIds",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "farmers",
        "outputs": [
            {
                "internalType": "string",
                "name": "id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "farmerAddress",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_address",
                "type": "string"
            }
        ],
        "name": "registerFarmer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_address",
                "type": "string"
            }
        ],
        "name": "updateFarmer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_id",
                "type": "string"
            }
        ],
        "name": "getFarmer",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getFarmers",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "id",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "farmerAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRegistered",
                        "type": "bool"
                    }
                ],
                "internalType": "struct FarmerRegistry.Farmer[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getFarmerCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]


export const PucukTehABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ListPucukTeh",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id_teh",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "koordinat_kebun",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "varietas_teh",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "jumlah_setor",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "id_petani",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_koordinat",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_varietas",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_jumlah",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_id_petani",
                "type": "uint256"
            }
        ],
        "name": "addPucukTeh",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_koordinat",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_varietas",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_jumlah",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_id_petani",
                "type": "uint256"
            }
        ],
        "name": "updatePucukTeh",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllPucukTeh",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id_teh",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "koordinat_kebun",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "varietas_teh",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "jumlah_setor",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "id_petani",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct PucukTeh.Pucuk[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_idPucuk",
                "type": "uint256"
            }
        ],
        "name": "getDataPucukTeh",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getCountPucukTeh",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]


export const SetorTehABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "listSetorTeh",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "idPetani",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "bulan",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "hari",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "tahun",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "jumlahSetor",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "nextId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_idPetani",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "_bulan",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_hari",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "_tahun",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_jumlahSetor",
                "type": "uint256"
            }
        ],
        "name": "addSetorTeh",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_idPetani",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "_bulan",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "_hari",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "_tahun",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "_jumlahSetor",
                "type": "uint256"
            }
        ],
        "name": "updateSetorTeh",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllSetorTeh",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "idPetani",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "bulan",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "hari",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint16",
                        "name": "tahun",
                        "type": "uint16"
                    },
                    {
                        "internalType": "uint256",
                        "name": "jumlahSetor",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct SetorTeh.Setor[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getDataSetorTeh",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            },
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getCountSetorTeh",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]




export const ChopABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id_chop",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tanggal_chop",
                "type": "string"
            }
        ],
        "name": "ChopAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id_chop",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tanggal_chop",
                "type": "string"
            }
        ],
        "name": "ChopUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_tanggal",
                "type": "string"
            }
        ],
        "name": "addChop",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_tanggal",
                "type": "string"
            }
        ],
        "name": "updateChop",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getChop",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id_chop",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "tanggal_chop",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "exists",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Chop.Chopper",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getAllChop",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id_chop",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "tanggal_chop",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "exists",
                        "type": "bool"
                    }
                ],
                "internalType": "struct Chop.Chopper[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getCountChop",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "getNextId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "isValidChop",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
]
