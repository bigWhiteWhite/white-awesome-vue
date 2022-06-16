<template>
	<div class="base_card">
		<el-row :gutter="16" v-bind="layout.layoutRow">
			<el-col v-bind="layout.content" v-for="item in cardList" :key="item.key">
				<template v-if="item.type === 'default'">
					<el-card class="box-card">
						<template #default>
							<slot :name="item.key">
								<a-col v-bind="item.itemLayout" v-for="child in item.contentList" :key="child.title">
									{{ child.title }}:
									{{ child.text }}
								</a-col>
							</slot>
						</template>
					</el-card>
				</template>
				<template v-else>
					<el-card v-bind="item.cardOption" :tab-list="item.tabList" :active-tab-key="key">
						<!-- 可以切换的信息项 -->
						<template #default>
							<slot :name="item.key">
								<p>{{ item.contentList }}</p>
							</slot>
						</template>
					</el-card>
				</template>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
	name: 'EleBaseCard',
	props: {
		cardList: {
			type: Array,
			default: () => []
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
			key: 1
		}
	}
}
</script>

<style scoped lang="less">
.base_card {
	margin: 20px 0;
}
</style>
