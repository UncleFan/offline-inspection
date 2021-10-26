<template>
  <div class="content-box">
    <div class="card font-small">
      <p class="font-small gray bold title">
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
      </p>
      <p>{{ content.measureRequirement }}</p>
      <p class="radio flex-horizon-center">
        <span>是否正常：</span>
        <van-radio-group v-model="content.measureResult" direction="horizontal">
          <van-radio name="1" shape="round">正常</van-radio>
          <van-radio name="2" shape="round">异常</van-radio>
        </van-radio-group>
      </p>
      <div>
        <p class="flex-horizon-left">
          <span>备注：</span>
          <span>
            <van-field
              v-model="content.remark"
              placeholder="请输入备注内容"
            ></van-field>
          </span>
        </p>
        <van-uploader
          v-if="content.cameraFlag === 1"
          v-model="fileList"
          :after-read="uploadImg"
          multiple
        ></van-uploader>
      </div>
      <div class="status">
        <!-- <van-button round v-if="content.readMethod === 2">
          拍照读数
        </van-button> -->
        <van-button round v-if="content.readMethod === 4">
          传感器读数
        </van-button>
        <!-- <van-button round>隐患上报</van-button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "content",
    event: "change",
  },
  props: {
    content: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      showMeasureName: false,
      popContext: [{ text: "" }],
      radio: 0,
      fileList: [],
    };
  },

  methods: {
    uploadImg(file) {
      console.log(file);
      console.log(this.fileList);
    },
    showpopover(e) {
      this.popContext[0].text = e.target.innerHTML;
    },
  },
};
</script>

<style lang="less" scoped>
@import url("../theme/index.less");
.content-box {
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
  margin-top: 10px;
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
    p {
      height: 40px;
      line-height: 40px;
    }
    .radio {
      justify-content: flex-start;
    }
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
</style>
