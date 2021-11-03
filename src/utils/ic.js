/* eslint-disable */
// 获取网络链接状态
export const getNetworkConnect = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: "device.getNetworkConnect",
            success: (res) => {
                //见下文出参示例及说明 0已连接，1未连接
                resolve(res)
            },
            fail: (res) => {
                reject(res)
            }
        })
    })
}

// 读取app缓存数据
export const readFromFile = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: 'system.readFromFile',
            params: {
                appId: process.env.VUE_APP_ID,
                key: 'localData',
            },
            success: (res) => {
                resolve(res)
            },
            fail: (res) => {
                reject(res)
            }
        })
    })
}

// 保存数据到app本地
export const saveToFile = (localData) => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: 'system.saveToFile',
            params: {
                appId: process.env.VUE_APP_ID,
                text: localData,
                key: 'localData',
            },
            success: (res) => {
                resolve(res)
            },
            fail: (res) => {
                reject(res)
            }
        })
    })
}

// 选择图片
export const selectPhotos = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: "device.selectPhotos",
            amount: "",
            success: (res) => {
                resolve(res)
            },
            fail: (res) => {
                reject(res)
            }
        })
    })
}

// 初始化蓝牙连接
export const initBluetooth = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: "bt.initBluetooth",
            success: (res) => {
                resolve(res)
            }
        })
    })
}

// 通过手机蓝牙向蓝牙设备写入指令
export const writeBleCmd = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: "bt.writeBleCmd",
            params: {
                "bleCMD": ""
            },
            success: (res) => {
                resolve(res)
            }
        })
    })
}

// 开启手机NFC通道读取数据
export const openNFC = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: "device.openNFC",
            success: (res) => {
                resolve(res)
            },
        })
    })
}

// 关闭NFC功能
export const closeNFC = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: "device.closeNFC",
            success: (res) => {
                resolve(res)
            }
        })
    })
}

// 获取位置信息
export const getLocationInfo = () => {
    return new Promise((resolve, reject) => {
        ic.run({
            action: "device.getLocation",
            params: {
                mapType: 0,
            },
            success: (res) => {
                resolve(res)//见下文出参示例及说明
            },
            fail: (res) => {
                reject("fail:")
            }
        })
    })
}