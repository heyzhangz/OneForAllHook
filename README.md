# OneForAllHook
an simple tools to hook class methods 

## 简介
​	转向使用typescript开发Frida脚本，便于后续工程化以及模块化。搭建Typescript需要node环境和npm，都要安装最新版

## 使用
​	下载：`git clone https://github.com/b1ackm4x/OneForAllHook.git`
​	初始化环境： `npm install`
​	因为使用typescript，frida的原生js引擎并不支持，所以要每次把typescript编译成他那个引擎支持的js.

​	编译： `frida-compile -o _agent.js index.ts`

​	如果没有安装frida-compile,要先安装	`npm install frida-compile -g`

​	更方便的是直接开个新shell直接监控变化自动编译 `npm run watch`，编译完的文件名是`_agent.js`，剩下的和原始Frida使用方式就一样了。	

​	提供一个简单的注入python脚本`hook_start.py`
​    `python3 hook_start.py com.example.package`