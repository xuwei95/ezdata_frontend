JEECG BOOT 低代码平台（Vue3前端）
===============

当前最新版本： 1.0.0-beta（预计时间：20220321）


## 简介
JeecgBoot-Vue3采用 Vue3.0、Vite、 Ant-Design-Vue、TypeScript 等新技术方案，包括二次封装组件、utils、hooks、动态菜单、权限校验、按钮级别权限控制等功能。
是在 Vben-Admin 基础上研发的，适合于JeecgBoot的新版前端VUE3框架。
 
> 全新的VUE3技术栈，不只是追赶技术潮流，用了之后才能体会到Vue3的好处，的确比2更加适合大型项目。


### 源码下载：

> - 必看：切换Vue3路由： [http://vue3.jeecg.com/2671576](JeecgBoot前端切换到Vue3版.md)
> - (重要：必须切换，不然会报错 Error: Invalid route component)

|     |   后端源码   | vue3前端源码  |
|---  |--- | --- |
|  github   | https://github.com/jeecgboot/jeecg-boot   | https://github.com/jeecgboot/jeecgboot-vue3  |
|  码云   |  https://gitee.com/jeecg/jeecg-boot   | https://gitee.com/jeecg/jeecgboot-vue3  |


### 相关文档：

*  在线演示：http://boot3.jeecg.com
*  QQ交流群：683903138
*  开发文档：http://vue3.jeecg.com
*  代码生成：http://vue3.jeecg.com/2677352
*  B站： [快速入门视频](https://www.bilibili.com/video/BV1V34y187Y9)

## Install and use


  
- Get the project code

```bash
git clone https://github.com/jeecgboot/jeecgboot-vue3.git
```

- Installation dependencies

```bash
cd jeecgboot-vue3

yarn install

```

- run

```bash
yarn serve
```

- build

```bash
yarn build
```



## 功能模块
> vue3版本已经实现了系统管理、系统监控、报表、各种组件、前端权限、GUI代码生成 等平台基础模块，
> 除了Online表单、Online报表模块其他都已完成。

```
├─首页
│  ├─首页（四套首页满足不同场景需求）
│  ├─工作台
├─系统管理
│  ├─用户管理
│  ├─角色管理
│  ├─菜单管理
│  ├─权限设置（支持按钮权限、数据权限）
│  ├─表单权限（控制字段禁用、隐藏）
│  ├─部门管理
│  ├─我的部门（二级管理员）
│  └─字典管理
│  └─分类字典
│  └─系统公告
│  └─职务管理
│  └─通讯录
│  └─对象存储
│  └─多租户管理
├─系统监控
│  ├─网关路由配置（gateway）
│  ├─定时任务
│  ├─数据源管理
│  ├─系统日志
│  ├─消息中心（支持短信、邮件、微信推送等等）
│  ├─数据日志（记录数据快照，可对比快照，查看数据变更情况）
│  ├─系统通知
│  ├─SQL监控
│  ├─性能监控
│  │  ├─监控 Redis
│  │  ├─Tomcat
│  │  ├─jvm
│  │  ├─服务器信息
│  │  ├─请求追踪
│  │  ├─磁盘监控
├─消息中心
│  ├─我的消息
│  ├─消息管理
│  ├─模板管理
├─积木报表设计器
│─报表示例
│  ├─曲线图
│  └─饼状图
│  └─柱状图
│  └─折线图
│  └─面积图
│  └─雷达图
│  └─仪表图
│  └─进度条
│  └─排名列表
│  └─等等
│─大屏模板
│  ├─作战指挥中心大屏
│  └─物流服务中心大屏
├─代码生成器（GUI）
│  ├─代码生成器功能（一键生成前后端代码，生成后无需修改直接用，绝对是后端开发福音）
│  ├─代码生成器模板（提供4套模板，分别支持单表和一对多模型，不同风格选择）
│  ├─代码生成器模板（生成代码，自带excel导入导出）
│  ├─查询过滤器（查询逻辑无需编码，系统根据页面配置自动生成）
│  ├─高级查询器（弹窗自动组合查询条件）
│  ├─Excel导入导出工具集成（支持单表，一对多 导入导出）
│  ├─平台移动自适应支持
│─常用示例
│  ├─自定义组件示例
│  ├─JVxeTable示例(ERP行业复杂排版效果)
│  ├─单表模型例子
│  └─一对多模型例子
│  └─打印例子
│  └─一对多内嵌示例
│  └─异步树Table
│  └─图片拖拽排序
│  └─图片翻页
│  └─图片预览
│  └─PDF预览
│─封装通用组件	
│  ├─行编辑表格JVxeTable
│  └─省略显示组件
│  └─时间控件
│  └─高级查询 (未实现)
│  └─用户选择组件
│  └─报表组件封装
│  └─字典组件
│  └─下拉多选组件
│  └─选人组件
│  └─选部门组件
│  └─通过部门选人组件
│  └─封装曲线、柱状图、饼状图、折线图等等报表的组件（经过封装，使用简单）
│  └─在线code编辑器
│  └─上传文件组件
│  └─树列表组件
│  └─表单禁用组件
│  └─等等
│─更多页面模板
│  └─Mock示例（子菜单很多）
│  └─页面&导航（子菜单很多）
│  └─组件&功能（子菜单很多）
├─高级功能
│  ├─支持微前端
│  ├─提供CAS单点登录
│  ├─集成Websocket消息通知机制
│  ├─支持第三方登录（QQ、钉钉、微信等）
│  ├─系统编码规则
├─Online在线开发（尚未实现）
│  ├─Online在线表单 
│  ├─Online代码生成器
│  ├─Online在线报表 
└─更多功能开发中。。
   
```


## 入门必备

本项目需要一定前端基础知识，请确保掌握 Vue 的基础知识，以便能处理一些常见的问题。 建议在开发前先学一下以下内容，提前了解和学习这些知识，会对项目理解非常有帮助:

*   [Vue3 文档](https://v3.vuejs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vue-router](https://next.router.vuejs.org/)
*   [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/)
*   [Vben文档](https://vvbin.cn/doc-next)
*   [Es6](https://es6.ruanyifeng.com/)
*   [Vitejs](https://vitejs.dev/)
*   [Pinia(vuex替代方案)](https://pinia.esm.dev/introduction.html)
*   [Vue-RFCS](https://github.com/vuejs/rfcs)
*   [Vue2 迁移到 3](https://v3.vuejs.org/guide/migration/introduction.html)
*   [~~WindiCss~~](https://windicss.netlify.app/)


##   浏览器支持

**本地开发**推荐使用`Chrome 最新版`浏览器，**不支持**`Chrome 80`以下版本。

**生产环境**支持现代浏览器，不支持 IE。

| [![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png)](http://godban.github.io/browsers-support-badges/)IE | [![ Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](http://godban.github.io/browsers-support-badges/)Edge | [![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](http://godban.github.io/browsers-support-badges/)Firefox | [![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](http://godban.github.io/browsers-support-badges/)Chrome | [![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)](http://godban.github.io/browsers-support-badges/)Safari |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |




##   系统效果

![输入图片说明](https://jeecgos.oss-cn-beijing.aliyuncs.com/files/site/vue3_20220310142327.png "在这里输入图片标题")
![输入图片说明](https://jeecgos.oss-cn-beijing.aliyuncs.com/files/site/vue3_20220310142354.png "在这里输入图片标题")
![输入图片说明](https://jeecgos.oss-cn-beijing.aliyuncs.com/files/site/vue3_20220310142339.png "在这里输入图片标题")
![输入图片说明](https://jeecgos.oss-cn-beijing.aliyuncs.com/files/site/vue3_20220310142409.png "在这里输入图片标题")
![输入图片说明](https://jeecgos.oss-cn-beijing.aliyuncs.com/files/site/vue3_20220310142401.png "在这里输入图片标题")
![输入图片说明](https://jeecgos.oss-cn-beijing.aliyuncs.com/files/site/vue3_11.png "在这里输入图片标题")







