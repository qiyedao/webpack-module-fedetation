# github-twmku5

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/github-twmku5)

# windows 管理端口

```js
netstat -ano | findstr 端口号
tasklist | findstr 进程号
taskkill -PID 进程号 -F
```

# 启动项目

```js
1.  yarn
2. yarn start

```

# 项目打包

```js
yarn build

```

# 项目部署

```js


docker build -t 镜像名  Dockerfile目录

docker run -p 8520:80 -d --name 容器名 镜像名

docker exec -it 容器名 /bin/bash


docker export 镜像id > name.tar
docker import - 镜像名 < name.tar

docker save -o images.tar 镜像名1 镜像名2
docker load < images.tar

docker inspect 镜像名
docker tag 镜像名 标签
```
