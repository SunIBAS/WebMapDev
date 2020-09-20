###### 之前的内容放置在 20200721 中 [readme](./20200721/README.md)

---

### geo 本地测试

```
测试可以使用 docker (可以编写一个 dockerfile 完成一些动作)
docker pull winsent/geoserver:2.13
启动成功后，docker exec -it {id} /bin/bash
修改文件 /opt/geoserver/webapps/geoserver/WEB-INF/web.xml
停止 docker stop {id}
保存为新镜像 docker commit {id} geoserver-tmp
启动并挂载需要的内容
docker run -d -p 8088:8080 -v "C:\Users\HUZENGYUN\Documents\git\demo\result":/home/data geoserver-tmp
8088 是要被访问的端口，
http://localhost:8088/geoserver
```

[现有例子的展示](https://www.bilibili.com/video/BV1Hy4y1k75d/)

[地图开发指南](./地图开发指南.md)

[现有插件说明](./现有插件说明.md)