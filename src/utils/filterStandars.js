/* eslint-disable */
export const filterStandars = (params) => {
  let flag = true
  let { measureValue, collectValue } = params
  let compareValue = measureValue
  if (!measureValue && !collectValue && collectValue != 0) {
    return true
  } else if (!measureValue && collectValue) {
    compareValue = +collectValue
  } else {
    compareValue = +measureValue
  }
  flag = compareMeasureMents(params, compareValue)
  return flag
}

const compareMeasureMents = (params, compareValue) => {
  let flag = true
  let { measureSingleLogic, measureSingle, measureMinLogic, measureMaxLogic, measureMin, measureMax } = params
  // console.log(compareValue, measureSingleLogic, measureMinLogic, measureMaxLogic)
  switch (measureSingleLogic) {
    case 1: {     // ===
      if (compareValue === measureSingle) {
        flag = true
      } else {
        flag = false
      }
    }
      break
    case 2: {     // !==
      if (compareValue != measureSingle) {
        flag = true
      } else {
        flag = false
      }
    }
      break
    case 3: {     // >
      if (compareValue > measureSingle) {
        flag = true
      } else {
        flag = false
      }
    }
      break
    case 4: {     // >=
      if (compareValue >= measureSingle) {
        flag = true
      } else {
        flag = false
      }
    }
      break
    case 5: {     // <
      if (compareValue < measureSingle) {
        flag = true
      } else {
        flag = false
      }
    }
      break;
    case 6: {     // <=
      if (compareValue <= measureSingle) {
        flag = true
      } else {
        flag = false
      }
    }
      break
    default: {
      if (measureMinLogic === 5 && measureMaxLogic === 5) {
        if (
          measureMin < compareValue &&
          measureMax > compareValue
        ) {
          flag = true
        } else {
          flag = false
        }
      } else if (measureMinLogic === 6 && measureMaxLogic === 6) {
        console.log(measureMin, measureMax)
        if (
          measureMin <= compareValue &&
          measureMax >= compareValue
        ) {
          flag = true
        } else {
          flag = false
        }
      } else if (measureMinLogic === 5 && measureMaxLogic === 6) {
        if (
          measureMin < compareValue &&
          measureMax >= compareValue
        ) {
          flag = true
        } else {
          flag = false
        }
      } else if (measureMinLogic === 6 && measureMaxLogic === 5) {
        if (
          measureMin <= compareValue &&
          measureMax > compareValue
        ) {
          flag = true
        } else {
          flag = false
        }
      }
    }
      break
  }
  return flag
}

let emptyArr = [];
export const insertData = ({ ...target }, arr) => {
  const params = {
    fullName: target.fullName,
    originName: target.originName,
    url: target.url,
    content: target.item.content,
    file: target.item.file,
    id: target.id,
    taskId: target.taskId
  }
  arr.forEach(item => {
    console.log(params)
    flatCollapseData(item, params)
  })
  // ?????????imglist
  console.log(emptyArr)
}

// ???????????????
const flatCollapseData = (obj, objs, taskId = null) => {
  if (obj.hasOwnProperty("measureDTOList")) {
    obj.measureDTOList.forEach(item => {
      let measuerId = item.id;
      if(item.hasOwnProperty('fileList') && item.fileList instanceof Array && item.fileList.length > 0) {
        item.fileList.forEach(k => {
          k = Object.assign(k, objs)
          k.taskId = taskId;
          k.measuerId = measuerId;
          emptyArr.push(k);
        })
      }
    })
  }
  if(obj.hasOwnProperty("offlineTaskAreaDTOList") && obj.offlineTaskAreaDTOList.length > 0) {
    obj.offlineTaskAreaDTOList.forEach(item => {
      flatCollapseData(item, objs, obj.taskInfo.taskId)
    }) 
  } else if (obj.hasOwnProperty("measureListDTO")) {
    obj.measureListDTO.deviceMeasureDTOList.forEach(item => {
      flatCollapseData(item, objs, taskId)
    })
  } 
}


// ????????????
export const getDayTimer = (data) => {
  var date = new Date(data)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var currentdate = y + '-' + m + '-' + d;
  var hh = date.getHours()
  hh = hh < 10 ? ('0' + hh) : hh
  var mm = date.getMinutes()
  mm = mm < 10 ? ('0' + mm) : mm
  var ss = date.getSeconds()
  ss = ss < 10 ? ('0' + ss) : ss
  var time = hh + ':' + mm + ':' + ss;
  return currentdate + " " + time
}

// ??????????????????????????????
/**
 * @param offlineData???????????????????????????
 * @param onlineData?????????????????????????????????
 * 1???????????????????????????
 * 2???????????????????????????
 * 3????????????????????????
 **/
export const mergeCollapseData = (offlineData, onlineData) => {
  const newData = [];
  // ??????????????????
  if(offlineData.length === onlineData.length) {
    // ???????????????????????????????????????
  } else {
    // ????????????????????????
    // ????????????????????????
    // ??????????????????????????????????????????????????????????????????????????????filterData
    // filterData???offlineData???????????????????????????????????? => ????????????????????? => ???????????????????????????????????????

    // ???offlineData???newData
    newData = offlineData
  }
  return newData;
}
