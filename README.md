# 心跳交点：周子清的奇妙日常

可安装、离线运行的 Galgame PWA 原型。原作设定包含现代都市与大学生活、八位可攻略角色、普通与腹黑选择、好感度、手机消息及本地存档。

## 本地运行

```bash
python3 -m http.server 4173
```

打开 <http://localhost:4173>。

PWA 的离线与安装功能需要通过 HTTP/HTTPS 提供，不要直接双击 `index.html`。

## GitHub Pages 部署

1. 打开仓库 **Settings → Pages**。
2. **Source** 选择 **Deploy from a branch**。
3. Branch 选择 `main`，目录选择 `/(root)`。
4. 保存后等待几分钟。

上线地址通常为：

`https://27ylhm9.github.io/heartbeat-intersection-pwa/`

## 功能

- 八位角色与专属地点入口
- 城市侧栏地图与角色切换
- 普通选择与腹黑选择
- 动态好感度及本地存档
- 手机消息与未读提示
- 移动端响应式界面
- Web App Manifest 与离线 Service Worker
- 浏览器支持时可安装到桌面或主屏幕

## 当前素材

立绘采用纯 CSS 渲染占位设计，后续可替换为正式角色画、差分、CG、BGM、音效与 CV。
