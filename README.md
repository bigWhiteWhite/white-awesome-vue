# Ant-design

## 基础组件

### base-form

基础表单组件，可以扩展成搜索表单，也可以用作添加和编辑，只要配置好传入值

#### 示例

```vue
<base-form v-bind="initForm" v-model="formData" ref="baseFormRef">
    <!-- 搜索重置按钮插槽 -->
    <template #footer>
      <a-row :gutter="16" type="flex" justify="space-between">
        <slot name="add">添加</slot>
        <a-col v-bind="initForm.footerLayout">
          <div class="footer">
            <a-button @click="reset('formData')">重置</a-button>
            <a-button class="mar_right" type="primary" @click="search">搜索</a-button>
          </div>
        </a-col>
      </a-row>
    </template>
</base-form>
<script>
export default {
  data () {
    return {
      formData: {}
    }
  }
}
</script>
```

#### 插槽

- 上方标题插槽
- 左边标题插槽
- 底部插槽，可以插入按钮

#### props

```js
  props: {
    step: { // 在弹窗添加时可以会有几个步骤，一个步骤可能会配置一个表单，step用来标识这是第几步的表单
      type: Number,
      default: 1
    },
    value: { // 双向绑定触发的value
      type: Object,
      required: true
    },
    formMain: { // 表单项的配置[{value, type, label, options}]
      // value:字段名
      // type:表单项类型(input,inputNum,password,select,cascader )
      // label:显示label, itemOptions:其他的表单项配置(style,)
      // options:选择框选项
      type: Array,
      required: true
    },
    disabledList: { // 禁止输入的表单项
      type: Array,
      default: () => []
    },
    labelProps: { // 表单项里面布局
      type: Object,
      default: () => ({
        labelCol: { span: 3, offset: 12 }, // 表单项左边标题所占空间,总数24
        wrapperCol: { span: 4 },// 表单项右边输入框所占空间
        labelAlign: 'right'// 表单项左边标题对齐方向
      })
    },
    layout: { // 表单项之间的布局
      type: Object,
      default: () => ({
        // 以下4个属性都使用v-bind,可以额外添加其他属性，例如style或者组件文档中的其他属性
        // a-row: 可以设置表单项是否启用flex布局,或者整一个实例所占的空间为多少
        layoutRow: { type: 'flex', justify="center", span: 24 } // start;end;space-between;space-around
		// a-row: 表单标题如果在上面的布局，占据一行的多少宽度
        topTitle: { xl: 4 },
        // a-col: 表单标题如果在左边的布局，占据一行的多少宽度
        leftTitle:{ xl: 4 },
        // a-col: 每一个表单项外面布局,也就是每一个表单项占据表单一行的多少，总数24，span为8,也就是一行有3个表单项
        content: { xl: 7, lg: 6, md: 12, sm: 24, xs: 24 }
        // 在这里设置style固定每一个表单项的高度,不然校验的时候会偏移(一般不在这里设置)
      })
    },
    itemStyle: {
      type: Object,
      default: () => ({ padding: '5px 0', height: '55px' })
    },
    rules: {
      // 每一个表单项的校验规则
      type: Object,
      default: () => ({
          Id: [required: true,message: 'Please input the Id',trigger: 'change']
      })
    }
  },
```

#### emit

```js
emits: ['value', 'cascaderUpdate', 'selectUpdate', 'inputFocus']
// value 双向绑定
// cascaderUpdate级联选择器发生变化
// selectUpdate 选择器发生变化
// inputFocus 输入框聚焦
```

#### computed

```js
  computed: {
    antFormRef () {
      // 返回表单ref组件实例
      return this.$refs.antFormRef || {}
    },
    handleValueChange () { // 表单项发生改变时触发绑定
      return (value, key) => {
        return this.$emit('value', { ...this.props.value, [key]: value })
      }
    },
    handleSelectChange () {// 可以运用于选择器发生改变时触发某些事件
	  // 利用闭包的特性，computed返回一个函数就可以往computed中传递参数
      return (value, key) => {
        return this.$emit('selectUpdate', { value, key, step: this.step })
      }
    },
    handleCascaderChange () {// 可以运用于级联选择器发生改变时触发某些事件
      return (value, key) => {
        return this.$emit('cascaderUpdate', { value, key, step: this.step })
      }
    }
  }
```

#### 配置文件示例

```js
export const comLayout01 = {
  layout: {
    // 表单外部布局
    content: { span: 8 } // 高度设置好，不然会出现校验的时候错位
    // , style: { height: '75px' }
  },
  labelProps: {
    // 输入框以及label布局
    labelCol: { xl: 10 }, // 总数为24
    wrapperCol: { span: 14 },
    labelAlign: 'left'
  }
}
// 产品弹窗添加编辑配置
const proActionForm = (vue) => {
  return {
    ...comLayout01,
    formMain: [
      {
        value: 'productName',
        type: 'input',
        label: 'setProduct.productName',
        itemOptions: {}
      },
      {
        value: 'appId',
        type: 'select',
        label: 'setProduct.appId'
      },
      {
        value: 'productType',
        type: 'select',
        label: 'setProduct.productType',
        options: [
          {
            label: 'setProduct.defaultProduct', // 默认产品
            value: 1
          },
          {
            label: 'setProduct.arraignmentProduct', // 提审产品
            value: 2
          },
          {
            label: 'setProduct.ordinaryProduct', // 其他产品
            value: 3
          }
        ]
      },
      {
        value: 'availableAmount',
        type: 'inputNum',
        label: 'setProduct.availableAmount'
      },
      {
        value: 'repayOrder',
        type: 'cascader',
        label: 'setProduct.repayOrder',
        options: [
          {
            value: 'interestRate',
            label: vue.$t('setProduct.interest'),
            children: [
              {
                value: 'penaltyInterest',
                label: vue.$t('setProduct.penaltyInterest'),
                children: [
                  {
                    value: 'principal',
                    label: vue.$t('setProduct.principal')
                  }
                ]
              }
            ]
          },
          {
            value: 'penaltyInterest',
            label: vue.$t('setProduct.penaltyInterest'),
            children: [
              {
                value: 'interestRate',
                label: vue.$t('setProduct.interest'),
                children: [
                  {
                    value: 'principal',
                    label: vue.$t('setProduct.principal')
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    rules: {
      productName: [
        {
          required: true,
          message: 'Please input the productName',
          trigger: 'change'
        }
      ],
      appId: [
        { required: true, message: 'Please input the appId', trigger: 'change' }
      ],
      productType: [
        {
          required: true,
          message: 'Please input the productType',
          trigger: 'change'
        }
      ],
      availableAmount: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('Please input the availableAmount'))
            } else if (noInt(value)) {
              return callback(new Error('availableAmount is illegal!'))
            }
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ],
      minApplyAmount: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('Please input the minApplyAmount'))
            } else if (noInt(value)) {
              return callback(new Error('minApplyAmount is illegal!'))
            }
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ],
      interestRate: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('Please input the interestRate'))
            } else if (noInt(value) || value * 1 > 0.05 || value * 1 < 0) {
              // console.log(value > 0.05)
              return callback(new Error('interestRate is illegal!'))
            }
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ],
      penaltyInterestRate: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('Please input the penaltyInterestRate'))
            } else if (noInt(value) || value * 1 > 0.05 || value * 1 < 0) {
              // console.log(value > 0.05)
              return callback(new Error('penaltyInterestRate is illegal!'))
            }
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ],
      limitDays: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('Please input the limitDays'))
            } else if (!/^([7-9]|[1-2]\d|3[0-1])$/.test(value)) {
              return callback(new Error('limitDays is illegal!'))
            }
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ],
      repayOrder: [
        {
          required: true,
          message: 'Please input the repayOrder',
          trigger: 'change'
        }
      ],
      homeAmount: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('Please input the homeAmount'))
            } else if (noInt(value)) {
              return callback(new Error('homeAmount is illegal!'))
            }
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ],
      applyCoolDownHours: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              return callback(new Error('Please input the applyCoolDownHours'))
            } else if (!/^([0-9]|[1-3]\d|4[0-8])$/.test(value)) {
              return callback(new Error('applyCoolDownHours is illegal!'))
            }
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ]
    }
  }
}
```

### base-table

基础表格组件,可以用作封装二次组件，也可以**只做展示表格，没有任何操作，也没有分页器(可以加)**

#### props

```js
  props: {
    rowKey: { // 表格项的唯一标识，也就是数据的唯一标识'Id'
      type: String,
      required: true
    },
    locale: { // ant-design的容器
      type: Object,
      default: () => zhCN
    },
    listData: { // 表格数据,也就是后端返回的表格数据
      type: Array,
      default: () => []
    },
    columns: { // 表格列的配置
      type: Array,
      default: () => []
    },
    total: { // 表格总共有多少条数据
      type: Number,
      default: () => 0
    },
    current_size: { // 初始化的分页器选项，要传入data中做绑定
      type: Object,
      default: () => ({
        pageIndex: 1, // 默认在第几页
        pageSize: 10, // 默认一页有多少条数据
        pageSizes: ['10', '20', '30', '40', '50'] // 默认可以选择几条数据一页
      })
    },
    tableShowList: {// 需要的表格选项
      type: Object,
      default: () => ({
        select: {
            'row-selection':"rowSelection"
        },
        paginationOptions: { // 分页器
          'show-size-changer': true,
          'show-quick-jumper': true
        }
      })
    },
    tableOptions: { // 设置表格其他属性,例如style或者文档中的其他属性
      type: Object,
      default: () => ({})
    },
    layout: { // 表单项之间的布局
      type: Object,
      default: () => ({
        // 以下4个属性都使用v-bind,可以额外添加其他属性，例如style或者组件文档中的其他属性
        // a-row: 可以设置表单项是否启用flex布局
        layoutRow: { type: 'flex', justify="center", span: 24 } // start;end;space-between;space-around
		// a-row: 表单标题如果在上面的布局，占据一行的多少宽度
        topTitle: { xl: 4 },
        // a-col: 表单标题如果在左边的布局，占据一行的多少宽度
        leftTitle:{ xl: 4 },
        // a-col: 每一个表单项外面布局,也就是每一个表单项占据表单一行的多少，总数24，span为8,也就是一行有3个表单项
        content: { xl: 7, lg: 6, md: 12, sm: 24, xs: 24 }
        // 在这里设置style固定每一个表单项的高度,不然校验的时候会偏移(一般不在这里设置)
      })
    }  
  }
```

#### data

```js
  data () { // 要将分页器双向绑定，保留之前的状态
    return {
      pageArg: { ...this.current_size }
    }
  }
```

#### methods

```js
  emits: ['updatePage', 'updateSelect'],  
  methods: {
    antTableRef () { // 返回表格ref示例
      return this.$refs.antTableRef || {}
    },
    indexMethod (index) { // 表格显示序号
      const { pageIndex, pageSize } = this.pageArg
      return pageIndex !== 1
        ? (pageIndex - 1) * pageSize + index + 1
        : index + 1
    },
    currentUpdate (pageIndex, b) { // 当前页发生变化
      this.$set(this.pageArg, 'pageIndex', pageIndex)
      this.$emit('updatePage', { ...this.pageArg,pageIndex,typeof: 'updateCurrent' })
    },
    sizeUpdate (pageIndex, pageSize) { // 页码发生变化
      this.$set(this.pageArg, 'pageSize', pageSize)
      this.$emit('updatePage', { ...this.pageArg,pageSize,typeof: 'updateSize' })
    },
    selectionUpdate (select) { // 表格选择发生变化
      this.$emit('updateSelect', select)
    }
  }
```

#### 配置文件示例

```js
export const proTableConfig = {
  layout: {
    content: { xl: 24 }
  }, // 表格宽度
  tableOptions: {
    style: { width: '100%' }
  },
  rowKey: 'productId', // 列表唯一id
  columns: [
    {
      dataIndex: 'productId',
      title: 'setProduct.productId'
    },
    {
      dataIndex: 'appId',
      title: 'setProduct.appId'
    },
    {
      dataIndex: 'productType',
      title: 'setProduct.productType'
    },
    {
      dataIndex: 'limitDays',
      title: 'setProduct.limitDays'
    },
    {
      dataIndex: 'afterLoanFeeName',
      title: 'setProduct.afterLoanFeeName'
    },
    {
      dataIndex: 'rate',
      title: 'setProduct.interestRate'
    },
    {
      dataIndex: 'fixedCharge',
      title: 'setProduct.fixedCharge'
    },
    {
      dataIndex: 'penaltyInterestRate',
      title: 'setProduct.penaltyInterestRate'
    },

    { dataIndex: 'handle', title: '操作', minWidth: '80' }
  ],
  current_size: comLayout02.currentSize,
  tableShowList: comLayout02.tableShowList
}
```



### edit-table

#### props

```js
props: {
    rowKey: {// 列的唯一标识
      type: String,
      required: true
    },
    locale: {
      type: Object,
      default: () => zhCN
    },
    tableForm: { // 表格里面的表单组件
      type: Object,
      default: () => ({
        rules: {}
      })
    },
    listData: { // 表格数据
      type: Array,
      default: () => []
    },
    queryName: { // 是哪一个界面在使用这个组件的标识
      type: String,
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    total: { // 表格总条数
      type: Number,
      default: () => 0
    },
    current_size: { // 当前页和一页条数
      type: Object,
      default: () => ({
        currentPage: 1,
        pageSize: 10,
        pageSizeOptions: [5, 10, 20, 30, 40]
      })
    },
    tableShowList: { // 是否显示的选项
      type: Object,
      default: () => ({})
    },
    tableOptions: { // 设置表格其他属性
      type: Object,
      default: () => ({})
    },
    layout: { // 表格布局
      type: Object,
      default: () => ({})
    },
}
```

#### data

```js
data () { 
    return {
      ruleForm: {},
      dataSource: [...this.listData], // 表格数据
      pageArg: { ...this.current_size }// 要将分页器双向绑定，保留之前的状态
    }
}
```

#### methods

```js
antTableRef () { // 传出去表格a-table示例
  return this.$refs.antTableRef || {}
}
```

##### 外部改变表格里的值

```js
changeData (result) { // ref调用
  this.dataSource = result
}
```

##### 编辑表格中的输入框改变dataSource

```js
handleChange (value, name, scope) { // 输入框发生变化
  const dataSource = this.dataSource
  const uniqueId = scope[this.rowKey] // 唯一标识
  dataSource.forEach((item) => {
    if (item[this.rowKey] === scope[this.rowKey]) { // 改变对应的数值
      return (item[name] = value)
    }
  })
  this.$set(this.ruleForm, name, value) // 设置校验表单对象,好进行校验
  this.$emit('updateData', { data: dataSource, name, value, uniqueId }) // 传出去： 数据/属性名/值/唯一标识
}
```

##### 分页器和选择器

```js
currentUpdate (pageIndex) { // 编辑表格还没有做分页功能
  this.pageArg.pageIndex = pageIndex
  this.$emit('updatePage', {
    ...this.pageArg,
    pageIndex,
    typeof: 'updateCurrent'
  })
},
sizeUpdate (pageIndex, pageSize) {
  this.pageArg.pageSize = pageSize
  this.$emit('updatePage', {
    ...this.pageArg,
    pageSize,
    typeof: 'updateSize'
  })
},
selectionUpdate (select) {
  this.$emit('updateSelect', select)
}
```

##### 增加删除单元格

```js
// 增加删除单元格
handleAddDelete (action = 'add', _) { // _:如果是添加add，则为数据，如果是删除delete，则为key
  const { count, dataSource } = this
  if (action === 'add') {
    this.count = count + 1
    this.dataSource = [...dataSource, _]
  } else if (action === 'delete') {
    this.count = count - 1
    this.dataSource = dataSource.filter((item) => item[this.rowKey] !== _)
    console.log(this.dataSource)
  }
}
```

### base-card

展示卡片项,可以显示多组卡片信息项

#### props

```js
props: {
    cardList: { // 多组卡片信息项
      type: Array,
      default: () => []
    },
    layout: { // 
      type: Object,
      default: () => ({
        // a-row: 可以设置表单项是否启用flex布局
        layoutRow: { type: 'flex', justify="center", span: 24 } // start;end;space-between;space-around
        content: { span: 24 }
      })
    }
}
```

#### 配置项

```js
// 等级详情弹窗配置
export const levelDetailDialogConfig = (vue) => {
  return {
    width: '90%',
    title: vue.$t('setProduct.productDetail')
  }
}
```

### base-dialog

- 弹窗组件，用作添加编辑，而且不止一个表单，也不止一步

#### 使用

```vue
<base-dialog
    v-bind="productDialogConfig"
    ref="baseDialogRef"
    @actionNextSubmit="actionNextSubmit"
    @selectUpdate="hasSetLevel"
    @switchVisible="resetFeeActionTable"
>
    <template #step1>
      <computed-table
        class="computed_beforeFee"
        ref="computedBeforeFeeRef"
        queryName="computedBefore"
        :initTable="beforeFeeList"
        :initData="beforeFeeData"
        :isNeedStorage="false"
      >
        <template #leftTitle>
          <div>
            <p>{{ $t('setProduct.beforeLoanFee') }}</p>
            <a-button type="primary" @click="handleBeforeFee('add')">
              <a-icon type="plus" />
            </a-button>
          </div>
        </template>
        <template #handle="scope">
          <a-button type="danger" @click="handleBeforeFee('delete', scope.row)"
            ><a-icon type="delete"
          /></a-button>
        </template>
      </computed-table>
      <!-- 贷前费用和贷后费用的分割线 -->
      <computed-table
        class="computed_table"
        ref="computedAfterFeeRef"
        queryName="computedAfter"
        :initTable="afterFeeList"
        :initData="afterFeeData"
        :isNeedStorage="false"
      >
        <!-- @updateData="feeUpdateData" -->
        <template #leftTitle>
          <div>
            <p>{{ $t('setProduct.afterLoanFee') }}</p>
            <a-button type="primary" @click="handleAfterFee('add')">
              <a-icon type="plus" />
            </a-button>
          </div>
        </template>
        <template #handle="scope">
          <a-button type="danger" @click="handleAfterFee('delete', scope.row)"
            ><a-icon type="delete"
          /></a-button>
        </template>
      </computed-table>
    </template>
</base-dialog>
```

#### 插槽

- 第几步的插槽
- 确认取消插槽

#### props

```js
props: {
    dialogOptions: { // 弹窗配置
      type: Object,
      default: () => {}
    },
    formList: { // // 弹窗表单配置，第几步的表单
      type: Array,
      require: true
    },
    echoFormList: { // 回显表单数据,为数组
      type: Array,
      default: () => []
    }
}
```

#### 配置项

```js
export const proActionConfig = (vue) => {// 多级嵌套使用函数引入vue的实例
  return {
    dialogOptions: { // 弹窗配置
      width: '90%'
    },
    formList: [ // 弹窗表单配置，第几步的表单
      {
        addTitle: vue.$t('setProduct.addProduct'),
        editTitle: vue.$t('setProduct.editProduct'),
        confirmText: 'setProduct.confirm', // 确认按钮文案
        cancelText: 'setProduct.cancel', // 取消按钮文案
        prevText: 'setProduct.prev', // 上一步按钮文案
        nextText: 'setProduct.next', // 下一步按钮文案
        step: 1, // 这是第几步才会出现的表单
        name: 'step1', // 表单的数据绑定名
        initForm: proActionForm(vue) // 填入base-form的基础配置
      }
    ],
    echoFormList: [ // 设置默认值或者回显数据
      { // 第一步表单的默认项
        name: 'step1',
        initForm: {
          repayOrder: ['penaltyInterest', 'interestRate', 'principal'],
          interestRate: 0,
          penaltyInterestRate: 0.02,
          applyCoolDownHours: 24,
          productType: 3
        }
      },
      {
        name: 'step2', // 第二步表单的默认值
        initForm: {
          creditLevel: 'Z'
        }
      }
    ]
  }
}
```

#### script

```vue
<script>
import BaseForm from '../ant-form/base-form.vue'
import { initListData, initData } from '@/utils/ant-fun'
export default {
  components: {
    BaseForm
  },
  data () {
    return {
      action: 'add',
      step: 1,
      visible: false,
      formData: {},
      disabledList: {} // 禁止输入列表,一般在编辑中使用，新增可以在配置文件中配置
    }
  },
  watch: {
    formList (_) { // 在外部添加步骤以后，需要监听，并重新赋值formData，保留之前的formData
      const unLiveData = _.filter((item) => { // 返回新的表单
        return !this.formData[item.name]
      })
      unLiveData.forEach((item) => { // 只对新的表单步骤赋予新的值，之前的不做改变
        this.echoFormList.forEach((_) => { // 新的表单初始化
          if (item.name === _.name) { 
            this.$set(this.formData, item.name, initData(item.initForm.formMain, _.initForm))
          } else if (!_[item.name]) {
            this.$set(this.formData, item.name, nitData(item.initForm.formMain, {}))
          }
        })
      })
    }
  },
  computed: {
    title () { // 根据action的不同改变title
      let title
      if (this.action === 'add') {
        title = this.$t(this.stepItem().addTitle)
      } else if (this.action === 'edit') {
        title = this.$t(this.stepItem().editTitle)
      }
      return title
    },
    stepItem () { // 根据步数获取对应步骤的表单配置
      return (stepKey = this.step) => {
        const item = this.formList.find((item) => {
          return item.step === stepKey
        })
        return item
      }
    },
    submitFormData () {
      return (stepKey, name) => { // 返回第几步的表单数据 @params: 第几步， 什么属性
        return name ? this.formData[stepKey][name] : this.formData[stepKey]
      }
    }
  },
  created () {
    this.formData = initListData(this.formList, this.echoFormList) // 数据回显，从props中引入
  }
}
</script>
```

##### emits

```js
emits: ['actionNextSubmit', 'cascaderUpdate', 'selectUpdate', 'switchVisible']
// actionNextSubmit 确认按钮
// selectUpdate 表单中的选择框发生变化
// cascaderUpdate 级联选择器发生变化
```

##### 修改哪个步骤的表单数据

有的时候初始化数据echoFormList不可行，因为echoFormList绝对不可以改变！但是也要动态的改变某一个步骤的数据，就可以使用setFormData函数

```js
setFormData ({ stepName, key = '', value }) {
  // 改变步骤中的某一个值，在哪里改变很重要!
  if (key && this.formData[stepName]) {
    this.$set(this.formData[stepName], key, value)
  } else if (this.formData[stepName]) {
    this.$set(this.formData, stepName, value)
  }
}
```

##### 表单选择器发生变化

```js
selectUpdate (data) {
  this.$emit('selectUpdate', data)
}
```

##### 级联选择器改变数据

```js
optionUpdate (data) { // 级联选择器无法实时改变base-form的value，只能通过这里实时改变formData
  const form = this.formData
  const { value, key, step } = data
  form[`step${step}`][key] = value
  this.formData = form
  this.$emit('optionUpdate', data)
}
```

##### 数据初始化

```js
handleAction ({ action = 'add', data = {}, disabledList = {} }) { // action/编辑回显的数据/禁止输入的表单项属性
  this.switchVisible() // 先初始化，不然会覆盖后面的回显数据
  this.action = action
  if (this.action === 'edit') {// 如果是编辑需要回显数据
    this.formData = { ...data }
  }
  this.disabledList = { ...disabledList }
}
```

##### cancel退出弹窗

```js
cancel () { // 有一些数据不在这里面，emit告诉外面退出来，初始化其他组件的数据
  this.switchVisible()
  this.$emit('switchVisible')
}
```

##### 切换弹窗显隐

```js
switchVisible () {// 并且初始化数据
  this.step = 1
  this.formData = initListData(this.formList, this.echoFormList)
  this.visible = !this.visible
}
```

##### 步数控制函数

```js
stepControl (type = 'next', step) {
  // 步数控制函数
  if (step && this.step < this.formList.length) {
    this.step = step
  } else {
    type === 'next' && this.step < this.formList.length && (this.step += 1)
    type === 'prev' && this.step > 1 ? (this.step -= 1) : this.cancel()
  }
}
```

##### 确认传出去数据

```js
handleConfirmClick () { // 可以选择将ref也传出去,也可以选择在这里校验
  const stepItem = this.stepItem()
  const { antFormRef = {} } = this.$refs[`${stepItem.name}Ref`][0]
  antFormRef &&
    antFormRef.validate((valid) => {
      if (valid) {
        const data = {
          formList: { ...this.formData }, // 所有步骤的表单数据
          formData: { ...this.formData[stepItem.name] }, // 当前步骤的表单数据
          step: this.step, // 是第几步的表单
          stepName: stepItem.name // 步骤名称
        }
        this.$emit('actionNextSubmit', {
          ...data,
          action: this.action
        })
      }
    })
}
```

## 二次组件

### search-from搜索

搜索表单组件

#### props

```js
props: {
    queryName: { // 将数据存储vuex的名称，十分重要
      type: String,
      require: true
    },
    initForm: { // 搜索表单的配置信息,包括base-form的formMain
      type: Object,
      require: true
    },
    // 回显表单数据
    echoForm: {
      type: Object,
      default: () => {}
    }
}
```

#### script

```vue
<script>
import BaseForm from '@/components/AntDesign/ant-form/base-form.vue'
import { initData } from '@/utils/ant-fun'
export default {
  components: {
    BaseForm
  },
  emits: ['reset', 'submit'],
  created () {
    this.formData = initData(this.initForm.formMain, this.echoForm) // 数据回显，从props中引入
  }
}
</script>
```

##### 外部组件改变formData

```js
// this.refs.#.setFormData(id, 3)
setFormData (name, value) {
  this.$set(this.formData, name, value)
}
```

##### 重置reset

```js
reset (name) { // name: formData
  const resetForm = {}
  for (const item in this[name]) {
    resetForm[item] = ''
  }
  this[name] = resetForm
  this.$emit('reset', this.formData)
},
```

##### 搜索方法

```js
search () {
  const { antFormRef = {} } = this.$refs.baseFormRef // 获取base的示例，为了校验表单数据是否合法
  antFormRef.validate((valid) => {
    if (valid) {
      // 将表单的搜索条件存入vuex作缓存，如果需要缓存的话
      // this.saveQueryParams({ formData: this.formData, queryName: this.queryName })
      this.$store.commit('common/saveQueryParams', {
        formData: this.formData,
        queryName: this.queryName
      })
      this.$emit('submit', this.formData) // 不需要可以直接返回formData数据
    } else {
      console.log('this.formData: noValid', this.formData)
    }
  })
}
```

#### 使用

```vue
<!-- 搜索表单 -->
<search-form
  ref="searchFromRef"
  queryName="setProduct" // 二次表单只需要这个来存储基础表单的value
  :initForm="proSearchFormConfig" // 都是传入base-form的配置项
  @reset="search"
  @submit="search"
>
  <template #add>
    <a-col>
      <a-button
        type="primary"
        @click="$refs.productActionRef.handleAddProduct()"
      >
        {{ $t('setProduct.addProduct') }}
      </a-button>
    </a-col>
  </template>
</search-form>

```

#### 配置文件

```js
export const comLayout02 = {
  layout: {
    // 每一个表单项所占得宽度
    content: { xl: 6, lg: 8, md: 6, sm: 24, xs: 24 }
  },
  labelProps: {
    labelCol: { span: 8 }, // 表单项中标题所占的宽度
    wrapperCol: { span: 14 }, // 输入框所占的宽度
    labelAlign: 'left'
  },
  itemStyle: { padding: '5px 0' },
  currentSize: {
    pageIndex: 1,
    pageSize: 10,
    pageSizes: ['5', '10', '20', '30', '40']
  },
  tableShowList: {
    paginationOptions: { 'show-size-changer': true, 'show-quick-jumper': true } // 是否显示footer分页器
  }
}
export const proSearchFormConfig = { // 传入base-form的配置项，具体可以参考base-form
  ...comLayout02,
  formMain: [ 
    {
      value: 'productId',
      type: 'input',
      label: 'setProduct.productId',
      ruleVariate: {
        // 输入规则的变量
        // maxLength: 10
      }
    },
    {
      value: 'productType',
      type: 'select',
      label: 'setProduct.productType',
      options: [
        {
          label: 'table.all', // 默认产品
          value: ''
        },
        {
          label: 'setProduct.defaultProduct', // 默认产品
          value: 1
        }
      ]
    }
  ]
}

```

### content-table展示表格

显示表格组件，有分页选择功能

#### props

```js
props: {
    handleData: { // 数据处理，后端返回的数据需要在外面处理完在传进来
      type: Function,
      default: (_) => _
    },
    apiQuery: { // 搜索表格需要的链接和参数,可以结合vuex去做，根据业务需求变通
      type: Object,
      required: true，
      // { url: 'api/...', data: {...}, ...更多属性 }
    },
    queryName: { // 如果需要vuex中的formData缓存,那么就可以写入和search-form一样的queryName
      type: String,
      default: () => ''
    },
    initTable: { // 初始化表格组件，也就是base-table的配置
      type: Object,
      require: true
    },
    isNeedStorage: { // 是否需要使用vuex中的搜索参数初始化表格
      type: Boolean,
      default: false
    }
}
```

#### script

```vue
<script>
import { createNamespacedHelpers } from 'vuex'
import BaseTable from '@/components/AntDesign/ant-table/base-table.vue'
const { mapGetters } = createNamespacedHelpers('common')
export default {
  components: {
    BaseTable
  },
  data () {
    return {
      loading: false, // 加载动画
      listData: { // 存储后端返回的表格数据
        data: [],
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['getQueryParams']),
    trendsSlots () {
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
    async init (params, _ = { pageIndex: 1, pageSize: 10 }) {
      this.loading = true
      const data = {
        ...params,
        ...this.apiQuery.data,
        pagination: { ..._ }
      }
      const res = await this.$api(this.apiQuery.url, data)
      const list = this.handleData(res.list)
      this.listData = { data: list, total: res.total }
      this.loading = false
    },
    async deleteBtnClick () {},
    // 分页器刷新表格,判断是否使用缓存查询
    updatePage (_) {
      const params = this.isNeedStorage
        ? this.getQueryParams(this.queryName)
        : {}
      this.init(params, { pageIndex: _.pageIndex, pageSize: _.pageSize })
    },
    updateSelect (_) {
      console.log(_, '选择序号改变了')
    }
  },
  created () {
    this.isNeedStorage
      ? this.init(
        this.getQueryParams(this.queryName),
        this.initTable.current_size
      )
      : this.init({}, this.initTable.current_size)
  }
}
</script>
```

##### 初始化表格

```js
// 初始化表格
async init (params, _ = { pageIndex: 1, pageSize: 10 }) {
  this.loading = true
  const data = { // 请求参数
    ...params,
    ...this.apiQuery.data,
    pagination: { ..._ }
  }
  const res = await this.$api(this.apiQuery.url, data) // 获取表格数据
  const list = this.handleData(res.list)
  this.listData = { data: list, total: res.total } // 存入data
  this.loading = false
}
```

##### 分页器和选择框

```js
// @updatePage="updatePage" -----   @updateSelect="updateSelect"
updatePage (_) { // 分页器改变重新获取数据
  const params = this.isNeedStorage
    ? this.getQueryParams(this.queryName)
    : {}
  this.init(params, { pageIndex: _.pageIndex, pageSize: _.pageSize })
}

updateSelect (_) {
  console.log(_, '选择序号改变了')
}
```

#### 配置文件

```js
import { comLayout02 } from '../base.config'
export const proTableConfig = { // 其实就是base-table的配置文件
  layout: {
    content: { xl: 24 }
  }, // 表格宽度
  tableOptions: {
    style: { width: '100%' }
  },
  rowKey: 'productId', // 列表唯一id
  columns: [
    {
      dataIndex: 'productId',
      title: 'setProduct.productId'
    },
    {
      dataIndex: 'appId',
      title: 'setProduct.appId'
    }

    { dataIndex: 'handle', title: '操作', minWidth: '80' }
  ],
  current_size: comLayout02.currentSize,
  tableShowList: comLayout02.tableShowList
}
```

### computed-table计算表格

#### props

```js
props: {
    initData: { // 表格默认数据
      type: Array,
      default: () => []
    },
    queryName: { // 如果需要vuex中的formData缓存,那么就可以写入和search-form一样的queryName
      type: String,
      default: () => ''
    },
    initTable: { // 初始化表格组件，也就是edit-table的配置
      type: Object,
      require: true
    },
    isNeedStorage: { // 是否需要使用vuex中的搜索参数初始化表格
      type: Boolean,
      default: false
    }
}
```

#### script

```vue
<script>
import { createNamespacedHelpers } from 'vuex'
import EditTable from '@/components/AntDesign/ant-table/edit-table.vue'
const { mapGetters } = createNamespacedHelpers('common')
export default {
  components: {
    EditTable
  },
  data () {
    return {
      listData: {
        data: [],
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['getQueryParams']),
    trendsSlots () { // 返回组件插槽，过滤掉'操作'插槽
      const useLess = ['handle']
      const slots = this.initTable.columns.filter((item) => {
        return !useLess.includes(item.dataIndex)
      })
      return slots
    },
    handleValueChange (value, key) { // 当表格里面的表单数据发生变化的时候触发
      // console.log(value, key)
      return 1
    }
  },
  created () {
    // 初始化表格
    this.listData = { ...this.listData, data: this.initData }
  }
}
</script>
```

##### 计算表格数据发生变化

````js
// @updateData="updateData" 由edit-table组件触发
updateData (dataSource) {
  // 表格里面的数据发生变化时立刻传给父组件
  this.$emit('updateData', dataSource)
}
````

##### 分页器和选择框

```js
// 计算表格目前还没有遇到需要分页和选择框的需求,还没有完善
updatePage (_) {
  const params = this.getQueryParams(this.queryName)
  // this.init(params, _)
},
updateSelect (_) {
  console.log(_, '选择序号改变了')
}
```

##### 提交表格数据

```js
submitForm (canNull = []) { // 一行中的谁可以为空不填
  const dataSource = this.$refs.editTableRef.dataSource
  let checked = true // true是没问题的
  let checkedName // 是哪一个属性不合法
  if (dataSource.length === 0) return { checked, result: dataSource } // 表格为空直接返回
  dataSource.forEach((item) => { // 循环判断
    if (canNull.length === 0) {
      // 每一项都不可以为空
      Object.keys(item).forEach((name) => {
        if (
          item[name] === null ||
          item[name] === undefined ||
          item[name] === ''
        ) {
          checked = false
          checkedName = name
        }
      })
    } else {
      const noNull = Object.keys(item).filter((key) => { // 把可以为空的过滤掉
        return !canNull.includes(key)
      })
      noNull.forEach((name) => { // 判断剩下不可以为空的
        if (
          item[name] === null ||
          item[name] === undefined ||
          item[name] === ''
        ) {
          checked = false
          checkedName = name
        }
      })
    }
  })
  return { checked, result: checked ? dataSource : checkedName }
},
```

##### 增加删除表格项

```js
handleAddDelete (action = 'add', _) { // 传入edit-table action: 'add'/'delete'
  // 增加删除列表项
  this.$refs.editTableRef.handleAddDelete(action, _)
}
```

#### 配置文件

```js
export let feeIsValidate = true
export const beforeFeeList = {
  layout: ...,
  tableOptions: ...,
  rowKey: ...,
  columns: [
    {
      dataIndex: 'name',
      title: 'setProduct.beforeLoanFee'
    },
    {
      dataIndex: 'rate',
      title: 'setProduct.rate'
    },
    {
      dataIndex: 'fixedCharge',
      title: 'setProduct.fixedCharge'
    },

    { dataIndex: 'handle', title: 'table.operation', minWidth: '80' }
  ],
  tableForm: { // 表格里面的表单类型: input/inputNumber/select
    formMain: {
      name: {
        type: 'input'
      },
      rate: {
        type: 'inputNumber'
      },
      fixedCharge: {
        type: 'inputNumber'
      }，
      chargeType: {
          type: 'select',
          options: [
            {
              value: 2,
              label: vue.$t('setProduct.Yes')
            },
            {
              value: 1,
              label: vue.$t('setProduct.No')
            }
          ]
        }
    },
    rules: { // 表单检验规则
      name: [
        {
          validator: (rule, value, callback) => {
            if (value === '') {
              feeIsValidate = false
              return callback(new Error("beforeLoanFeeName can't be null"))
            }
            feeIsValidate = true
            callback()
          },
          required: true,
          trigger: 'change'
        }
      ]
    }
  }
}
```

### detail-dialog

#### 示例

```vue
<a-modal
    v-bind="detailOptions"
    :visible="visible"
    centered
    destroyOnClose
    @ok="switchVisible"
    @cancel="switchVisible"
>
    <base-card v-bind="cardList"></base-card>
    <slot name="default"></slot>
	<template slot="footer">
        <slot name="footer">
            <a-button type="primary" @click="switchVisible">关闭</a-button>
        </slot>
    </template>
</a-modal>
<script>
export default {
  props: {
    detailOptions: { // 卡片的配置项
      type: Object,
      default: () => ({
        width: '80%'
      })
    },
    : { // 在外部过滤完的数据
      type: Object,
      default: () => {}
    }
  },
  components: {
    BaseCard
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    switchVisible () {
      this.visible = !this.visible
    }
  }
}
</script>
```

#### 数据

```js
// cardList是数组
[
    { // 第一个卡片
        "type": "default",
        "key": "12",
        "cardOption": {
            "title": "产品信息"
        },
        "itemLayout": {
            "span": 4,
            "style": {
                "margin": "15px 0"
            }
        },
        "contentList": [
            {
                "title": "产品",
                "text": "credifio-co"
            },
            {
                "title": "产品名称",
                "text": "Kes 7 Days"
            }
        ]
    },
    { // 其他卡片
        
    }
]
```

# 使用方法

# 配置数据处理函数

## filterData

```js
/**
 * @param 表单数组，所有要改动的表单项，添加进来的属性名
 * @param 更改表单中的表单项
 */
export const filterData = (_, keyFun, name = 'inputRule') => {
  _.forEach((item) => {
    for (let obj of keyFun) {
      if (obj[item.value]) {
        item[name] = obj[item.value]
      }
    }
  })
  return _
}
// 使用
export const addLevelForm = (vue) => {
  return {
    ...comLayout01,
    formMain: [
      {
        value: 'appId',
        type: 'select',
        label: 'setProduct.appId'
      }
    ]
  }
}
// 使用filterData也可以使用initFormOptions
initLevelForm () {
  const formMain = filterData(
    addLevelForm(this).formMain,
    [
      {
        appId: [
          ...getVestApp(this.enumerate.appId, this.setting.curSystem.value)
        ],
        // ...
      }
    ],
    'options'
  )
  return { ...addLevelForm(this), formMain }
}
```

## listFilterData

```js
/**
 * @param 表单数组，第几步的表单项，所有要改动的表单项，添加进来的属性名
 * @param 给弹出框中的表单项初始化，更新表单项
 */
export const listFilterData = (_, step, keyFun, name = 'inputRule') => {
  const form = _.find((item) => {
    return item.step === step
  })
  if (form.initForm) {
    const formMain = filterData(form.initForm.formMain, keyFun, name)
    const initForm = { ...form.initForm, formMain }
    const formList = _.map((item) => {
      return item.step === step ? { ...item, initForm } : { ...item }
    })
    return formList
  }
  return _
}
// 使用
export const levelEditForm = (vue) => {
  return {
    formList: [
      {
        addTitle: vue.$t('setProduct.addProduct'),
        editTitle: vue.$t('setProduct.editLevel'),
        confirmText: 'setProduct.confirm',
        cancelText: 'setProduct.cancel',
        prevText: 'setProduct.prev',
        nextText: 'setProduct.next',
        step: 1, // 这是第几步才会出现的表单
        name: 'step1', // 表单的数据绑定
        initForm: levelActionForm(vue)
      }
    ]
  }
}
levelEditForm () {
  const config = levelEditForm(this)
  let formList = dialogFilterData(
    config.formList,
    1, // 第几步的表单要添加
    [
      {
        appId: [
          ...getVestApp(this.enumerate.appId, this.setting.curSystem.value)
        ]
      }
    ],
    'options'
  )
  return { ...config, formList }
}
```

## initData

```js
/**
 * @param 初始化表单数据,如果没有默认值的话将所有值置空
 */
export const initData = (initArray, initObj = {}) => {
  // 做数据回显,初始化表单数据
  const data = {}
  initArray.forEach((item) => {
    if (initObj[item.value] !== undefined) {
      data[item.value] = initObj[item.value]
    } else {
      data[item.value] = ''
    }
  })
  return data
}
```

## initListData

```js
/**
 * @param 初始化多个表单数据
 */
export const initListData = (formList, echoFormList = []) => {
  const data = {}
  formList.forEach((item) => {
    if (item.initForm) { // 判断有无表单配置对象
      echoFormList.forEach((initItem) => {
        if (item.name === initItem.name) {
          data[item.name] = initData(item.initForm.formMain, initItem.initForm)
        } else if (!item[initItem.name] && initItem[item.name]) {
          // formList不存在这个step，echoFormList存在
          data[initItem.name] = {}
        } else if (!initItem[item.name] && item[initItem.name]) {
          // formList存在这个step，echoFormList不存在
          data[item.name] = initData(item.initForm.formMain)
        }
      })
    }
    if (echoFormList.length === 0) {
      // 即使没有初始化数组也不至于报错
      data[item.name] = {}
    }
  })
  return data
}
// 使用
switchVisible () {
  // 切换弹窗显隐，并且初始化数据
  this.step = 1
  this.formData = initListData(this.formList, this.echoFormList)
  this.visible = !this.visible
}
```

## initEchoFormList

```js
// 更新初始化，保留之前的初始化数据，也可以增加修改
export const initEchoFormList = (echoFormList, newEchoFormList) => {
  echoFormList.forEach((item) => {
    newEchoFormList.forEach((key) => {
      if (item.name === key.name) {
        item.initForm = { ...item.initForm, ...key.initForm }
      }
    })
  })
  return echoFormList
}
```

## initFormOptions

```js
/**
 * @param 初始化表单中的选择框
 */
export const initFormOptions = (formMain, optionsList) => {
  const _ = Object.keys(optionsList)
  formMain.forEach((item) => {
    _.forEach((key) => {
      if (item.value === key && item.type === 'select') {
        item.options = optionsList[key]
      }
    })
  })
  return formMain
}
// 使用
export const levelSearchFormConfig = {
  ...comLayout02,
  formMain: [
    {
      value: 'appId',
      type: 'select',
      label: 'setProduct.appId'
    }
  ]
}
levelSearchFormConfig () {
  const appIdOptions = [
    { label: this.$t('table.all'), value: '' },
    ...getVestApp(this.enumerate.appId, this.setting.curSystem.value)
  ]
  // 初始化表单选择框
  const formMain = initFormOptions(levelSearchFormConfig.formMain, {
    appId: appIdOptions
  })
  return { ...levelSearchFormConfig, formMain }
}
```

# 搜索表单

```vue
<!-- 搜索表单 -->
<search-form
  ref="searchFromRef"
  queryName="setProduct"
  :initForm="proSearchFormConfig"
  @reset="search"
  @submit="search"
>
  <template #add>
    <a-col>
      <a-button
        type="primary"
        @click="$refs.productActionRef.handleAddProduct()"
      >添加产品</a-button>
    </a-col>
  </template>
</search-form>
```

# base-dialog弹窗

## 示例

```vue
<base-dialog
    v-bind="productDialogConfig"
    ref="baseDialogRef"
    @actionNextSubmit="actionNextSubmit"
    @selectUpdate="hasSetLevel"
    @switchVisible="resetFeeActionTable"
>
    <!--步骤插槽-->
    <template #step1>
      <computed-table
        class="computed_beforeFee"
        ref="computedBeforeFeeRef"
        queryName="computedBefore"
        :initTable="beforeFeeList"
        :initData="beforeFeeData"
        :isNeedStorage="false"
      >
        <template #leftTitle>
          <div>
            <p>{{ $t('setProduct.beforeLoanFee') }}</p>
            <a-button type="primary" @click="handleBeforeFee('add')">
              <a-icon type="plus" />
            </a-button>
          </div>
        </template>
        <template #handle="scope">
          <a-button type="danger" @click="handleBeforeFee('delete', scope.row)"
            ><a-icon type="delete"
          /></a-button>
        </template>
      </computed-table>
      <!-- 贷前费用和贷后费用的分割线 -->
      <computed-table
        class="computed_table"
        ref="computedAfterFeeRef"
        queryName="computedAfter"
        :initTable="afterFeeList"
        :initData="afterFeeData"
        :isNeedStorage="false"
      >
        <template #leftTitle>
          <div>
            <p>{{ $t('setProduct.afterLoanFee') }}</p>
            <a-button type="primary" @click="handleAfterFee('add')">
              <a-icon type="plus" />
            </a-button>
          </div>
        </template>
        <template #handle="scope">
          <a-button type="danger" @click="handleAfterFee('delete', scope.row)"
            ><a-icon type="delete"
          /></a-button>
        </template>
      </computed-table>
    </template>
</base-dialog>
```

## 编辑回显数据

适用于第一次点击编辑按钮的时候，但是如果要完成类似于点击默认产品出现第二步，而第二步的产品回显要查询得到数据，那么这个方法就不适用，可以直接使用setFormData方法改变表单数据

```js
// <a-button @click="$refs.productActionRef.handleAddProduct()">
// {{ $t('setProduct.addProduct') }}
// </a-button>
async handleEditProduct (_) {
  try {
    const res = await this.$api(
      `/${this.setting.curSystem.prefixApi}${getProductNew}?productId=${_.productId}`,
      {},
      'get'
    )
    // 如果不是默认产品就可以这样
    this.$refs.baseDialogRef.handleAction({
      action: 'edit',
      data: { step1: res }, // !回显要加上是第几步的表单数据
      disabledList: { step1: ['productName', 'limitDays'] } // 指定第几步的禁用
    })
  } catch (error) {
    console.log(error)
  }
},
```

## 编辑禁用输入框

在添加时，是不需要禁用某些输入框的，但是编辑时需要的，所以在编辑时，除了要传数据，还要传disabledList

```js
// 如果不是默认产品就可以这样
this.$refs.baseDialogRef.handleAction({
  action: 'edit',
  data: { step1: res }, // !回显要加上是第几步的表单数据
  disabledList: { step1: ['productName', 'limitDays'] } // 指定第几步的禁用
})
```

## 配置文件禁用输入框

比如说一开始就不可以输入的框，或者是类似于第二步的添加等级，都是死的，从头到尾，无论是添加还是编辑都是禁用的，那么就可以使用

```js
formMain: [
  {
    value: 'appId',
    type: 'select',
    label: 'setProduct.appId',
    disabled: true
  },
  {
    value: 'creditLevel',
    type: 'input',
    label: 'setProduct.creditLevel',
    disabled: true
  }
]
```



## 动态回显修改表单数据

```js
this.$refs.baseDialogRef.setFormData({
  stepName: 'step2',
  value: data // !回显要加上是第几步的表单数据
})
```

## 配置处理，添加属性

```js
initLevelForm () { // 第二步的表单
  const formMain = filterData(
    addLevelForm(this).formMain,
    [
      {
        appId: [
          ...getVestApp(this.enumerate.appId, this.setting.curSystem.value)
        ]
      }
    ],
    'options'
  )
  return { ...addLevelForm(this), formMain }
}
```

## 中途添加步骤

```js
// <base-dialog @selectUpdate="hasSetLevel">
hasSetLevel (data) { // 选择框产品类型更换决定是否有第二步
  const { value = 3, step } = data
  if (step === 1) {
    this.productTypeActive = value
  }
}
```

```js
// <base-dialog v-bind="productDialogConfig">
import { proActionConfig } from './config/productConfig/pro-action.config'
computed: {
    proActionConfig() {
        const config = proActionConfig(this)
        let formList = dialogFilterData( // 第一步配置过滤
            config.formList,
            1,
            [
              {
                appId: [
                  ...getVestApp(this.enumerate.appId, this.setting.curSystem.value)
                ]
              }
            ],
            'options'
        )
        if (this.productTypeActive === 1) {
            formList.push({ // 添加步骤
              addTitle: '第2步',
              editTitle: this.$t('编辑'),
              confirmText: 'confirm',
              cancelText: 'cancel',
              prevText: 'prev',
              nextText: 'next',
              step: 2, // 这是第几步才会出现的表单
              name: 'step2', // 表单的数据绑定
              initForm: this.initLevelForm
            })
        } else {
            formList.length === 2 && formList.pop()
        }
        return { ...config, formList }
    }
}
```

## 修改初始化echoFormList

利用initEchoFormList函数

```js
productDialogConfig () {
    const config = proActionConfig(this)
    const echoFormList = initEchoFormList(config.echoFormList, [
        {
            name: 'step2',
            initForm: {
              appId: this.appId
            }
        }
    ])
    return { ...config, formList }
}
```

## 显示弹窗并初始化

```js
handleAddProduct () {
  this.$refs.baseDialogRef.handleAction({ action: 'add' })
}
```

## 确认action

```js
// <base-dialog @actionNextSubmit="actionNextSubmit">
actionNextSubmit (value) {
  // 弹窗确认数据
  const { formData, step, formList, stepName, action } = value
  let product
  let data = { ...formData }

  if (step === 1) {
    product = this.productFilter(data)
    if (product) {
      if (data.productType === 1) { // 默认产品有第二步，先不发送请求
        this.$refs.baseDialogRef.stepControl('next', 2)
      } else {
        action === 'add' && this.addProduct(product)
        action === 'edit' && this.editProduct(product)
      }
    }
  } else if (step === 2) {
    product = this.productFilter(formList['step1'])
    if (product) {
      action === 'add' && this.addProduct(product)
      action === 'edit' && this.editProduct(product)
    }
  }
}
```

# computed-table

```vue
  <computed-table
    class="computed_table"
    ref="computedAfterFeeRef"
    queryName="computedAfter"
    :initTable="afterFeeList"
    :initData="afterFeeData"
    :isNeedStorage="false"
  >
    <!-- @updateData="feeUpdateData" -->
    <template #leftTitle>
      <div>
        <p>{{ $t('setProduct.afterLoanFee') }}</p>
        <a-button type="primary" @click="handleAfterFee('add')">
          <a-icon type="plus" />
        </a-button>
      </div>
    </template>
    <template #handle="scope">
      <a-button type="danger" @click="handleAfterFee('delete', scope.row)"
        ><a-icon type="delete"
      /></a-button>
    </template>
  </computed-table>
```

## 添加删除表单项

```js
handleBeforeFee (action = 'add', row) {
  const uniqueId = _uniqueId()
  if (action === 'add') {
    this.$refs.computedBeforeFeeRef.handleAddDelete('add', {
      uniqueId,
      name: '', // 费用名称
      fixedCharge: 0, // 固定费用金额
      rate: 0 // 砍头利率
    })
  } else {
    this.$refs.computedBeforeFeeRef.handleAddDelete('delete', row.uniqueId)
  }
}
```

## 重置表格数据

```js
// <base-dialog  @cancelAction="resetFeeActionTable">
// 当弹窗消失时重置表格数据
resetFeeActionTable () {
  this.beforeFeeData = []
  this.afterFeeData = []
}
```

## 编辑表格

- `@click="$refs.productActionRef.handleEditProduct(scope.row)"`

- ```js
  async handleEditProduct (_) {
    try {
      const res = await this.$api(...) // 获取回显数据,其中包括了表格和表单数据
      let bfFee
      if (res.preLoanFeeSettings.length !== 0) {
        bfFee = res.preLoanFeeSettings.map((item) => { // 添加唯一标识,方便删除和添加
          return { ...item, uniqueId: _uniqueId() }
        })
      }
      this.beforeFeeData = bfFee || [] // 赋值给data，因为传过去的数据也是data中的数据
      let { logList ...params } = res // 删除回显数据中不需要的属性
      this.$refs.baseDialogRef.handleAction({
        action: 'edit',
        data: { step1: params }, // !回显要加上是第几步的表单数据
        disabledList: { step1: ['productName', 'limitDays'] } // 指定第几步的禁用项
      })
    } catch (error) {
      console.log(error)
    }
  }
  ```

- ```js
  handleAction ({ action = 'add', data = {}, disabledList = {} }) {
    this.switchVisible() // 先初始化，不然会覆盖后面的回显数据
    this.action = action
    if (this.action === 'edit') {
      // 如果是编辑需要回显数据
      this.formData = { ...data }
    }
    this.disabledList = { ...disabledList }
  }
  ```
