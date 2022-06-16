import { AntBaseDialog } from './AntDesign/ant-dialog'
import { AntBaseForm, AntSearchForm } from './AntDesign/ant-form'
import { AntBaseUpload, AntCropUpload } from './AntDesign/ant-upload'
import { AntBaseTable, AntContentTable, AntComputedFormTable, AntEditFormTable } from './AntDesign/ant-table'
import { EleBaseDialog } from './Element/el-dialog'
import { EleBaseForm, EleSearchForm } from './Element/el-form'
import { EleBaseUpload } from './Element/el-upload'
import { EleBaseTable, EleContentTable, EleComputedFormTable, EleEditFormTable } from './Element/el-table'
const AntComponents = [
	AntBaseDialog,
	AntBaseForm,
	AntSearchForm,
	AntBaseUpload,
	AntCropUpload,
	AntBaseTable,
	AntContentTable,
	AntComputedFormTable,
	AntEditFormTable
]

const EleComponents = [
	EleBaseDialog,
	EleBaseForm,
	EleSearchForm,
	EleBaseUpload,
	EleBaseTable,
	EleContentTable,
	EleComputedFormTable,
	EleEditFormTable
]

const install = (vue) => {
	// 判断当前组件是否已被安装过，如果已安装过则不再安装
	if (install.installed) return
	install.installed = true

	// 遍历components数组，依次注册每个组件
	AntComponents.map((component) => {
		vue.component(component.name, component)
	})
	EleComponents.map((component) => {
		vue.component(component.name, component)
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	install,
	...AntComponents, //将插件暴露出去，这样可以按需引入
	...EleComponents //将插件暴露出去，这样可以按需引入
}
// 如果只需要部分组件，请使用import {button} from '';
// Vue.component(Button)的语法手动注册组件,这样便可以实现按需引入
