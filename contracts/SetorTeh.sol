// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SetorTeh {
    address public owner;

    struct Setor {
        uint id;
        uint idPetani; // Tambahkan field idPetani
        uint8 bulan;
        uint8 hari;
        uint16 tahun;
        uint jumlahSetor;
    }

    Setor[] public listSetorTeh;
    uint public nextId = 1;

    modifier onlyOwner() {
        require(msg.sender == owner, "Hanya owner yang dapat menggunakan");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addSetorTeh(
        uint _idPetani,
        uint8 _bulan,
        uint8 _hari,
        uint16 _tahun,
        uint _jumlahSetor
    ) public onlyOwner {
        require(_bulan >= 1 && _bulan <= 12, "Bulan harus antara 1 dan 12");
        require(_hari >= 1 && _hari <= 31, "Hari harus antara 1 dan 31");
        require(_tahun >= 2000 && _tahun <= 9999, "Tahun harus 4 digit");
        require(_jumlahSetor > 0, "Jumlah setor harus lebih dari 0");
        listSetorTeh.push(
            Setor(nextId, _idPetani, _bulan, _hari, _tahun, _jumlahSetor)
        );
        nextId++;
    }

    function updateSetorTeh(
        uint _id,
        uint _idPetani,
        uint8 _bulan,
        uint8 _hari,
        uint16 _tahun,
        uint _jumlahSetor
    ) public onlyOwner {
        require(_id > 0 && _id < nextId, "ID setor tidak ditemukan");
        require(_bulan >= 1 && _bulan <= 12, "Bulan harus antara 1 dan 12");
        require(_hari >= 1 && _hari <= 31, "Hari harus antara 1 dan 31");
        require(_tahun >= 2000 && _tahun <= 9999, "Tahun harus 4 digit");
        require(_jumlahSetor > 0, "Jumlah setor harus lebih dari 0");
        uint index = _id - 1;
        listSetorTeh[index].idPetani = _idPetani;
        listSetorTeh[index].bulan = _bulan;
        listSetorTeh[index].hari = _hari;
        listSetorTeh[index].tahun = _tahun;
        listSetorTeh[index].jumlahSetor = _jumlahSetor;
    }

    function getAllSetorTeh() public view returns (Setor[] memory) {
        return listSetorTeh;
    }

    function getDataSetorTeh(
        uint _id
    ) public view returns (uint, uint, uint8, uint8, uint16, uint) {
        require(_id > 0 && _id < nextId, "ID setor tidak ditemukan");
        uint index = _id - 1;
        Setor memory setor = listSetorTeh[index];
        return (
            setor.id,
            setor.idPetani,
            setor.bulan,
            setor.hari,
            setor.tahun,
            setor.jumlahSetor
        );
    }

    function getCountSetorTeh() public view returns (uint) {
        return listSetorTeh.length;
    }
}
