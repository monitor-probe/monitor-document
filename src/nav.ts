// The site map. Titles, sidebar order and the per-page description all live here
// so a page has exactly one name; the MDX files carry body text only. `desc` is
// not rendered on the page -- it feeds the meta description and the search list.
//
// One route prefix per sidebar group, so a path says which group it belongs to.
export type Item = { path: string; label: string; desc: string; keywords?: string }
export type Section = { title: string; items: Item[] }

export const nav: Section[] = [
  {
    title: "开始",
    items: [
      { path: "/guide/introduction", label: "这是什么", desc: "用 Rust 写的服务器探针：能看到什么，由哪几部分组成。", keywords: "简介 introduction 组成 hub agent 主题" },
      { path: "/guide/philosophy", label: "设计哲学", desc: "安全、极简、高效三条取舍的理由，以及明确不做的功能。", keywords: "philosophy 极简 安全 高效 不做" },
    ],
  },
  {
    title: "安装",
    items: [
      { path: "/install/quick-start", label: "快速开始", desc: "装 hub、配反向代理、进面板、接入第一个节点。", keywords: "quick start 安装 上手 5 分钟 docker" },
      { path: "/install/hub", label: "安装 hub", desc: "一键脚本的参数、目录与升级，不用脚本时的命令行参数，以及何时需要 --site。", keywords: "install-hub.sh systemd 升级 端口 site listen" },
      { path: "/install/docker", label: "Docker 部署", desc: "docker run 或 compose 部署 hub，以及升级。TZ 必须设。", keywords: "docker compose ghcr dockerhub 镜像 容器 TZ 时区 volume" },
      { path: "/install/reverse-proxy", label: "反向代理", desc: "caddy、nginx、宝塔与 Cloudflare 隧道的配置，四项必需的设置和验证方法。", keywords: "nginx caddy cloudflare tunnel cloudflared 宝塔 aapanel 反代 TLS https 域名 websocket realip" },
      { path: "/install/agent", label: "接入节点", desc: "单台安装、批量安装、换发 token，以及安装脚本的报错对照。", keywords: "agent 节点 install.sh token register 批量 安装 注册 窗口 开机脚本 cloud-init openrc systemd 报错" },
      { path: "/install/batch", label: "批量升级", desc: "agent 的升级命令，以及逐台粘贴、SSH 客户端广播、终端循环几种发到每台机器的做法。", keywords: "批量 升级 upgrade 更新 agent 新版本 多台 广播 循环 ssh 免密 ssh-copy-id powershell windows ansible hosts 名单" },
      { path: "/install/uninstall", label: "卸载", desc: "agent 与 hub 的一键卸载和逐条命令，含 Docker 部署的清理。", keywords: "卸载 uninstall purge 删除 清理 残留 userdel docker volume compose" },
    ],
  },
  {
    title: "配置",
    items: [
      { path: "/config/auth", label: "登录与安全", desc: "应急密码与 GitHub 单点登录的配置，以及登录不通时的排查。", keywords: "github oauth sso 登录 密码 应急 重置 白名单 callback 会话" },
      { path: "/config/nodes", label: "节点", desc: "节点的各项设置、地址与国家的来源、到期与自动续期，以及分组。", keywords: "节点 编辑 公开 隐藏 备注 分组 group 改名 解散 排序 地址 ip 国家 地区 到期 续期 续费 付款周期 价格" },
      { path: "/config/ping", label: "延迟监控", desc: "让节点定时 TCP 连接一个目标，在公开页画出延迟和丢包。", keywords: "延迟 ping tcping 丢包 探测 监控 目标 latency" },
      { path: "/config/traffic", label: "流量统计", desc: "三个流量数字的算法、统计哪些网卡、月度周期与配额口径。", keywords: "流量 traffic 重置日 月流量 计费 sum max 上行 下行 配额 网卡 iface 校正" },
      { path: "/config/notify", label: "通知", desc: "Telegram 与 Webhook 推送掉线、流量、到期和登录，以及常见服务的请求体写法。", keywords: "通知 告警 telegram tg bot webhook discord slack 钉钉 企业微信 飞书 bark ntfy gotify 离线 掉线 到期" },
      { path: "/config/data", label: "数据与备份", desc: "历史保留天数、回收空间、备份与恢复，以及把 hub 搬到另一台机器。", keywords: "数据 备份 恢复 导出 导入 backup restore 迁移 搬家 vacuum 回收空间 保留天数 数据库" },
    ],
  },
  {
    title: "开发指南",
    items: [
      { path: "/dev/theme", label: "主题开发", desc: "主题包格式、可用的接口、到期天数、分组、主题设置、要处理的状态与本地开发。", keywords: "主题 theme theme.json dist 接口 nodes metrics 分组 group config 设置 到期 expires_in 开发 上传 切换" },
      { path: "/dev/architecture", label: "架构与协议", desc: "仓库分工、线上协议、请求路径与八张数据表。", keywords: "架构 architecture 协议 json-rpc websocket 数据表 schema 路由" },
    ],
  },
  {
    title: "参考",
    items: [
      { path: "/reference/performance", label: "性能", desc: "体积、内存、CPU 与响应速度的实测数字，以及调优前后的对比。", keywords: "性能 benchmark 内存 cpu 体积 延迟 压测" },
      { path: "/reference/faq", label: "常见问题", desc: "面板打不开、节点不上线、数字对不上，按现象查。", keywords: "faq 常见问题 排查 离线 掉线 打不开 502 白屏 到期 续期 过期 时区 升级 ipv6 证书" },
    ],
  },
  {
    title: "工具",
    items: [
      { path: "/ai", label: "让 AI 帮你部署", desc: "一段交给能执行命令的 AI 助手的部署提示词，含验证步骤和禁止事项。", keywords: "ai llm claude chatgpt 提示词 prompt 自动部署" },
    ],
  },
]

export const docs: Item[] = nav.flatMap((s) => s.items)
export const sectionOf = (path: string) => nav.find((s) => s.items.some((i) => i.path === path))?.title ?? ""
