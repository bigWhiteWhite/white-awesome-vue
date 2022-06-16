<template>
	<div class="base-table">
		<el-row v-bind="layout.topTitle" v-if="layout.topTitle">
			<slot name="topTitle"></slot>
		</el-row>
		<el-row :gutter="16" v-bind="layout.layoutRow">
			<el-col v-bind="layout.leftTitle" v-if="layout.leftTitle">
				<slot name="leftTitle"></slot>
			</el-col>

			<el-col v-bind="layout.content">
				<el-table class="elTable" ref="elTableRef" :data="listData" v-bind="tableOptions" @selection-change="selectionUpdate">
					<!-- 选择栏 -->
					<template v-if="tableShowList.select">
						<el-table-column type="selection" v-bind="tableShowList.select"></el-table-column>
					</template>
					<!-- 序号栏 -->
					<template v-if="tableShowList.index">
						<el-table-column type="index" v-bind="tableShowList.index" :index="indexMethod"></el-table-column>
					</template>
					<!-- 自己传递的数据 -->
					<template>
						<el-table-column
							align="center"
							show-overflow-tooltip
							v-for="item in propList"
							:key="item.prop"
							:prop="item.prop"
							:label="$t(item.label)"
							v-bind="item.columnOption"
						>
							<template #default="scope">
								<slot :name="item.prop" :row="scope.row">
									{{ $t(scope.row[item.prop]) || scope.row[item.prop] }}
								</slot>
							</template>
						</el-table-column>
					</template>
				</el-table>
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
	name: 'EleBaseTable',
	props: {
		listData: {
			// 表格数据
			type: Array,
			default: () => []
		},
		propList: {
			type: Array,
			default: () => []
		},
		total: {
			// 表格总条数
			type: Number,
			default: () => 0
		},
		current_size: {
			// 当前页和一页条数
			type: Object,
			default: () => ({ currentPage: 1, pageSize: 20, pageSizes: [5, 10, 20, 30, 40] })
		},
		tableShowList: {
			// 是否显示的选项
			type: Object,
			default: () => ({
				paginationOptions: {}
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
			pageArg: { ...this.current_size }
		}
	},
	emits: ['updatePage', 'updateSelect'],
	methods: {
		elTableRef() {
			return this.$refs.elTableRef || {}
		},
		indexMethod(index) {
			const { currentPage, pageSize } = this.pageArg
			return currentPage !== 1 ? (currentPage - 1) * pageSize + index + 1 : index + 1
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
		}
	}
}
</script>

<style scoped lang="less">
.base-table {
	border-top: 20px solid #f0f2f5;
	padding: 20px;
	.footer {
		text-align: right;
		padding: 20px 30px 10px 0;
	}
}
</style>
