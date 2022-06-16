<template>
	<div class="edit_form_table">
		<el-row v-bind="layout.topTitle" v-if="layout.topTitle">
			<slot name="topTitle"></slot>
		</el-row>
		<el-row class="table-content">
			<el-col v-bind="layout.leftTitle" v-if="layout.leftTitle">
				<slot name="leftTitle"></slot>
			</el-col>

			<el-col v-bind="layout.content">
				<el-form :model="mainForm" ref="mainFormRef">
					<el-table :data="mainForm.infoList" v-bind="tableOptions" @selection-change="selectionUpdate">
						<el-table-column
							align="center"
							v-for="item in columns"
							:key="item.prop"
							:prop="item.prop"
							:label="$t(item.label)"
							v-bind="item.columnOption"
						>
							<template #default="scope">
								<slot :name="item.prop" :row="scope.row">
									<a-col class="form_col">
										<el-form-item :prop="`infoList.${scope.$index}.${item.prop}`" :rules="tableForm.rules[item.prop] || []">
											<template v-if="getInputType(item.dataIndex, 'input') || getInputType(item.dataIndex, 'password')">
												<el-input allowClear v-model="scope[item.prop]" v-bind="formMain[item.prop].itemOptions"></el-input>
											</template>
										</el-form-item>
									</a-col>
								</slot>
							</template>
						</el-table-column>
					</el-table>
				</el-form>
			</el-col>
		</el-row>
		<!-- 底部分页器 -->
		<div class="footer">
			<slot name="footer">
				<el-pagination
					v-if="tableShowList.paginationOptions"
					v-bind="tableShowList.paginationOptions"
					layout="total, sizes, prev, pager, next, jumper"
					:currentPage="pageArg.currentPage"
					:page-size="pageArg.pageSize"
					:page-sizes="pageArg.pageSizes"
					:total="total"
					@current-change="currentUpdate"
					@size-change="sizeUpdate"
				>
				</el-pagination>
			</slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'EleEditFormTable',
	props: {
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
		}
	},
	methods: {
		getInputType(name, type) {
			// 获取输入框类型，记得过滤掉handle这种不存在的
			return this.formMain[name] ? this.formMain[name].type === type : false
		},
		currentUpdate(currentPage) {
			this.$set(this.pageArg, 'currentPage', currentPage)
			this.$emit('updatePage', { ...this.pageArg, currentPage })
		},
		sizeUpdate(pageSize) {
			this.$set(this.pageArg, 'pageSize', pageSize)
			this.$emit('updatePage', { ...this.pageArg, pageSize })
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

<style scoped lang="less"></style>
