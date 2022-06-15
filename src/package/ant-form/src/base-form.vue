<template>
	<div class="base_form">
		<a-form-model ref="antFormRef" :model="value" :rules="rules" v-bind="formProps">
			<!-- :label-col="formProps.labelCol"
      :wrapper-col="formProps.wrapperCol"
      :labelAlign="formProps.labelAlign" -->
			<a-row v-bind="layout.topTitle" v-if="layout.topTitle">
				<slot name="topTitle"></slot>
			</a-row>
			<a-row :gutter="16" v-bind="layout.layoutRow">
				<a-col v-bind="layout.leftTitle" v-if="layout.leftTitle">
					<slot name="leftTitle"></slot>
				</a-col>

				<template>
					<a-col class="form_col" v-bind="layout.content" v-for="(formItem, index) in formMain" :key="formItem.value">
						<a-form-model-item
							class="form_item"
							v-show="formItem.dynamicShow !== 'hide'"
							:class="formItem.class"
							:prop="formItem.value"
							:label="$t(formItem.label)"
							:style="itemStyle"
						>
							<!-- ?输入框-->
							<template v-if="formItem.type === 'input' || formItem.type === 'password'">
								<a-input
									allowClear
									v-bind="formItem.itemOptions"
									style="width: 100%"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									:show-password="formItem.type === 'password'"
									:value="value[formItem.value]"
									@input="handleValueChange($event, formItem.value, formItem.RegExp)"
								/>
							</template>
							<!-- ?数字输入框 -->
							<template v-else-if="formItem.type === 'inputNum'">
								<a-input
									allowClear
									v-model.number="value[formItem.value]"
									v-bind="formItem.itemOptions"
									style="width: 100%"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									:show-password="formItem.type === 'password'"
									@focus="inputFocus(formItem.value)"
									@input="formItem.inputRule && formItem.inputRule(value[formItem.value], formItem.value, ...formItem.ruleVariate, index)"
								/>
							</template>
							<!-- ?多行输入框 -->
							<template v-else-if="formItem.type === 'textarea'">
								<a-textarea
									allowClear
									v-bind="formItem.itemOptions"
									style="width: 100%"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									:value="value[formItem.value]"
									@input="handleValueChange($event, formItem.value, formItem.RegExp)"
									@focus="inputFocus(formItem.value)"
								/>
							</template>
							<!-- ?数字选择输入框 -->
							<template v-else-if="formItem.type === 'inputNumber'">
								<a-input-number
									v-model="value[formItem.value]"
									v-bind="formItem.itemOptions"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									style="width: 100%"
								/>
							</template>
							<!-- ?联想输入框 -->
							<!-- ?选择框 -->
							<template v-else-if="formItem.type === 'select'">
								<a-select
									clearable
									v-model="value[formItem.value]"
									v-bind="formItem.itemOptions"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									@change="handleSelectChange($event, formItem.value)"
								>
									<!--
                    dropdownClassName: 'drop-down-Style',
                      dropdownMatchSelectWidth: false
                  -->
									<a-select-option
										v-for="option in formItem.options"
										:key="option.label"
										:value="option.value"
										:style="{
											width: '1000px'
										}"
									>
										{{ $t(option.label) }}
									</a-select-option>
								</a-select>
							</template>
							<!-- ?级联选择框 -->
							<template v-else-if="formItem.type === 'cascader'">
								<a-cascader
									v-bind="formItem.itemOptions"
									:options="formItem.options"
									:default-value="value[formItem.value]"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									@change="handleCascaderChange($event, formItem.value)"
								/>
							</template>
							<!-- ?单选框 -->
							<template v-else-if="formItem.type === 'radio'">
								<a-radio-group
									name="radioGroup"
									v-bind="formItem.itemOptions"
									v-model="value[formItem.value]"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
								>
									<a-radio v-for="radio in formItem.radios" :value="radio.value" :key="radio.value">
										{{ $t(radio.label) }}
									</a-radio>
								</a-radio-group>
							</template>
							<!-- ?时间选择框 -->
							<template v-else-if="formItem.type === 'datePicker'">
								<a-time-picker
									clearable
									style="width: 100%"
									v-bind="formItem.itemOptions"
									v-model="value[formItem.value]"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									@change="handleSelectChange($event, formItem.value)"
								></a-time-picker>
							</template>
							<!-- ?时间范围选择框 -->
							<template v-else-if="formItem.type === 'rangePicker'">
								<a-range-picker
									allowClear
									v-bind="formItem.itemOptions"
									v-model="value[formItem.value]"
									:disabled="disabledList.includes(formItem.value) || formItem.disabled"
									@change="handleSelectChange($event, formItem.value)"
								>
								</a-range-picker>
							</template>
							<!-- ?表单插槽 -->
							<template v-else-if="formItem.type === 'slot'">
								<slot :name="formItem.value"></slot>
							</template>
							<!-- ?二次组合框 -->
							<template v-else-if="formItem.type === 'compact'">
								<a-input-group compact>
									<div v-for="compactItem in formItem.compact" :key="compactItem.value">
										<a-select
											v-if="compactItem.type === 'select'"
											clearable
											v-bind="compactItem.compactOptions"
											v-model="compactForm[compactItem.value]"
											@change="handleSelectChange($event, compactItem.value)"
										>
											<a-select-option v-for="option in compactItem.options" :key="option.label" :value="option.value">
												{{ $t(option.label) }}
											</a-select-option>
										</a-select>
										<a-input
											v-else-if="compactItem.type === 'input'"
											allowClear
											style="width: 100%"
											v-bind="compactItem.compactOptions"
											v-model="value[formItem.value]"
										/>
										<a-date-picker
											v-else-if="compactItem.type === 'datePicker'"
											allowClear
											v-bind="compactItem.compactOptions"
											v-model="value[formItem.value]"
											:disabled="disabledList.includes(formItem.value) || compactItem.disabled"
											@change="handleSelectChange($event, formItem.value)"
										>
										</a-date-picker>
										<a-range-picker
											v-else-if="compactItem.type === 'rangePicker'"
											allowClear
											v-bind="compactItem.compactOptions"
											v-model="value[formItem.value]"
											:default-value="value[formItem.value]"
											:disabled="disabledList.includes(formItem.value) || compactItem.disabled"
											@change="handleSelectChange($event, formItem.value)"
										>
											<!-- v-model="compactForm[compactItem.value]" -->
										</a-range-picker>
									</div>
								</a-input-group>
							</template>
						</a-form-model-item>
					</a-col>
				</template>
			</a-row>
		</a-form-model>

		<div class="footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BaseForm',
	emits: ['value', 'cascaderUpdate', 'selectUpdate', 'inputFocus'],
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
		formProps: {
			type: Object,
			default: () => ({
				labelCol: { span: 3, offset: 12 },
				wrapperCol: { span: 4 },
				labelAlign: 'right'
			})
		},
		layout: {
			type: Object,
			default: () => ({
				topTitle: { xl: 4 },
				content: { xl: 7, lg: 6, md: 12, sm: 24, xs: 24 }
			})
		},
		itemStyle: {
			type: Object,
			default: () => ({ padding: '5px 0' })
		},
		rules: {
			type: Object,
			default: () => ({})
		},
		compactInit: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			validValue: '',
			compactForm: { ...this.compactInit }
		}
	},
	computed: {
		antFormRef() {
			return this.$refs.antFormRef || {}
		},
		handleValueChange() {
			return (value, key, RegExp) => {
				let result = value.target.value
				if (RegExp) {
					if (RegExp.test(value)) this.validValue = value.target.value
					result = this.validValue
				}
				this.$emit('input', { ...this.value, [key]: result })
			}
		},
		handleCompactChange() {
			return (value, key) => {
				return this.$emit('value', { ...this.props.value, [key]: value })
			}
		},
		handleSelectChange() {
			// 选择器和时间选择器
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
		},
		setCompactForm({ key = '', value }) {
			if (key) {
				this.$set(this.compactForm, key, value)
			} else {
				this.compactForm = { ...value }
			}
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
	.hasStart {
		// 表单必须输入的星号
		/deep/ .ant-form-item-label {
			label {
				&::before {
					display: inline-block;
					margin-right: 4px;
					color: #f5222d;
					font-size: 14px;
					font-family: SimSun, sans-serif;
					line-height: 1;
					content: '*';
				}
			}
		}
	}
}
</style>
