<template>
	<div class="detail_container">
		<el-row>
			<el-col v-for="item in detailTabs" :key="item.name">
				<el-tabs v-model="tabsModel[item.key]">
					<el-tab-pane :label="$t(tItem.label)" :name="tItem.name" v-for="tItem in item.tabList" :key="tItem.name">
						<detail-table v-if="tItem.type === 'detailTable'" v-bind="tItem.tableSetting">
							<!-- 动态插槽,需要使用的页面根据prop,插入 -->
							<template v-for="item in trendsSlots(tItem.tableSetting)" #[item.prop]="scope">
								<slot :name="`${tItem.name}${item.prop}Table`" :row="scope.row"></slot>
							</template>
						</detail-table>

						<el-descriptions v-bind="item.descriptOptions" v-else>
							<el-descriptions-item v-for="cItem in tItem.decItemList" :key="cItem.value" :label="$t(cItem.label)">{{
								cItem.value
							}}</el-descriptions-item>
						</el-descriptions>
					</el-tab-pane>
				</el-tabs>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { DetailTable } from '../../el-table/index'
export default {
	name: 'ElDetailTabs',
	props: {
		detailTabs: {
			type: Array,
			required: true
		}
	},
	components: {
		DetailTable
	},
	data() {
		return {
			tabsModel: {}
		}
	},
	methods: {
		trendsSlots(_) {
			// 返回组件插槽，过滤掉'操作'插槽
			const useLess = ['handle']
			const slots = _.propList.filter((item) => {
				return !useLess.includes(item.dataIndex)
			})
			return slots
		}
	},
	mounted() {
		this.detailTabs.forEach((item) => {
			this.$set(this.tabsModel, item.key, item.name)
		})
	}
}
</script>

<style scoped lang="less">
.detail_container {
	/deep/ .el-row {
		.el-col {
			.el-tabs {
				.el-tabs__header {
					margin-bottom: 20px;
				}
			}
		}
	}
}
</style>
