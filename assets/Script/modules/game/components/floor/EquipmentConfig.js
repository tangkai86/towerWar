var EquipmentConfig ={};
EquipmentConfig.TYPE = cc.Enum({
    BATH: 1,        //澡盆
    LADDER: 2       //爬梯
});

EquipmentConfig.PREFAB = {
    [EquipmentConfig.TYPE.BATH]: GameRes.prefabEquipBath,
    [EquipmentConfig.TYPE.LADDER]: GameRes.prefabEquipLadder,
};

module.exports = EquipmentConfig;
