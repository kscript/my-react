## my-react


## 命令
### 安装
``` npm
npm i

``` 
### 编译前端资源
``` npm
// 编译前端 -> 抽取模块提供给浏览器
npm run source

// 抽取模块
npm run browserify
```

### 编译服务端代码
``` npm
npm run server
```

### 运行服务器
``` npm
npm run app
```

### 构建应用
``` npm
// 编译前端 -> 编译服务端 -> 运行
npm run build
```

> 构建应用可以分开执行, 编译服务端 和 运行服务器 依赖上一步的结果
