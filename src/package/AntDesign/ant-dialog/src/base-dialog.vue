<template>
	<div class="base_dialog">
		<a-modal v-bind="dialogOptions" :visible="visible" :title="title" centered destroyOnClose @cancel="cancel">
			<div v-for="item in formList" :key="item.name" :class="item.name" v-show="item.step === step">
				<ant-base-form
					v-if="item.initForm"
					:ref="`${item.name}Ref`"
					v-bind="item.initForm"
					v-model="formData[item.name]"
					:step="item.step"
					:disabledList="disabledList[item.name]"
					@cascaderUpdate="cascaderUpdate"
					@selectUpdate="selectUpdate"
				>
					<template #topTitle>
						<header :style="item.initForm.layout.topTitle.style">
							{{ $t(item.initForm.layout.topTitle.text) }}
						</header>
					</template>
					<template #leftTitle>
						<header :style="item.initForm.leftTitle.style">
							{{ $t(item.initForm.leftTitle.text) }}
						</header>
					</template>
					<!-- 表单内插槽 -->
					<template v-for="formSlot in slotArray" #[formSlot]="scope">
						<slot :name="formSlot" :row="scope.row"></slot>
					</template>
				</ant-base-form>
				<!-- 表单外插槽 -->
				<slot :name="item.name"></slot>
			</div>
			<!-- 树结构插槽 -->
			<slot></slot>
			<!-- 确认取消插槽 -->
			<template #footer>
				<span class="dialog-footer">
					<a-button @click="stepControl('prev')">
						{{ step === 1 ? $t(stepItem().cancelText) || $t('setProduct.cancel') : $t(stepItem().prevText) || $t('operate.prev') }}
					</a-button>
					<a-button type="primary" @click="handleConfirmClick">
						{{ step === formList.length ? $t(stepItem().confirmText) || $t('setProduct.confirm') : $t(stepItem().nextText) || $t('operate.next') }}
					</a-button>
				</span>
			</template>
		</a-modal>
	</div>
</template>

<script>
import { AntBaseForm } from '@/package/AntDesign/ant-form'
import { initListData, initData } from '@/utils/ant-fun'
export default {
	name: 'AntBaseDialog',
	components: {
		AntBaseForm
	},
	props: {
		dialogOptions: {
			type: Object,
			default: () => {}
		},
		formList: {
			type: Array,
			require: true
		},
		// 回显表单数据
		echoFormList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			action: 'add',
			step: 1,
			visible: false,
			formData: {},
			disabledList: {} // 禁止输入列表,一般在编辑中使用，新增可以在配置文件中配置
		}
	},
	watch: {
		formList(_) {
			// 在外部添加步骤以后，需要监听，并重新赋值formData
			const unLiveData = _.filter((item) => {
				return !this.formData[item.name]
			})
			unLiveData.forEach((item) => {
				// 保留已经发生变化的formData
				this.echoFormList.forEach((_) => {
					if (item.name === _.name) {
						this.$set(this.formData, item.name, initData(item.initForm.formMain, _.initForm))
					} else if (!_[item.name]) {
						this.$set(this.formData, item.name, initData(item.initForm.formMain, {}))
					}
				})
			})
		}
	},
	emits: ['actionNextSubmit', 'cascaderUpdate', 'selectUpdate', 'switchVisible'],
	computed: {
		title() {
			let title
			if (this.action === 'add') {
				title = this.$t(this.stepItem().addTitle)
			} else if (this.action === 'edit') {
				title = this.$t(this.stepItem().editTitle)
			}
			return title
		},
		// 根据步数获取对应的表单item
		stepItem() {
			return (stepKey = this.step) => {
				const item = this.formList.find((item) => {
					return item.step === stepKey
				})
				return item
			}
		},
		// 返回第几步的表单数据 @params: 第几步， 什么属性
		submitFormData() {
			return (stepKey, name) => {
				return name ? this.formData[stepKey][name] : this.formData[stepKey]
			}
		},
		// 返回表单中所有的插槽,前面已经区分第几步的插槽,所以在使用的时候可以直接引入。就算是所有都使用到的插槽都无所谓
		// 如果插槽名一样，那么最好功能一样，否则的话就要区分不同的名字
		slotArray() {
			const _ = this.stepItem().initForm || ''
			const slotArray = _.formMain.map((item) => {
				if (item.type === 'slot') return item.value
			})
			return slotArray
		}
	},
	methods: {
		// 改变步骤中的某一个值，在哪里改变很重要!
		setFormData({ stepName, key = '', value }) {
			if (key && this.formData[stepName]) {
				this.$set(this.formData[stepName], key, value)
			} else if (this.formData[stepName]) {
				const data = { ...this.formData[stepName], ...value }
				this.$set(this.formData, stepName, data)
			}
		},
		// 改变组合框的某一个值
		setCompactForm({ stepName, key = '', value }) {
			// const stepItem = this.stepItem()
			const { antFormRef = {} } = this.$refs[`${stepName}Ref`][0]
			antFormRef.setCompactForm({
				key,
				value
			})
		},
		selectUpdate(data) {
			this.$emit('selectUpdate', data)
		},
		cascaderUpdate(data) {
			// 级联选择器改变数据的方式
			const form = this.formData
			const { value, key, step } = data
			form[`step${step}`][key] = value
			this.formData = form
			this.$emit('cascaderUpdate', data)
		},
		handleAction({ action = 'add', data = {}, disabledList = {} }) {
			this.switchVisible() // 先初始化，不然会覆盖后面的回显数据
			this.action = action
			if (this.action === 'edit') {
				// 如果是编辑需要回显数据
				this.formData = { ...this.formData, ...data }
			}
			this.disabledList = { ...disabledList }
		},
		cancel() {
			this.switchVisible()
			this.$emit('cancelAction')
		},
		switchVisible() {
			// 切换弹窗显隐，并且初始化数据
			this.step = 1
			this.formData = initListData(this.formList, this.echoFormList)
			this.visible = !this.visible
		},
		stepControl(type = 'next', step) {
			// 步数控制函数
			if (step && this.step < this.formList.length) {
				this.step = step
			} else {
				type === 'next' && this.step < this.formList.length && (this.step += 1)
				type === 'prev' && this.step > 1 ? (this.step -= 1) : this.cancel()
			}
		},
		handleConfirmClick() {
			// 可以选择将ref也传出去,也可以选择在这里校验
			const stepItem = this.stepItem()
			const { antFormRef = {} } = this.$refs[`${stepItem.name}Ref`][0]
			antFormRef &&
				antFormRef.validate((valid) => {
					if (valid) {
						const data = {
							formList: { ...this.formData },
							formData: { ...this.formData[stepItem.name] },
							step: this.step,
							stepName: stepItem.name
						}
						this.$emit('actionNextSubmit', {
							...data,
							action: this.action
						})
					}
				})
		}
	},
	created() {
		this.formData = initListData(this.formList, this.echoFormList) // 数据回显，从props中引入
	}
}
</script>

<style scoped lang="less">
.base_form {
	/deep/ .ant-form {
		.ant-form-explain {
			font-size: 10px;
		}
	}
}
</style>
