<template>
	<div class="content_table_container">
		<base-table
			ref="baseTableRef"
			v-bind="initTable"
			v-loading="loading"
			element-loading-spinner="el-icon-loading"
			:listData="listData.data"
			:total="listData.total"
			@updatePage="updatePage"
			@updateSelect="updateSelect"
		>
			<!-- 头部插槽 -->
			<template #header>
				<slot name="header"></slot>
			</template>
			<!-- 编辑删除按钮列插槽 -->
			<template #handle="scope">
				<slot name="handle" :row="scope.row">
					<el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
					<el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
				</slot>
			</template>

			<!-- 动态插槽,需要使用的页面根据prop,插入 -->
			<template v-for="item in trendsSlots" #[item.prop]="scope">
				<slot :name="item.prop" :row="scope.row"></slot>
			</template>
		</base-table>
	</div>
</template>

<script>
import BaseTable from './base-table.vue'
export default {
	name: 'EleContentTable',
	props: {
		// 回显数据处理
		handleData: {
			type: Function,
			default: (_) => _
		},
		// 表单搜索数据处理
		searchHandleData: {
			type: Function,
			default: (_) => _
		},
		apiQuery: {
			type: Object,
			required: true
		},
		queryName: {
			// 搜索表单的标识
			type: String,
			default: 'search_test'
		},
		initTable: {
			type: Object,
			require: true
		},
		isNeedStorage: {
			// 是否需要使用vuex中的搜索参数初始化表格
			type: Boolean,
			default: false
		}
	},
	components: {
		BaseTable
	},
	data() {
		return {
			loading: false,
			listData: {
				data: [],
				total: 0
			},
			searchData: {},
			pageArg: {}
		}
	},
	computed: {
		trendsSlots() {
			// 返回组件插槽，过滤掉'操作'插槽
			const useLess = ['handle']
			const slots = this.initTable.propList.filter((item) => {
				return !useLess.includes(item.dataIndex)
			})
			return slots
		}
	},
	methods: {
		// 初始化表格
		async init() {
			const searchData = this.searchHandleData(this.searchData)
			this.loading = true
			const data = {
				...searchData,
				...this.apiQuery.data,
				pagination: { ...this.pageArg }
			}
			const { funName = 'mockTable', module = 'mock' } = this.apiQuery
			const api = this.$axios[module]
			const res = await api[funName](data)
			const list = this.handleData(res.list)
			this.listData = { data: list, total: res.total }
			this.loading = false
		},
		// 分页器刷新表格,判断是否使用缓存查询
		updatePage(_) {
			const { currentPage, pageSize } = _
			this.pageArg = { currentPage, pageSize }
			this.init()
		},
		updateSelect(_) {
			this.$emit('updateSelect', { queryName: this.queryName, index: _ })
		}
	},
	mounted() {
		const { currentPage, pageSize } = this.$refs['baseTableRef'].pageArg
		this.pageArg = { currentPage, pageSize }
		this.init()
		// 事件总线获取搜索表单最新的值
		this.$bus.$on(this.queryName, (_) => {
			this.searchData = _
			this.init()
		})
	},
	beforeDestroy() {
		this.$bus.$off(this.queryName)
	}
}
</script>

<style scoped lang="less"></style>
