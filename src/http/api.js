/* eslint-disable */
import http from "./axios";

export const getOffLineData = (params) => {
    return http.post("/sic/task/downloadOfflineTask", params);
};

// 更新巡检列表
export const updateOfflineData = (params) => {
    return http.post("/sic/task/updateSicInspectItemResultList", params);
}

//上传单个文件
export const postMultiple = (params) => {
    return http.post('/upload/single', params)
}

// 更新单个巡检任务附件
export const updateSicInspectTaskResultExtra = (params) => {
    return http.post("/sic/task/updateSicInspectItemResultExtra", params)
}

// 上传打卡记录
export const upDateCheckinNFCInfo = (params) => {
    return http.post("/sic/task/checkin", {
        ...params,
        checkinDeviceType: 1,
        clockInWay: 1
    })
}

// 海康平台常量查询
export function ContantsGet () {
    return http.post("/contants/getContants", {})
    // return request({
    //   url: '/contants/getContants',
    //   method: 'POST'
    // })
  }