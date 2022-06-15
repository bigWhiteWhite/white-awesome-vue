<template>
	<div class="base-table">
		<a-row v-bind="layout.topTitle" v-if="layout.topTitle">
			<slot name="topTitle"></slot>
		</a-row>
		<a-row class="table-content">
			<a-col v-bind="layout.leftTitle" v-if="layout.leftTitle">
				<slot name="leftTitle"></slot>
			</a-col>

			<a-col v-bind="layout.content">
				<a-form-model ref="mainFormRef" :model="mainForm">
					<a-config-provider :locale="locale">
						<template #renderEmpty></template>
						<a-table
							class="antTable"
							:data-source="mainForm.infoList"
							:rowKey="rowKey"
							:row-selection="selection"
							:pagination="false"
							v-bind="tableOptions"
						>
							<a-table-column
								align="center"
								v-for="item in columns"
								:key="item.dataIndex"
								:data-index="item.dataIndex"
								:title="$t(item.title)"
								:min-width="item.minWidth"
								:width="item.width"
							>
								<template #default="key, scope, index">
									<slot :name="item.dataIndex" :row="scope">
										<a-col class="form_col">
											<a-form-model-item :rules="tableForm.rules[item.dataIndex] || []" :prop="`infoList.${index}.${item.dataIndex}`">
												<template v-if="getInputType(item.dataIndex, 'input') || getInputType(item.dataIndex, 'password')">
													<a-input allowClear v-bind="formMain[item.dataIndex].itemOptions" v-model="scope[item.dataIndex]" />
												</template>
												<template v-else>
													{{ key }}
												</template>
											</a-form-model-item>
										</a-col>
									</slot>
								</template>
							</a-table-column>
						</a-table>
					</a-config-provider>
				</a-form-model>
			</a-col>
		</a-row>
		<!-- 底部分页器 -->
		<div class="footer">
			<slot name="footer">
				<a-pagination
					v-if="tableShowList.paginationOptions"
					v-bind="tableShowList.paginationOptions"
					:defaultCurrent="current_size.pageIndex"
					:page-size="current_size.pageSize"
					:page-size-options="current_size.pageSizes"
					:total="total"
					@change="currentUpdate"
					@showSizeChange="sizeUpdate"
				>
				</a-pagination>
			</slot>
		</div>
	</div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
	name: 'EditFormTable',
	props: {
		rowKey: {
			// 列的唯一标识
			type: String,
			required: true
		},
		locale: {
			type: Object,
			default: () => zhCN
		},
		tableForm: {
			// 表格里面的表单组件
			type: Object,
			default: () => ({
				rules: {}
			})
		},
		listData: {
			type: Array,
			default: () => []
		},
		columns: {
			type: Array,
			default: () => []
		},
		total: {
			type: Number,
			default: () => 0
		},
		current_size: {
			type: Object,
			default: () => ({
				currentPage: 1,
				pageSize: 10,
				pageSizeOptions: [5, 10, 20, 30, 40]
			})
		},
		tableShowList: {
			// 是否显示的选项
			type: Object,
			default: () => ({})
		},
		tableOptions: {
			// 设置表格其他属性
			type: Object,
			default: () => ({})
		},
		layout: {
			type: Object,
			default: () => ({
				content: { span: 24 }
			})
		}
	},
	data() {
		return {
			mainForm: {
				infoList: []
			},
			pageArg: { ...this.current_size }
		}
	},
	watch: {
		// 回显数据
		listData(newData) {
			this.$set(this.mainForm, 'infoList', newData)
		}
	},
	emits: ['updatePage', 'updateSelect'],
	computed: {
		formMain() {
			return this.tableForm.formMain || {}
		},
		selection() {
			return this.tableShowList.select
				? {
						...this.tableShowList.select,
						onChange: this.selectionUpdate()
				  }
				: null
		}
	},
	methods: {
		getInputType(name, type) {
			// 获取输入框类型，记得过滤掉handle这种不存在的
			return this.formMain[name] ? this.formMain[name].type === type : false
		},
		currentUpdate(pageIndex) {
			this.pageArg.pageIndex = pageIndex
			this.$emit('updatePage', {
				...this.pageArg,
				pageIndex
			})
		},
		sizeUpdate(pageIndex, pageSize) {
			this.pageArg.pageSize = pageSize
			this.pageArg.pageIndex = pageIndex
			this.$emit('updatePage', {
				...this.pageArg,
				pageSize
			})
		},
		selectionUpdate(select) {
			this.$emit('updateSelect', select)
		},
		// 增加删除单元格 --> _:如果是添加，则为数据，如果是删除，则为key
		handleAddDelete(action = 'add', _) {
			const infoList = this.mainForm.infoList // count
			if (action === 'add') {
				this.$set(this.mainForm, 'infoList', [...infoList, _])
			} else if (action === 'delete') {
				console.log(infoList, _)
				const data = infoList.filter((item) => item[this.rowKey] !== _)
				this.$set(this.mainForm, 'infoList', data)
			}
		},
		submit() {
			const { mainFormRef = {} } = this.$refs
			let data = false
			mainFormRef.validate((valid) => {
				data = valid ? this.mainForm : false
			})
			return data
		}
	},
	mounted() {
		this.$set(this.mainForm, 'infoList', this.listData)
	}
}
</script>

<style scoped lang="less">
.base-table {
	.footer {
		text-align: right;
		padding: 20px 30px 10px 0;
	}
	/deep/ .ant-form {
		.ant-table-body {
			.ant-table-tbody {
				.ant-table-row {
					td {
						padding: 0 16px;
						.form_col {
							height: 78px; // 高度设置好，不然会出现校验的时候错位
						}
						.ant-form-item {
							top: 50%;
							transform: translateY(-50%);
							.ant-form-item-control-wrapper {
								.ant-form-item-control {
									height: 78px; // 高度设置好，不然会出现校验的时候错位
									line-height: 78px;
									.ant-form-explain {
										margin-top: -20px;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
