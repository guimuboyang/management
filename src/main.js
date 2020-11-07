// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/style/reset.css'
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid'

import {
  Button, Form, FormItem, Input, Message, Container, Header,
  Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb,
  BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination,
  Dialog, MessageBox, Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane,
  Step, Steps, Checkbox, CheckboxGroup, Upload,
  Timeline, TimelineItem
} from 'element-ui'

Vue.config.productionTip = false
axios.defaults.baseURL = 'https://rambuild.cn/api/private/v1'
//设置axios拦截请求验证token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios;

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将弹框组件全局挂在到VUe原形实例
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.component('tree-table', TreeTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
