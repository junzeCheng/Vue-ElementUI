import Vue from 'vue'
import
{Input,Form,FormItem,Button,Message,Container,
  Aside,Main,Header,Menu,Submenu,MenuItem,
  Breadcrumb,BreadcrumbItem,Card,Col,Row,Table,TableColumn,Switch,
  Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option
} from 'element-ui'

Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Submenu)
Vue.use(Container)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)



Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm