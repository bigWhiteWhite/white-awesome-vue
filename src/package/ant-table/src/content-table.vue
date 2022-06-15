<template>
	<div class="content_table_container">
		<a-spin :spinning="loading">
			<base-table
				ref="baseTableRef"
				v-bind="initTable"
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
						<a-button type="link">编辑</a-button>
						<a-button type="link">详情</a-button>
					</slot>
				</template>

				<!-- 动态插槽,需要使用的页面根据slotName,插入 -->
				<template v-for="item in trendsSlots" #[item.dataIndex]="scope">
					<slot :name="item.dataIndex" :row="scope.row"></slot>
				</template>
			</base-table>
		</a-spin>
	</div>
</template>

<script>
import BaseTable from './base-table.vue'
export default {
	name: 'ContentTable',
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
			default: () => ''
		},
		initTable: {
			type: Object,
			require: true
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
			const slots = this.initTable.columns.filter((item) => {
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
			const res = await this.$api(this.apiQuery.url, data, 'post', true)
			const list = this.handleData(res.list)
			this.listData = { data: list, total: res.total }
			this.loading = false
		},
		async deleteBtnClick() {},
		// 分页器刷新表格,判断是否使用缓存查询
		updatePage(_) {
			const { pageIndex, pageSize } = _
			this.pageArg = { pageIndex, pageSize }
			this.init()
		},
		updateSelect(_) {
			console.log(_, '选择序号改变了')
		}
	},
	created() {
		// 事件总线获取搜索表单最新的值
		this.$bus.$on(this.queryName, (_) => {
			this.searchData = _
		})
	},
	mounted() {
		const { pageIndex, pageSize } = this.$refs['baseTableRef'].pageArg
		this.pageArg = { pageIndex, pageSize }
		this.init()
	}
}
</script>

<style scoped lang="less"></style>
