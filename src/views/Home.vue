<!--eslint-disable-->
<template>
  <div class="home">
    <div class="nav gray flex-horizon-center relative">
      <span class="icon absolute" @click="window.location.back(-1)">
        <img src="@/assets/back-icon.png" class="fit flex-vertical-center" />
      </span>
      <span class="gray bold font-large">离线巡检</span>
      <span class="d-icon flex-vertical-center">
        <van-tag type="default" @click="downloadOfflineData">下载</van-tag>
      </span>
    </div>
    <div class="content">
      <van-collapse v-model="collapseActive">
        <van-collapse-item
          v-for="(item, x) in collapseData"
          :name="item.taskInfo.taskId"
          align="left"
          :key="item.taskInfo.taskId"
        >
          <template #title>
            <div class="font-small bold gray">{{ item.taskInfo.taskName }}</div>
            <div class="lightgray font-small">
              {{ `计划时间: ${item.taskInfo.actualStartTime}` }}
            </div>
          </template>
          <template #value>
            <div class="blue font-tiny bold">
              {{ collapseActive.includes(item.name) ? '收起' : '展开' }}
            </div>
          </template>
          <div
            class="content-wrap"
            v-for="(content, y) in item.offlineTaskAreaDTOList"
            :key="content.taskAreaDTO.targetId"
          >
            <div class="content-title">
              <span class="gray font-small bold">
                <b class="rect blue"></b>
                <span>{{ content.taskAreaDTO.targetName }}</span>
              </span>
              <span class="blue font-tiny flex-horizon-right">
                <div
                  v-if="!content.taskAreaDTO.checkinTime"
                  class="flex-horizon-right"
                  style="width: 80px"
                  @click="showCheckNFC(content, x, y)"
                >
                  <img src="@/assets/NFC.png" class="nfc-icon" />
                  <span style="margin-left: 4px">NFC打卡</span>
                  <img src="@/assets/prev-icon.png" class="prev-icon" />
                </div>
              </span>
            </div>
            <div
              v-for="device in content.measureListDTO.deviceMeasureDTOList"
              :key="device.deviceId"
            >
              <span>{{ device.deviceName }}</span>
              <div
                v-for="(detail, index) in device.measureDTOList"
                :key="detail.id"
              >
                <type-input
                  v-if="detail.measureResultType === 2"
                  :taskId="item.taskInfo.taskId"
                  :content="detail"
                  v-model="device.measureDTOList[index]"
                ></type-input>
                <type-radio
                  v-else
                  :content="detail"
                  v-model="device.measureDTOList[index]"
                ></type-radio>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="footer flex-horizon-center" v-if="collapseData.length > 0">
      <div class="button">
        <van-button
          type="default"
          :loading="loading"
          size="large"
          @click="uploadData"
          >上传</van-button
        >
      </div>
      <div class="button">
        <van-button
          size="large"
          color="#2475fb"
          id="save"
          @click="saveLocalData"
          >保存</van-button
        >
      </div>
    </div>
    <van-popup v-model="showNFC" round position="bottom">
      <div class="nfc-container">
        <p class="font-normal bold gray">已准备好NFC识别</p>
        <img
          :src="
            nfcDone
              ? require('@/assets/nfc-success.png')
              : require('@/assets/nfc-start.png')
          "
          class="start-nfc"
        />
        <van-button
          type="primary"
          color="#1989fa"
          size="large"
          :loading="isCheckingNFC"
          loading-text="正在读取数据..."
          @close="closePopup"
          @click="startNFC"
          >{{ nfcDone ? '已打卡' : '开始' }}</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
/* eslint-disable */
import TypeInput from '@/components/TypeInput'
import TypeRadio from '@/components/TypeRadio'
import {
  getOffLineData,
  postMultiple,
  updateSicInspectTaskResultExtra,
  updateOfflineData,
  upDateCheckinNFCInfo
} from '@/http/api.js'
import { cloneDeep } from 'lodash'
import {
  getNetworkConnect,
  readFromFile,
  saveToFile
} from '@/utils/ic'

export default {
  name: 'Home',
  data() {
    return {
      ins: {},
      loading: false, // 提价加载
      active: 0,
      collapseActive: [],
      collapseData: [],
      saveData: [],
      showNFC: false,
      beforeUploadImg: [], // 上传前的图片数组
      afterUploadImg: [], // 上传后的图片数组
      inspectionUpdate: [], // 巡检详情组成的数组
      checkNFC: [], // 各区域是否NFC打卡
      currentNFCInfo: {}, // 当前打卡的NFC设备
      requestSaveNFCParams: [],   // 所有NFC打卡信息
      isCheckingNFC: false,
      nfcDone: false,
    }
  },

  components: {
    TypeInput,
    TypeRadio,
  },

  async mounted() {
    let token = this.$route.query.token
    let unified = this.$route.query.unified
    console.log(window.location.href)
    console.log("token:", token)
    console.log("unified:", unified)
    console.log(this.$route)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('unified', unified)

    // 获取网络状态
    // let newStatus = await getNetworkConnect();
    // if(newStatus === "0") {
    // 有网
    // await this.getOfflineData()
    // }
  },

  methods: {
    // 上传数据
    async uploadData() {
      this.beforeUploadImg = [] // 初始化beforeUploadImg
      this.afterUploadImg = [] // 初始化afterUploadImg
      this.inspectionUpdate = [] // 初始化inspectionUpdate
      // this.loading = true
      /**
       * @params collectTime: "2021-10-18 16:0:16"
       * @params collectValue: null
       * @params inspectItemId: 1536
       * @params inspectRemark: ""
       * @params inspectResult: ""
       * @params inspectValue: 0
       * @params taskId: 1245
       **/
      // 扁平化修改后的数据
      this.collapseData.forEach((item) => {
        // 循环遍历，获取一个包含所有上传图片的数组，并关联taskId与measureId(id)
        this.flatCollapseData(item, item.taskInfo.taskId)
      })
      
      // 更新NFC打卡信息
      const upDataNFCresutls = await Promise.all(
        this.requestSaveNFCParams.map(item => {
          return upDateCheckinNFCInfo(item)
        })
      )
      if(upDataNFCresutls.some(item => {
        item.data.code !== "0"
      })){
        return this.$toast("NFC打卡数据保存失败")
      }

      await this.pollingUploadData()

      // 合并beforeUploadImg、afterUploadImg
      const sicInspections = this.beforeUploadImg.map((item, i) => {
        return {
          ...item,
          ...this.afterUploadImg[i],
        }
      })

      // 更新巡检结果
      let promiseArr = this.updateSicInspectTaskResultExtra(sicInspections)
      Promise.all(promiseArr)
        .then((res) => {
          // 上传所有数据
          return updateOfflineData(this.inspectionUpdate)
        })
        .then((res) => {
          this.loading = false
          if (res.data.code === '0') {
            this.$toast(res.data.data)
          }
        })
    },

    // 更新巡检结果
    updateSicInspectTaskResultExtra(arr) {
      const requestArr = arr.map((item) => {
        return {
          inspectExtras: [
            {
              fullName: item.fullName,
              originName: item.originName,
              type: 0,
              url: item.url,
            },
          ],
          inspectOp: '',
          measureId: item.measureId,
          taskId: item.taskId,
        }
      })
      const promiseArr = requestArr.map((item) => {
        return updateSicInspectTaskResultExtra(item)
      })
      return promiseArr
    },

    // 异步轮询上传
    async pollingUploadData() {
      this.loading = true
      let results = []
      for (let limit = 0; limit < this.beforeUploadImg.length; limit++) {
        await this.getUploadImg(this.beforeUploadImg[limit].file)
        if (limit === this.beforeUploadImg.length - 1) {
          this.loading = false
        }
      }
    },

    getUploadImg(file) {
      return postMultiple(file).then((res) => {
        this.afterUploadImg.push(res.data.data)
      })
    },

    // 扁平化数据
    flatCollapseData(target, taskId = null) {
      if (
        target.hasOwnProperty('id') &&
        target.hasOwnProperty('fileList') &&
        target.fileList instanceof Array &&
        target.fileList.length > 0
      ) {
        target.fileList.forEach((k) => {
          this.beforeUploadImg.push({
            taskId,
            measureId: target.id,
            ...k,
            ...target,
          })
        })
      }
      if (target.hasOwnProperty('id')) {
        this.inspectionUpdate.push({
          collectTime: '2021-10-18 16:0:16', // 采集时间
          collectValue: target.collectValue ?? '', // 采集值
          inspectItemId: target.id ?? '', // 巡检id
          inspectRemark: target.remark ?? '', // 备注
          inspectResult: target.measureResult ?? '', // 1.正常或2.异常
          inspectValue: target.measureValue ?? '', // 巡检值
          taskId: taskId, // 任务taskId
        })
      }
      if (target.hasOwnProperty("nfcCode")) {
        this.requestSaveNFCParams.push({
          areaId: target.taskAreaDTO.areaId,
          checkinDeviceId: target.nfcCode,
          pathNodeId: target.taskAreaDTO.pathNodeId,
          taskId
        })
      }
      if (
        target.hasOwnProperty('offlineTaskAreaDTOList') &&
        target.offlineTaskAreaDTOList.length > 0
      ) {
        taskId = target.taskInfo.taskId
        target.offlineTaskAreaDTOList.forEach((item) => {
          this.flatCollapseData(item, taskId)
        })
      } else if (target.hasOwnProperty('measureListDTO')) {
        target.measureListDTO.deviceMeasureDTOList.forEach((item) => {
          this.flatCollapseData(item, taskId)
        })
      } else if (target.hasOwnProperty('measureDTOList')) {
        target.measureDTOList.forEach((item) => {
          this.flatCollapseData(item, taskId)
        })
      }
    },

    // 下载数据
    async downloadOfflineData() {
      this.$toast.loading({
        message: '正在下载数据...',
        forbidClick: true,
      })
      // this.getOfflineData()
      // 判断当前网络状态
      let newStatus = await getNetworkConnect()
      if (newStatus === '0') {
        // 有网
        this.getOfflineData()
      } else {
        // 没有网络
        let localData = await readFromFile()
        if (localData) {
          this.$toast('下载完成')
          this.collapseData = JSON.parse(localData)
        } else {
          this.$toast('请在有网络的地方下载数据')
        }
      }
    },

    saveLocalData() {
      const localData = JSON.stringify(this.collapseData)
      saveToFile(localData).then((res) => {
        this.$toast('保存成功！')
      })
    },

    // 获取离线数据
    getOfflineData() {
      let date = new Date() //日期对象
      let now = ''
      now = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + '00:00:00' //读英文就行了
      let today = Date.parse(new Date().toLocaleDateString());
      let tomorrow = today + (3600000*24)
      const params = {
        inspectGroupId: '',
        inspectUserId: '',
        needAreas: true,
        pageNum: 1,
        pageSize: 1000,
        planCodeOrName: '',
        planInspectEndTime: this.formDateTime(today),
        planInspectStartTime: this.formDateTime(tomorrow),
        taskCode: '',
        taskResult: '',
        taskState: 3,
        taskStatus: 3,
        userGroupIdList: [],
      }

      getOffLineData(params).then((res) => {
        if (res.data.code === '0') {
          this.$toast("下载数据成功")
          this.collapseData = res.data.data.list
          // 获取各区域是否NFC打卡
          this.collapseData.forEach((item) => {
            if (
              item.hasOwnProperty('offlineTaskAreaDTOList') &&
              item.offlineTaskAreaDTOList instanceof Array
            ) {
              item.offlineTaskAreaDTOList.forEach((o) => {
                this.checkNFC.push(o.checkinTime ? true : false)
              })
            }
          })
        }
      })
    },

    formDateTime(timesStamp) {
      const times = new Date(timesStamp);
      const formDateT = times.getFullYear() + '-' + (times.getMonth() + 1) + '-' + times.getDate() + ' ' + '00:00:00'
      return formDateT
    },

    showCheckNFC(item, x, y) {
      this.showNFC = true
      this.currentNFCInfo = {
        ...item,
        x,
        y,
      }
    },

    closePopup() {
      console.log('closePopup')
    },

    startNFC() {
      this.isCheckingNFC = true
      ic.run({
        action: 'device.openNFC',
        success: (res) => {
          this.isCheckingNFC = false
          this.nfcDone = true
          this.currentNFCInfo['nfcCode'] = res.id
          this.collapseData[this.currentNFCInfo.x].offlineTaskAreaDTOList[
            this.currentNFCInfo.y
          ].nfcCode = res.id
          console.log(this.collapseData)
          ic.run({
            action: 'device.closeNFC',
          })
          this.showNFC = false
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import url('../theme/index.less');
.home {
  width: 100vw;
  height: 100vh;
  background-color: @backColor;
  .nav {
    width: 100%;
    height: 44px;
    padding: 11px 12px;
    box-sizing: border-box;
    background-color: #fff;
    .icon {
      width: 22px;
      height: 22px;
      left: 12px;
      top: 11px;
    }
    .d-icon {
      position: absolute;
      right: 12px;
    }
  }
  .content {
    width: 100%;
    height: calc(100vh - 44px - 73px);
    overflow-y: scroll;
    .content-wrap {
      width: 100%;
      min-height: calc(100vh - 44px - 73px);
      .content-title {
        display: flex;
        line-height: 20px;
        > span {
          flex: 1;
        }
        > span:nth-child(2) {
          text-align: center;
        }
        > span:nth-child(3) {
          text-align: right;
        }
        .nfc-icon,
        .prev-icon {
          width: 12px;
        }
      }
    }
    /deep/ .van-collapse .van-icon-arrow {
      // display: none;
      color: @blue;
    }
    /deep/ .van-collapse .van-cell__value {
      flex: none;
    }
    /deep/ .van-collapse-item__content {
      background-color: transparent;
    }
  }
  .footer {
    width: 100%;
    height: 73px;
    background-color: #fff;
    padding: 12px;
    justify-content: space-between;
    box-sizing: border-box;
    .button {
      width: calc((100vw - 36px) / 2);
    }
  }
}
.nfc-container {
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
  .start-nfc {
    width: 131px;
    height: 131px;
    margin: 20px 0 56px 0;
  }
}
</style>
