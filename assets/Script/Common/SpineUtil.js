
cc.Class({
    statics: {
        // 声明静态变量
        count: 0,
        // 声明静态方法

        roleAnim :{
            "1": "girl1000",
            "2": "robot2000"
        },
        createSpine: function (spine, filePath, callback) {
            cc.loader.loadRes(filePath, sp.SkeletonData, (err, res)=> {
                if (err || res.length <= 0) {
                    console.error("ERROR: function createSpine() add spine error !!! err = ", err);
                    return;
                }
                spine.skeletonData = res;
                if(callback) callback();
            });
        },

        /**
         *
         * @param role  1:小女孩 2:机器人
         * @param list  需要更换的服装数组
         * @param spine  人物spine
         * @param spineTemp  临时加载spine
         */
        changeAttachment: function (role, list, spine, spineTemp) {
            let name = this.roleAnim[role];
            this.createSpine(spine, "spines/"+name+"/"+name, ()=>{
                spine.setAnimation(0, "wait01", true);
                if(list.length <= 0) return;
                for(let i = 0;i < list.length;i++){
                    (()=> {
                        let table = cfg["clothing"][list[i]];
                        this.createSpine(spineTemp, "spines/girldress/"+table.spine, ()=>{
                            let list = spineTemp.skeletonData.skeletonJson.slots;
                            for(let j = 0;j < list.length;j++){
                                let att = spineTemp.getAttachment(list[j].name, list[j].attachment);
                                if(att){
                                    let slot = spine.findSlot(list[j].name.split("/")[1]);
                                    if(slot){
                                        slot.setAttachment(att);
                                    }
                                }
                            }
                        })
                    })(i);
                }
            });
        },

        changeSpineAttachment: function (list, spine, spineTemp) {
            if(list.length <= 0) return;
            for(let i = 0;i < list.length;i++){
                (()=> {
                    let table = cfg["clothing"][list[i]];
                    this.createSpine(spineTemp, "spines/girldress/"+table.spine, ()=>{
                        let list = spineTemp.skeletonData.skeletonJson.slots;
                        for(let j = 0;j < list.length;j++){
                            let att = spineTemp.getAttachment(list[j].name, list[j].attachment);
                            if(att){
                                let slot = spine.findSlot(list[j].name.split("/")[1]);
                                if(slot){
                                    slot.setAttachment(att);
                                }
                            }
                        }
                    })
                })(i);
            }
        }
    }
});
