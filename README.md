# 概述
这个 DEMO 是一个可以完整控制小米智能灯的开关，亮度，色温的爱智应用，具有以下特性：
+ 支持控制智能灯开关。
+ 支持智能灯亮度调节。
+ 支持智能灯色温调节。
# 前端构建说明
+ 技术架构
	- 框架：【[Vue](https://cn.vuejs.org/)】
	- UI：【[Vant](https://vant-contrib.gitee.io/vant/#/zh-CN/)】
+ 构建方式
	+ 安装 `node` 环境。
	+ 执行 `npm install -g @vue/cli` 安装 `Vue` 脚手架。
	+ 用 `vscode` 打开 `web` 文件夹。
	+ 快捷键 `Ctrl` + `Shift` + <code> &#96;</code>  打开 `vscode terminal`。
	+ 执行 `npm install` 安装项目所有依赖。
	+ 运行 `npm run build` 构建项目。
	+ 构建完后会生成一个 `dist`  文件夹，里面就是构建后的代码。

+ 依赖说明
	+ `socket.io-client` : 用于与服务端的双向即时通讯。
	+ `ue-socket.io-extended` : `socket.io-client` 在 `Vue` 项目里的扩展包，便于开发者开发。
	+ `@edgeros/web-sdk`: 爱智提供与`edgeros`交互的前端`api`接口,在此项目中用于获取用户`token` 等信息。

# 环境配置

- 设备获取
	- 绿米Aqara 智能LED灯泡( `ZigBee` 版)  ： 【 [绿米Aqara 智能LED灯泡](https://item.jd.com/100002262502.html) 】 。
	- `Spirit1`  :  【 [ THINGS 翼辉官方店 ](https://shop328678746.taobao.com/?spm=a1z10.1-c-s.0.0.6d16d0a1lA0llo)】。
	- 灯座：【 [台灯E27螺口插头插电节能LED灯泡 ](https://item.jd.com/50707209045.html) 】。
- 设备连接
	- 在 【爱智】-> 【设备管理】中，点击  `+`  发现设备。
	- 按绿米Aqara 智能LED灯泡使用说明，连续开关灯座开关三次直到智能灯开始闪烁。
	- 在 【爱智】-> 【设备管理】中搜索到设备后选择添加，在设备列表中可以查看新增的智能插座设备。