<template>
	<a-col>
		<a-upload
			class="uploader_container"
			v-bind="uploadConfig"
			:action="apiQuery.url"
			:before-upload="beforeUpload"
			:file-list="fileList"
			:remove="handleRemove"
			:customRequest="uploadFile"
			@change="handleChange"
		>
			<template v-if="!fileFlag && fileType === 'image'">
				<div v-if="fileUrl" class="imgContainer has_img" :style="layout.imgContainer">
					<img :src="fileUrl" alt="avatar" />
					<span class="handle_img">
						<a-icon type="delete" @click.stop="fileUrl = ''" />
					</span>
				</div>
				<div v-else class="imgContainer" :style="layout.imgContainer">
					<a-icon :type="loading ? 'loading' : 'plus'" />
				</div>
			</template>
			<template v-else-if="!fileFlag && fileType === 'csv'">
				<a-button type="primary" v-if="!uploadResult">
					{{ $t('operate.importFile') }}
				</a-button>
				<div v-else>
					{{ uploadNumber }} 个
					<span class="form-button-reload" @click="reupload">
						{{ $t('operate.reupload') }}
					</span>
				</div>
			</template>
		</a-upload>
		<slot></slot>
	</a-col>
</template>

<script>
export default {
	name: 'BaseUpload',
	props: {
		// 上传的行为，是否需要裁剪或者其他
		uploadAction: {
			type: String,
			default: 'default'
		},
		// 上传的api链接
		apiQuery: {
			type: Object,
			default: () => ({
				url: '/abcd',
				data: {}
			})
		},
		uploadConfig: {
			type: Object,
			default: () => ({
				'list-type': 'picture-card'
			})
		},
		// 上传的文件类型
		fileType: {
			type: String,
			default: 'image'
		},
		// 上传文件的限制
		fileRule: {
			type: Object,
			default: () => ({
				maxSize: 10
			})
		},
		// 回显的文件链接
		hasFile: {
			type: String,
			default: ''
		},
		// 只获取file文件，不做上传行为
		jusGetFile: {
			type: Boolean,
			default: false
		},
		layout: {
			type: Object,
			default: () => ({
				imgContainer: { width: '128px', height: '128px', lineHeight: '128px' }
			})
		}
	},
	emits: ['getUploadFile', 'handleGetFile'],
	data() {
		return {
			fileUrl: this.hasFile || '', // 上传成功后接口返回的地址
			fileList: [], // 多个文件的列表
			loading: false, // 加载动画
			uploadResult: false, // 判断回显后端返回有无上传的结果
			uploadNumber: '', // 后端返回上传文件的数量
			fileFlag: false // 显示文件还是进度条的标识
		}
	},
	methods: {
		// 文件上传前的钩子
		beforeUpload(file) {
			const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
			const isVideo = file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/flv'
			const maxSize = file.size / 1024 / 1024 < this.fileRule.maxSize
			if (!maxSize) {
				this.$message.error(`Upload file size cannot exceed ${this.fileRule.maxSize}MB!`)
				return false
			}
			if (!isImage && this.fileType === 'image') {
				this.$message.error('The uploaded file is in the wrong format!')
				return false
			}
			if (!isVideo && this.fileType === 'video') {
				this.$message.error('The uploaded file is in the wrong format!')
				return false
			}
			this.$emit('getUploadFile', file)

			if (this.uploadAction === 'cropper' || this.jusGetFile) {
				return false
			}
			// return false // 手动上传,写了之后customRequest无反应
		},
		// 转换为formData，上传图片至后端
		async getFormData(file, options) {
			const formData = new FormData()
			formData.append('file', file)
			this.loading = true
			const { url = '' } = this.apiQuery
			try {
				const res = await this.$api(url, formData, 'post')
				this.fileUrl = res.imgUrl
			} catch (err) {
				if (options) {
					options.onError(err.msg || '', err, file)
				} else {
					this.$message.error('Failed to upload file')
				}
			}

			this.loading = false
		},
		handleChange(params) {
			if (this.uploadAction === 'cropper') return false
			let { fileList } = params
			// 1. 限制上传文件数, 默认只上传一个，新的会覆盖掉旧的
			const { listMaxLength = -1 } = this.fileRule
			const newFileList = fileList.slice(listMaxLength).map((file) => {
				if (file.response) {
					file.url = file.response.url
				}
				return file
			})
			this.fileList = newFileList
			this.$emit('handleGetFile', params)
		},
		// 接受裁剪完的图片进行上传
		cropperUpload(info) {
			this.getFormData(info)
		},
		uploadFile(options) {
			this.getFormData(options.file, options)
		},
		handleRemove(file) {
			const index = this.fileList.indexOf(file)
			this.fileList = this.fileList.slice().splice(index, 1)
		}
	}
}
</script>

<style scoped lang="less">
.uploader_container {
	/deep/ .ant-upload {
		.imgContainer {
			position: relative;
			width: 128px;
			height: 128px;
			line-height: 128px;
			&:hover {
				&::before {
					opacity: 1;
				}
				.handle_img {
					opacity: 1;
				}
			}
			img {
				width: 100%;
				height: 100%;
			}
			.anticon {
				font-size: 28px;
				color: #8c939d;
				text-align: center;
			}
			.handle_img {
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: 99999;
				white-space: nowrap;
				transform: translate(-50%, -50%);
				opacity: 0;
				transition: all 0.3s;
				i {
					color: #ff726f;
				}
			}
		}
		.has_img {
			&::before {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: 1;
				background-color: rgba(0, 0, 0, 0.5);
				opacity: 0;
				transition: all 0.3s;
				content: ' ';
			}
		}
	}
}
</style>
