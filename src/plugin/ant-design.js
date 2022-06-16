/**
 * @hhj
 * 后期会筛查一些不需要作为全局组件的，在页面手动引用
 */
import Vue from 'vue'
import 'ant-design-vue/dist/antd.css'
import {
	Upload,
	Radio,
	DatePicker,
	Checkbox,
	Icon,
	Button,
	Card,
	Table,
	Pagination,
	Form,
	Input,
	Tabs,
	Col,
	Row,
	Modal,
	Select,
	Spin,
	FormModel,
	InputNumber,
	TimePicker
} from 'ant-design-vue'
;[
	Upload,
	Radio,
	Radio.Group,
	DatePicker,
	DatePicker.RangePicker,
	Checkbox,
	Checkbox.Group,
	Icon,
	Button,
	Card,
	Card.Grid,
	Card.Meta,
	Table,
	Pagination,
	Form,
	Form.Item,
	Input,
	Input.Group,
	Input.TextArea,
	Input.Search,
	Tabs,
	Tabs.TabPane,
	Col,
	Row,
	Modal,
	Select,
	Select.Option,
	Spin,
	FormModel,
	InputNumber,
	TimePicker
].forEach((_) => {
	Vue.use(_)
})

Vue.prototype.$form = Form
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$info = Modal.info
Vue.prototype.$error = Modal.error
