acm_www 前端发布流程 0.

1. 本机先验证，打包
   开发环境
   npm run dev

生产环境
npm run build

39 地址
http://39.100.102.69

Webstorm/View/Tool Windows/Terminal 打开终端
rm -rf src.tar.gz && tar --exclude node_modules --exclude .git --exclude .idea --exclude .next --exclude .DS_Store -zcvf src.tar.gz ./

scp -r src.tar.gz root@47.92.71.117:~ （密码 Wisdom83248380 ）

2. 程序更新
   ssh root@47.92.71.117 （密码 Wisdom83248380 ）
   启动程序 ./start-sanyzg-cloud.sh
   顺序执行如下操作：
   npm install
   npm run build
   npm run start

出现字样，说明发布成功了

> wisdom@1.0.0 start /app
> next start
> Ready on http://localhost:3000

3. 测试
   http://47.92.71.117:13000/home (端口是 13000，不是 3000)
