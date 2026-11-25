# 心跳交点：周子清的奇妙日常

可安装、离线运行的 Galgame PWA 原型。

## 素材体系

正式立绘、差分和 CG 均放置在 `assets/` 下；此前的占位视觉已改为图片立绘接入。

- `assets/characters/<角色ID>/base.webp`
- `assets/characters/<角色ID>/happy.webp`
- `assets/characters/<角色ID>/shy.webp`
- `assets/cg/`

角色 ID：`zhouziqing`、`liuyi`、`taolu`、`luoye`、`renyu`、`liujia`、`nuer`、`masha`、`fang`。

## 音频

游戏内置 Web Audio 合成的轻音乐与选择音效，并通过浏览器系统语音播放女角色台词占位。正式 CV 可替换为 `speech()` 或扩展为音频资源播放。

## 本地运行

```bash
python3 -m http.server 4173
```

打开 http://localhost:4173。
