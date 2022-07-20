## 切换到 Vue3菜单路由

- 第一步：执行SQL脚本
```
alter table sys_permission rename as sys_permission_v2;
alter table sys_permission_v3 rename as sys_permission;
```

> 这个 sql 脚本做了什么？
> - 1、把表名 sys_permission 备份改为 sys_permission_v2
> - 2、把 sys_permission_v3 改为 sys_permission
> 说明：因为 vue3 和 vue2 的菜单配置不一样，所以通过切换表来实现 vue3 和 vue2 的切换。

- 第二步：登录进系统

> 从 jeecgboot3.3.0 版本默认 vue3 和 vue2 的权限都已经分配好， 不需要再手工授权。
