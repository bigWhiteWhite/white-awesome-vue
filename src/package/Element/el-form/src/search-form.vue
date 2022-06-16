<template>
	<base-form v-bind="initForm" v-model="formData" ref="baseFormRef">
		<!-- 搜索重置按钮插槽 -->
		<template #footer>
			<el-row :gutter="16" type="flex" justify="end">
				<slot name="add"></slot>
				<el-col v-bind="initForm.footerLayout">
					<div class="footer" style="text-align: right">
						<el-button @click="reset"><i class="el-icon-refresh-right"></i>{{ $t('operate.reset') }}</el-button>
						<el-button class="mar_right" type="primary" @click="search"><i class="el-icon-search"></i>{{ $t('operate.search') }}</el-button>
					</div>
				</el-col>
			</el-row>
		</template>
	</base-form>
</template>

<script>
import BaseForm from './base-form.vue'
import { initData } from '@/utils/element-fun'
export default {
	name: 'EleSearchForm',
	components: {
		BaseForm
	},
	props: {
		queryName: {
			type: String,
			default: 'search_test'
		},
		initForm: {
			type: Object,
			require: true
		},
		// 回显表单数据
		echoForm: {
			type: Object,
			default: () => ({})
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
			const { elFormRef = {} } = this.$refs.baseFormRef
			elFormRef.validate((valid) => {
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
		this.$bus.$emit(this.queryName, this.formData)
	},
	beforeDestroy() {
		this.$bus.$off(this.queryName)
	}
}
</script>

<style scoped lang="less">
.base_form {
	.mar_right {
		margin-left: 20px;
	}
}
</style>
