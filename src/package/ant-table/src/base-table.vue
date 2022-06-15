<template>
	<div class="base-table">
		<a-row v-bind="layout.topTitle" v-if="layout.topTitle">
			<slot name="topTitle"></slot>
		</a-row>
		<a-row :gutter="16" v-bind="layout.layoutRow">
			<a-col v-bind="layout.leftTitle" v-if="layout.leftTitle">
				<slot name="leftTitle"></slot>
			</a-col>

			<a-col v-bind="layout.content">
				<a-config-provider :locale="locale">
					<template #renderEmpty></template>
					<a-table
						v-if="listData"
						class="antTable"
						ref="antTableRef"
						:rowKey="rowKey"
						:data-source="listData"
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
							v-bind="item.columnOption"
						>
							<template #default="key, scope">
								<slot :name="item.dataIndex" :row="scope">
									{{ $t(key) || key }}
								</slot>
							</template>
						</a-table-column>
					</a-table>
				</a-config-provider>
			</a-col>
		</a-row>
		<!-- 底部分页器 -->
		<div class="footer">
			<slot name="footer">
				<a-pagination
					v-if="tableShowList.paginationOptions"
					v-bind="tableShowList.paginationOptions"
					show-size-changer
					:defaultCurrent="pageArg.pageIndex"
					:page-size="pageArg.pageSize"
					:page-size-options="pageArg.pageSizes"
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
	name: 'BaseTable',
	props: {
		rowKey: {
			type: String,
			required: true
		},
		locale: {
			type: Object,
			default: () => zhCN
		},
		listData: {
			// 表格数据
			type: Array,
			default: () => []
		},
		columns: {
			type: Array,
			default: () => []
		},
		total: {
			// 表格总条数
			type: Number,
			default: () => 0
		},
		currentSize: {
			// 当前页和一页条数
			type: Object,
			default: () => ({
				pageIndex: 1,
				pageSize: 10,
				pageSizes: ['10', '20', '30', '40', '50']
			})
		},
		tableShowList: {
			// 是否显示的选项
			type: Object,
			default: () => ({
				paginationOptions: {
					'show-size-changer': true,
					'show-quick-jumper': true
				} // 是否显示footer分页器
			})
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
			pageArg: { ...this.currentSize }
		}
	},
	emits: ['updatePage', 'updateSelect'],
	computed: {
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
		antTableRef() {
			return this.$refs.antTableRef || {}
		},
		indexMethod(index) {
			const { pageIndex, pageSize } = this.pageArg
			return pageIndex !== 1 ? (pageIndex - 1) * pageSize + index + 1 : index + 1
		},
		currentUpdate(pageIndex) {
			this.$set(this.pageArg, 'pageIndex', pageIndex)
			this.$emit('updatePage', {
				...this.pageArg,
				pageIndex,
				typeof: 'updateCurrent'
			})
		},
		sizeUpdate(pageIndex, pageSize) {
			this.$set(this.pageArg, 'pageIndex', pageIndex)
			this.$set(this.pageArg, 'pageSize', pageSize)
			this.$emit('updatePage', {
				...this.pageArg,
				pageSize,
				typeof: 'updateSize'
			})
		},
		selectionUpdate(select) {
			this.$emit('updateSelect', select)
		}
	}
}
</script>

<style scoped lang="less">
.base-table {
	.footer {
		text-align: right;
		padding: 20px 30px 10px 0;
	}
}
</style>
