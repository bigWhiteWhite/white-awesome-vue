<template>
	<el-table class="detailTable" ref="detailTableRef" :data="listData" v-bind="tableOptions">
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
</template>

<script>
export default {
	name: 'EleDetailTable',
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
		tableOptions: {
			// 设置表格其他属性
			type: Object,
			default: () => ({})
		}
	}
}
</script>

<style scoped lang="less"></style>
