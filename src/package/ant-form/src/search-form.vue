<template>
	<base-form v-bind="initForm" v-model="formData" ref="baseFormRef">
		<!-- 搜索重置按钮插槽 -->
		<template #footer>
			<a-row :gutter="16" type="flex" justify="space-between">
				<slot name="add"></slot>
				<a-col v-bind="initForm.footerLayout">
					<div class="footer">
						<a-button @click="reset">{{ $t('operate.reset') }}</a-button>
						<a-button class="mar_right" type="primary" @click="search">
							{{ $t('operate.search') }}
						</a-button>
					</div>
				</a-col>
			</a-row>
		</template>
	</base-form>
</template>

<script>
import BaseForm from './base-form.vue'
import { initData } from '@/utils/ant-fun'
export default {
	name: 'SearchForm',
	components: {
		BaseForm
	},
	props: {
		queryName: {
			type: String,
			require: true
		},
		initForm: {
			type: Object,
			require: true
		},
		// 回显表单数据
		echoForm: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			formData: {}
		}
	},
	emits: ['reset', 'submit'],
	computed: {
		initToArr() {
			// 要初始化为空数组的值
			return this.initForm.formMain.filter((item) => {
				return item.type === 'rangePicker'
			})
		}
	},
	methods: {
		setFormData(name, value) {
			this.$set(this.formData, name, value)
		},
		reset() {
			// 有一些表单的初始值为空数组
			const initToArr = this.initToArr.map((_) => _.value)
			for (const item in this.formData) {
				if (initToArr.includes(item)) {
					this.$set(this.formData, item, [])
				} else {
					this.$set(this.formData, item, '')
				}
			}
			this.$emit('reset')
		},
		search() {
			const { antFormRef } = this.$refs.baseFormRef
			antFormRef.validate((valid) => {
				if (valid) {
					// 点击触发事件总线发送事件
					this.$bus.$emit(this.queryName, this.formData)
					this.$emit('submit')
				} else {
					console.log('this.formData: noValid', this.formData)
				}
			})
		}
	},
	created() {
		this.formData = initData(this.initForm.formMain, this.echoForm) // 数据回显，从props中引入
		// 挂载事件总线,使用数据总线传递数据
		console.log(this.$bus.$emit)
		this.$bus.$emit(this.queryName, this.formData)
	}
}
</script>

<style scoped lang="less">
.footer {
	.mar_right {
		margin-left: 20px;
	}
}
</style>
