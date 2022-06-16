<template>
	<div class="base_form">
		<el-form ref="elFormRef" :model="value" :label-width="labelProps.labelWidth" :rules="rules" :label-position="labelProps.labelPosition">
			<el-row v-bind="layout.topTitle" v-if="layout.topTitle">
				<slot name="topTitle"></slot>
			</el-row>
			<el-row :gutter="16" v-bind="layout.layoutRow">
				<el-row v-bind="layout.leftTitle" v-if="layout.leftTitle">
					<slot name="leftTitle"></slot>
				</el-row>
				<template>
					<el-col class="form_col" v-bind="layout.colLayout" v-for="formItem in formMain" :key="formItem.value">
						<el-form-item :prop="formItem.value" :label="$t(formItem.label)" :style="itemStyle" class="form_item">
							<!-- ?输入框-->
							<template v-if="formItem.type === 'input' || formItem.type === 'password'">
								<el-input
									clearable
									v-bind="formItem.itemOptions"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									:show-password="formItem.type === 'password'"
									:value="value[formItem.value]"
									@input="handleValueChange($event, formItem.value, formItem.RegExp)"
									@focus="inputFocus(formItem.value)"
								/>
							</template>
							<!-- ?输入框数字类型-->
							<template v-else-if="formItem.type === 'inputNum'">
								<el-input
									clearable
									v-bind="formItem.itemOptions"
									style="width: 100%"
									v-model.number="value[formItem.value]"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									:show-password="formItem.type === 'password'"
									@focus="inputFocus(formItem.value)"
								/>
							</template>
							<!-- ?数字输入框 -->
							<template v-else-if="formItem.type === 'inputNumber'">
								<el-input-number
									v-bind="formItem.itemOptions"
									style="width: 100%"
									:placeholder="formItem.placeholder"
									:value="value[formItem.value]"
									@input="handleValueChange($event, formItem.value, formItem.RegExp)"
									@focus="inputFocus(formItem.value)"
								/>
							</template>
							<!-- ?联想输入框 -->
							<template v-else-if="formItem.type === 'autocomplete'">
								<el-autocomplete
									clearable
									v-model="value[formItem.value]"
									v-bind="formItem.itemOptions"
									:placeholder="formItem.placeholder"
									:fetch-suggestions="formItem.autoTips"
									:trigger-on-focus="formItem.move || false"
									@focus="inputFocus(formItem.value)"
								></el-autocomplete>
							</template>
							<!-- ?选择框 -->
							<template v-else-if="formItem.type === 'select'">
								<el-select
									clearable
									v-model="value[formItem.value]"
									v-bind="formItem.itemOptions"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									@change="handleSelectChange($event, formItem.value)"
								>
									<el-option v-for="option in formItem.options" :key="option.value" :label="$t(option.label)" :value="option.value"></el-option>
								</el-select>
							</template>
							<!-- ?级联选择框 -->
							<template v-else-if="formItem.type === 'cascader'">
								<el-cascader
									v-bind="formItem.itemOptions"
									:options="formItem.options"
									:value="value[formItem.value]"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									@change="handleCascaderChange($event, formItem.value)"
								/>
							</template>
							<!-- ?时间选择框 -->
							<template v-else-if="formItem.type === 'datePicker'">
								<el-date-picker
									clearable
									style="width: 100%"
									v-bind="formItem.itemOptions"
									v-model="value[formItem.value]"
									:placeholder="formItem.placeholder"
								></el-date-picker>
							</template>
							<!-- ?表单插槽 -->
							<template v-else-if="formItem.type === 'slot'">
								<slot :name="formItem.value"></slot>
							</template>
						</el-form-item>
					</el-col>
				</template>
			</el-row>
		</el-form>

		<div class="footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'EleBaseForm',
	emits: ['input', 'cascaderUpdate', 'selectUpdate', 'inputFocus'],
	props: {
		step: {
			type: Number,
			default: 1
		},
		value: {
			type: Object,
			required: true
		},
		formMain: {
			type: Array,
			required: true
		},
		disabledList: {
			type: Array,
			default: () => []
		},
		labelProps: {
			type: Object,
			default: () => ({
				labelWidth: '150px', // 输入框所占的宽度
				labelPosition: 'left'
			})
		},
		layout: {
			type: Object,
			default: () => ({
				topTitle: { xl: 4 },
				colLayout: { xl: 6, lg: 6, md: 6, sm: 24, xs: 24 }
			})
		},
		itemStyle: {
			type: Object,
			default: () => ({ padding: '5px 0' })
		},
		rules: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			validValue: '',
			validNumValue: null
		}
	},
	computed: {
		elFormRef() {
			return this.$refs.elFormRef || {}
		},
		handleValueChange() {
			return (value, key, RegExp) => {
				let result = value
				if (RegExp) {
					if (RegExp.test(value)) this.validValue = value
					result = this.validValue
				}
				this.$emit('input', { ...this.value, [key]: result })
			}
		},
		handleSelectChange() {
			// 选择器
			return (value, key) => {
				return this.$emit('selectUpdate', { value, key, step: this.step })
			}
		},
		handleCascaderChange() {
			// 级联选择器
			return (value, key) => {
				return this.$emit('cascaderUpdate', { value, key, step: this.step })
			}
		}
	},
	methods: {
		inputFocus(name) {
			return this.$emit('inputFocus', name)
		}
	}
}
</script>

<style scoped lang="less">
.base_form {
	.form_col {
		height: 75px; // 高度设置好，不然会出现校验的时候错位
	}
	.drop-down-Style {
		width: auto !important; // 可以让选择框的宽度自适应
	}
}
</style>
