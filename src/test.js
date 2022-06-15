export const customSearchConfig = {
	formProps: {
		labelCol: { span: 6 }, // 表单项中标题所占的宽度
		wrapperCol: { span: 18 }, // 输入框所占的宽度
		labelAlign: 'left'
	},
	formMain: [
		{
			value: 'appId',
			type: 'select',
			label: 'setProduct.appId'
		},
		{
			value: 'sendTime',
			type: 'rangePicker',
			label: 'instationMessage.sendTime'
		}
	]
}
