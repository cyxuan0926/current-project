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
