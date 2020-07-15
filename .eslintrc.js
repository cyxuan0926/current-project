// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/strongly-recommended',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: ['vue', 'html'],
  // add your custom rules here
  settings: {
      'import/resolver': {
          'webpack': {
              'config': 'build/webpack.base.conf.js'
          }
      }
  },
  rules: {
    // 禁止生产环境带有调试语句
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 禁止在条件中使用常量表达式
    "no-constant-condition": 2,
    // 禁止不必要的括号 //(a * b) + c;//报错
    "no-extra-parens": 0,
    // 禁止不必要的分号
    "no-extra-semi": 2,
    // 禁止在return、throw、continue 和 break语句之后出现不可达代码
    "no-unreachable": 2,
    // 控制逗号前后的空格
    "comma-spacing": [2, {"before": false, "after": true}],
    // 连续声明
    'one-var': [2, { var: 'always', let: 'always', const: 'never' }],
    // switch 必须带有default
    'default-case': 2,
    // 变量的解构赋值前后必须有空格
    'object-curly-spacing': [2, 'always'],
    // 模板字符串中使用${ 和 } 包含的表达式前后是否需要留空格
    'template-curly-spacing': ['error', 'always'],
    // 四个空格缩进,switch缩进风格
    'indent': [0, 2, { 'SwitchCase': 1 }],
    // 在进行比较时，必须使用全等=== 和完全不等!==
    'eqeqeq': [2, 'allow-null'],
    //大括号的样式,允许单行样式
    'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
    // 要求使用模板字面量而非字符串连接
    'prefer-template': 2,
    //函数()前不能有括号
    'space-before-function-paren': [2, 'never'],
    'no-unused-expressions': 0,
    'prefer-promise-reject-errors': 0,
    'no-useless-return': 0,
    'no-multiple-empty-lines': 0,
    'no-new-object': 0
  }
};
