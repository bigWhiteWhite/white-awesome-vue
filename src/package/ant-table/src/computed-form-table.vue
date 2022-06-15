<template>
	<div class="computed_table_container">
		<edit-form-table
			rowKey="uniqueId"
			ref="editFormTableRef"
			v-bind="initTable"
			action="edit"
			:listData="listData"
			:total="initData.total"
			@updateSelect="updateSelect"
		>
			<!-- 头部插槽 -->
			<template #leftTitle>
				<slot name="leftTitle">
					<div>
						<p style="font-size: 16px">{{ $t('operate.headName') }}</p>
						<a-button type="primary" @click="handleAddDelete('add')">
							<a-icon type="plus" />
						</a-button>
					</div>
				</slot>
			</template>
			<!-- 编辑删除按钮列插槽 -->
			<template #handle="scope">
				<slot name="handle" :row="scope.row">
					<a-button type="danger" @click="handleAddDelete('delete', scope.row.uniqueId)">
						<a-icon type="delete" />
					</a-button>
				</slot>
			</template>

			<!-- 动态插槽,需要使用的页面根据slotName,插入 -->
			<template v-for="item in trendsSlots" #[item.dataIndex]="scope">
				<slot :name="item.dataIndex" :row="scope.row"></slot>
			</template>
		</edit-form-table>
	</div>
</template>

<script>
import _uniqueId from 'lodash/uniqueId'
import EditFormTable from './edit-form-table.vue'
export default {
	name: 'ComputedFormTable',
	props: {
		initData: {
			type: Object,
			default: () => ({
				data: [],
				total: 0
			})
		},
		initTable: {
			type: Object,
			require: true
		}
	},
	components: {
		EditFormTable
	},
	computed: {
		trendsSlots() {
			// 返回组件插槽，过滤掉'操作'插槽
			const useLess = ['handle']
			const slots = this.initTable.columns.filter((item) => {
				return !useLess.includes(item.dataIndex)
			})
			return slots
		},
		// 对回显的数据添加唯一标识
		listData() {
			const { data = [] } = this.initData
			const listData = data.map((item) => {
				const uniqueId = _uniqueId()
				return { ...item, uniqueId }
			})
			return listData
		}
	},
	methods: {
		// 获取表格数据
		getList() {
			const list = this.$refs['editFormTableRef'].submit()
			return list
		},
		updateSelect(_) {
			console.log(_, '选择序号改变了')
		},
		submitForm() {
			const { mainForm = {} } = this.$refs['editFormTableRef']
			return mainForm
		},
		handleAddDelete(action = 'add', _) {
			// 在这里添加唯一标识
			if (action === 'add') {
				const uniqueId = _uniqueId()
				const data = { ..._, uniqueId }
				this.$refs['editFormTableRef'].handleAddDelete(action, data)
			} else {
				this.$refs['editFormTableRef'].handleAddDelete(action, _)
			}
		}
	}
}
</script>

<style scoped lang="less">
.computed_table_container {
	/deep/ .ant-form {
		.ant-form-explain {
			font-size: 10px;
		}
	}
}
</style>
