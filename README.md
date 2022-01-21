## 提交代码

```sh
npm run commit
```

[采用 Angular 团队的规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)，禁止使用 `git commit` 提交代码

## 部署

```sh
npm run deploy:test # 测试环境部署
npm run deploy:prod # 生产环境部署
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build:dev [--report]
npm run build:test [--report]
npm run build:prod [--report]

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 堡垒机
服务器：8.129.125.40:60022

# 预发布环境
服务器：47.119.192.31/172.18.139.27
路径： /mnt/projects/nginx/www
appVersion: 9999

# 生产环境
服务器：39.108.185.51/172.18.85.104
路径： /mnt/projects/nginxnew/www
appVersion: 根据版本号确定

# 测试环境
服务器：47.107.245.151
路径： /mnt/projects/nginx/www