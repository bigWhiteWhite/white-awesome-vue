<template>
	<div>
		<el-dialog v-bind="dialogOptions" :visible="visible" centered destroyOnClose :before-close="switchVisible">
			<div v-for="item in stepItem().descriptList" :key="item.name">
				<el-descriptions v-bind="item.descriptOptions">
					<el-descriptions-item v-for="cItem in item.itemList" :key="cItem.value" :label="$t(cItem.label)">{{ cItem.value }}</el-descriptions-item>
				</el-descriptions>
				<slot :name="item.name"></slot>
			</div>
			<slot name="bottom"></slot>
			<!-- 确认取消插槽 -->
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="stepControl('prev')">
						{{ step === 1 ? $t(stepItem().cancelText) || $t('取消') : $t(stepItem().prevText) || $t('上一步') }}
					</el-button>
					<slot name="footerCenter"></slot>
					<!-- <el-button type="primary">
						{{ step === detailList.length ? $t(stepItem().confirmText) || $t('确定') : $t(stepItem().nextText) || $t('下一步') }}
					</el-button> -->
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'EleDetailDialog',
	props: {
		dialogOptions: {
			type: Object,
			default: () => ({})
		},
		detailList: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			step: 1,
			visible: false
		}
	},
	emits: ['showDetail'],
	methods: {
		// 根据步数获取对应的表单item
		stepItem() {
			const item = this.detailList.find((item) => {
				return item.step === this.step
			})
			return item
		},
		// 表格的row数据回传出去
		showDetail(row) {
			this.$emit('showDetail', row)
			this.switchVisible()
		},
		// 切换弹窗显隐，并且初始化数据
		switchVisible() {
			this.visible = !this.visible
		},
		// 步数控制函数
		stepControl(type = 'next', step) {
			if (step && this.step < this.detailList.length) {
				this.step = step
			} else {
				type === 'next' && this.step < this.detailList.length && (this.step += 1)
				type === 'prev' && this.step > 1 ? (this.step -= 1) : this.switchVisible()
			}
		}
	}
}
</script>

<style scoped lang="less"></style>
