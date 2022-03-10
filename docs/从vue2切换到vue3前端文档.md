## 如何切换到 Vue3前端

- 第一步：执行执行脚本 `Vue3升级脚本_mysql.sql`。

> 这个sql脚本做了什么？
> - 1、把原来的表名sys_permission改为sys_permission_v2
> - 2、插入了新的sys_permission数据
>
> 因为vue3和vue2的菜单路由配置不一样，所以当前是通过切换表来实现vue3和vue2的切换。


- 第二步：登录进系统，给admin角色分配所有的菜单
- 第三步：退出登录即可
