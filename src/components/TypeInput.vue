<template>
  <div class="content-box">
    <p class="font-normal gray bold flex-horizon-between title">
      <!-- <span>
        <span class="rect"></span>
        <span>BOG压缩机入口分液罐</span>
      </span>
      <span>
        <span class="type-number">PIT03-0101</span>
      </span> -->
    </p>
    <div class="card font-small">
      <p class="flex-horizon-between font-small title">
        <van-popover
          v-model="showMeasureName"
          theme="light"
          trigger="click"
          placement="top"
          :actions="popContext"
        >
          <template #reference>
            <span class="target bold gray" @click="showpopover">{{
              content.measureName
            }}</span>
          </template>
        </van-popover>
        <van-popover
          v-model="showPopover"
          theme="light"
          trigger="click"
          placement="top"
          :actions="popContext"
        >
          <template #reference>
            <span class="indicator" @click="showpopover"
              >标准：{{ content.checkLogic }}</span
            >
          </template>
        </van-popover>
      </p>
      <p class="flex-horizon-between font-small">
        <span>采集值: &nbsp;&nbsp;&nbsp;{{ content.collectValue }}</span>
        <span v-if="!flag"><van-tag type="warning">异常</van-tag></span>
      </p>
      <div class="flex-horizon-left font-small">
        <div>巡检值:</div>
        <div>
          <van-field
            v-model="content.measureValue"
            type="number"
            placeholder="请输入巡检值"
            @input="checkStandars"
          />
        </div>
      </div>
      <div v-if="content.cameraFlag === 1">
        <upload-plugin
          v-model="fileList"
          :file-list="fileList"
          :id="content.id"
          :taskId="taskId"
          @change="uploadImg"
        ></upload-plugin>
        <!-- <van-uploader
          v-model="fileList"
          multiple
          @click="uploadImg"
        ></van-uploader> -->
        <!-- <div @click="uploadImg">上传</div> -->
      </div>
      <div class="status" v-if="content.readMethod === 4">
        <!-- <van-button round v-if="content.readMethod === 2">
          拍照读数
        </van-button> -->
        <van-button round @click="getBlueToothData"> 传感器读数 </van-button>
        <!-- <van-button round>隐患上报</van-button> -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { filterStandars } from '@/utils/filterStandars'
import { initBluetooth, writeBleCmd, selectPhotos } from '@/utils/ic'
import UploadPlugin from './UploadPlugin'
export default {
  model: {
    prop: 'content',
    event: 'change',
  },
  props: {
    content: {
      type: Object,
      default() {
        return {}
      },
    },
    taskId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: '',
      fileList: [],
      showPopover: false,
      showMeasureName: false,
      popContext: [{ text: '' }],
      measureContext: [{ text: '' }],
      flag: true,
    }
  },

  components: {
    UploadPlugin,
  },

  mounted() {
    if(this.content.hasOwnProperty("fileList")) {
      this.fileList = this.content.fileList
    }
  },

  methods: {
    uploadImg(file) {
      console.log(this.fileList)
      // 回传，构建数据
      // this.$emit('change', {
      //   ...this.content,
      //   fileList: this.fileList,
      // })
    },
    showpopover(e) {
      this.popContext[0].text = e.target.innerHTML
    },
    checkStandars() {
      this.flag = filterStandars(this.content)
      this.$emit('change', {
        ...this.content,
        fileList: this.fileList,
      })
    },
    // 初始化连接蓝牙
    async getBlueToothData() {
      this.$toast.loading({
        duration: 0,
        message: '蓝牙连接中...',
        forbidClick: true,
      })

      let status = await initBluetooth()
      if (status.code === '0') {
        // 0 失败
        this.$toast(status.desc)
      } else if (status.code === '1' || status.code === '2') {
        this.$toast(status.desc)
        this.readBlueToothData()
      }
    },
    // 读取蓝牙数据
    async readBlueToothData() {
      this.$toast.loading({
        duration: 0,
        message: '读取数据中...',
        forbidClick: true,
      })
      // 获取蓝牙读数
      let readResult = await writeBleCmd()
      if (readResult.code === '1') {
        if (this.content.attributeType === '速度') {
          this.content.measureValue = readResult.data.speed
          this.content.collectValue = readResult.data.speed
        } else if (this.content.attributeType === '温度') {
          this.content.measureValue = readResult.data.temperature
          this.content.collectValue = readResult.data.temperature
        } else if (this.content.attributeType === '振动') {
          this.content.measureValue = readResult.data.displacement
          this.content.collectValue = readResult.data.displacement
        }
        this.$toast('读取成功')
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import url('../theme/index.less');
.content-box {
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
  background-color: #fff;
  .title {
    text-align: left;
    margin: 8px 0;
  }
  .card {
    width: 100%;
    padding: 4px 0;
    background-color: #fff;
    text-align: left;
    box-sizing: border-box;
    border-radius: 8px;
    .title > span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      height: 40px;
      line-height: 40px;
    }
  }
  .status {
    height: 46px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 8px 0 5px 0;
    box-sizing: border-box;
    border-top: 1px solid #eee;
    /deep/ .van-button {
      height: 100%;
      margin-right: 10px;
    }
  }
}
</style>
