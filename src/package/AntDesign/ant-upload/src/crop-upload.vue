<template>
	<div>
		<a-row span="24">
			<base-upload ref="baseUploadRef" v-bind="baseUploadConfig" uploadAction="cropper" :hasFile="hasFile" @getUploadFile="init"></base-upload>
		</a-row>
		<a-row class="cropper_container" v-show="cropVisible">
			<vue-cropper ref="vueCropperRef" v-bind="option" :style="layout.cropperLayout"></vue-cropper>
			<div class="cropper_footer">
				<a-button @click="cropVisible = false">
					{{ $t('operate.cancel') }}
				</a-button>
				<a-button type="primary" :loading="cro_loading" @click="finish">
					{{ $t('operate.determine') }}
				</a-button>
			</div>
		</a-row>
	</div>
</template>

<script>
import _uniqueId from 'lodash/uniqueId'
import { VueCropper } from 'vue-cropper'
import BaseUpload from './base-upload.vue'
export default {
	name: 'AntCropUpload',
	props: {
		hasFile: {
			type: String,
			default: () => ''
		},
		baseUploadConfig: {
			type: Object,
			default: () => {}
		},
		cropperUploadConfig: {
			type: Object,
			default: () => ({})
		},
		layout: {
			type: Object,
			default: () => ({
				cropperLayout: { height: '300px' }
			})
		}
	},
	components: { VueCropper, BaseUpload },
	data() {
		return {
			cro_loading: false,
			cropVisible: false,
			option: {
				info: true, // 裁剪框的大小信息
				outputSize: 0.8, // 裁剪生成图片的质量
				outputType: 'jpeg', // 裁剪生成图片的格式
				canScale: false, // 图片是否允许滚轮缩放
				autoCrop: true, // 是否默认生成截图框
				// autoCropWidth: 300, // 默认生成截图框宽度
				// autoCropHeight: 200, // 默认生成截图框高度
				fixedBox: false, // 固定截图框大小 不允许改变
				fixed: true, // 是否开启截图框宽高固定比例
				fixedNumber: [5, 5], // 截图框的宽高比例
				full: true, // 是否输出原图比例的截图
				canMoveBox: true, // 截图框能否拖动
				original: false, // 上传图片按照原始比例渲染
				centerBox: false, // 截图框是否被限制在图片里面
				infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
				...this.cropperUploadConfig,
				img: '' // 裁剪图片的地址
			}
		}
	},
	computed: {
		getBaseImg() {
			return () => {
				return this.$refs['baseUploadRef'].fileUrl
			}
		}
	},
	methods: {
		getFile(blob, fileName) {
			const arr = blob.split(';base64,') // [data:image/png,xxx]
			const mime = arr[0].replace('data:', '') // mime后端识别用的文件格式数据
			const fileType = mime.split('/').pop() // 获取文件格式
			const bstr = atob(arr[1]) // base64解码
			// 创建Unicode编码的数组对象，每个值都是Unicode
			const u8arr = new Uint8Array(bstr.split('').map((str) => str.charCodeAt(0)))
			return new File([u8arr], `${fileName || 'file'}.${fileType}`, {
				type: mime
			})
		},
		// 转换为blob
		getBlob(file) {
			let url
			if (window.createObjectURL !== undefined) {
				// basic
				url = window.createObjectURL(file)
			} else if (window.URL !== undefined) {
				// mozilla(firefox)
				url = window.URL.createObjectURL(file)
			} else if (window.webkitURL !== undefined) {
				// webkit or chrome
				url = window.webkitURL.createObjectURL(file)
			}
			return url
		},
		init(_) {
			this.$set(this.option, 'img', this.getBlob(_))
			this.cropVisible = true
		},
		// 裁剪完成
		finish() {
			const { vueCropperRef, baseUploadRef } = this.$refs
			vueCropperRef.getCropData((data) => {
				this.cro_loading = true
				const res = this.getFile(data, `img_${_uniqueId()}`)
				if (res) {
					baseUploadRef.cropperUpload(res)
					this.cro_loading = false
					this.cropVisible = false
				}
			})
		}
	}
}
</script>

<style scoped lang="less">
.cropper_container {
	.cropper_footer {
		margin-top: 10px;
		text-align: end;
		/deep/ .ant-btn-primary {
			margin-left: 10px;
		}
	}
}
</style>
