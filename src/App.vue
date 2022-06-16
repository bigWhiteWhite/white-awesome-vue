<template>
	<div>
		<search-form :initForm="customSearchConfig" query-name="test"></search-form>
	</div>
</template>
<script>
import { SearchForm } from './package/ant-form'
import { customSearchConfig } from './test'
export default {
	components: {
		SearchForm
	},
	data() {
		return {
			customSearchConfig
		}
	}
}
</script>
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
