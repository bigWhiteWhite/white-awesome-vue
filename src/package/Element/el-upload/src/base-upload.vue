<template>
	<div>
		<el-upload
			class="avatar-uploader"
			v-loading="loading"
			ref="uploadRef"
			:action="uploadUrl"
			:show-file-list="false"
			:before-upload="beforeUpload"
			:on-error="uploadError"
			:on-success="uploadSuccess"
			:on-progress="uploadProcess"
		>
			<!-- :http-request="httpUpload" -->
			<div v-if="!fileFlag && fileType === 'image'">
				<img v-if="fileUrl" :src="fileUrl" class="avatar" />
				<i v-else class="el-icon-plus avatar-uploader-icon" />
			</div>
			<div v-if="!fileFlag && fileType === 'video'">
				<video v-if="fileUrl" :src="fileUrl" class="avatar-video" controls="controls"> 您的浏览器不支持视频播放 </video>
				<i v-else class="el-icon-plus avatar-uploader-icon" />
			</div>
			<el-progress v-if="fileFlag" style="margin-top: 10px" :percentage="uploadPercent" :format="percentTip" />
		</el-upload>
	</div>
</template>

<script>
export default {
	name: 'EleBaseUpload',
	props: {
		uploadUrl: {
			// 上传的api链接
			type: String,
			required: true
		},
		fileType: {
			// 上传的文件类型
			type: String,
			default: 'image'
		},
		hasFile: {
			// 回显的文件链接
			type: String,
			default: ''
		}
	},
	data() {
		return {
			fileUrl: this.hasFile || '', // 上传成功后接口返回的地址
			loading: false, // 加载动画
			uploadPercent: 0, // 上传时进度条显示的进度
			fileFlag: false // 显示文件还是进度条的标识
		}
	},
	methods: {
		// 文件上传前的钩子
		beforeUpload(file) {
			const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
			const isVideo = file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/flv'
			const isLt10M = file.size / 1024 / 1024 < 10
			if (!isLt10M) {
				this.$message.error('上传文件大小不能超过 10MB!')
				return false
			}
			if (!isImage && this.fileType === 'image') {
				this.$message.error('上传文件格式有误!')
				return false
			}
			if (!isVideo && this.fileType === 'video') {
				this.$message.error('上传文件格式有误!')
				return false
			}
		},
		// 文件上传的钩子
		httpUpload(file) {
			console.log(file)
			this.fileUrl = ''
			this.uploadPercent = 0
			const formData = new FormData()
			formData.append('file', file)
			// formData.append('appId', this.prefixApi)
			//	this.uploadError(file) 上传失败可以调用
			this.loading = true
			setTimeout(() => {
				this.fileUrl = 'https://img13.360buyimg.com/seckillcms/s140x140_jfs/t1/146322/40/21521/49848/6206310fEe5e7452d/efa5d320c8e3cffb.jpg.webp'
				this.loading = false
			}, 1000)
		},
		// 成功上传文件
		uploadSuccess(res) {
			this.fileFlag = false
			this.uploadPercent = 0
			if (res.code === 200) {
				this.fileUrl = res.data
			} else {
				this.$message.error('视频上传失败，请重新上传！')
			}
		},
		// 删除上传失败文件
		uploadError(err, file) {
			console.log(err)
			const { uploadRef } = this.$refs
			const { uid } = file
			const idx = uploadRef.uploadFiles.findIndex((item) => item.uid === uid)
			uploadRef.uploadFiles.splice(idx, 1)
		},
		// 进度条
		uploadProcess(event) {
			// event, file, fileList
			this.fileFlag = true
			this.uploadPercent = Math.floor(event.percent)
		},
		percentTip(percentage) {
			return percentage === 100 ? '满' : `${percentage}%`
		}
	}
}
</script>

<style scoped lang="less">
::v-deep .avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	&:hover {
		border-color: #409eff;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}
}
.avatar {
	width: 148px;
	max-height: 148px;
	display: block;
}
.avatar-video {
	width: 200px;
	max-height: 200px;
	display: block;
}
</style>
