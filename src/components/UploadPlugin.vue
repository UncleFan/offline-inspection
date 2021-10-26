<!-- eslint-disable -->
<template>
  <div>
    <div class="box flex-horizon-left">
      <div class="preview" v-for="(item, index) in fileList" :key="index">
        <img
          :src="item.content"
          class="preview-img"
          @click="previewImg(item.content)"
        />
        <van-icon name="clear" class="delete" @click.stop="deleteImg(index)" />
      </div>
      <div class="upload-btn flex-horizon-center" @click="uploadImg">
        <van-icon name="photograph" />
      </div>
    </div>
    <van-popup v-model="show">
      <img :src="preview" class="e-preview" @click.stop="closePreview" />
    </van-popup>
  </div>
</template>
<script>
/* eslint-disable */
import { selectPhotos } from '@/utils/ic'
export default {
  name: 'UploadPlugin',
  model: {
    prop: 'fileList',
    event: 'change',
  },
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      },
    },
    id: {
        type: Number,
        default: 0
    },
    taskId: {
        type: Number,
        default: 0
    }
  },
  mounted() {
      console.log(this.fileList)
  },
  data() {
    return {
      preview: '',
      show: false,
    }
  },
  methods: {
    async uploadImg() {
      let data = await selectPhotos()
      // 创建file文件
      const file = new Object()
      file.content = data[0]
      let formdata = new FormData();
      let dataFile = this.base64toFile(file.content, Date.now() + '.png');
      formdata.append("file", dataFile);
      file.id = this.id;
      file.taskId = this.taskId;
      file.file = formdata;
      this.fileList.push(file)
      this.$emit('change', this.fileList)
    },
    // 将base64转换为文件
    base64toFile(urlData, fileName) { 
        let arr = urlData.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bytes = atob(arr[1]) // 解码base64
        let n = bytes.length
        let ia = new Uint8Array(n)
        while (n--) {
            ia[n] = bytes.charCodeAt(n)
        }
        return new File([ia], fileName, { type: mime })
    },
    // 预览
    previewImg(src) {
      this.show = true
      this.preview = src
    },
    // 关闭预览
    closePreview() {
      this.show = false
      this.preview = ''
    },
    // 删除
    deleteImg(index) {
      this.fileList.splice(index, 1)
      this.$emit('change', this.fileList)
    },
  },
}
</script>
<style lang="less" scoped>
@import url('../theme/index.less');
.box {
  height: auto;
  min-height: 87px;
  flex-wrap: wrap;
  padding-bottom: 10px;
  .upload-btn {
    width: 75px;
    height: 75px;
    border: 1px dashed #e3e3e3;
    box-sizing: border-box;
    /deep/ .van-icon {
      font-size: 36px;
    }
  }
  .preview {
    width: 75px;
    height: 75px;
    margin-right: 3px;
    margin-bottom: 10px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .delete {
      position: absolute;
      font-size: 16px;
      right: 2px;
      top: 2px;
    }
  }
}
.e-preview {
  max-width: 100vw;
  margin: 0;
}
</style>