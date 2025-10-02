# 修复 Steam Link 连接问题

最近用 Steam Link + iPad 玩了《波斯王子》，感觉流畅性挺好，几乎没有卡顿，而且支持用手柄体验。不过有个问题：**每次重连时都会弹出一个提示框**。

提示框内容如下：

```text
Steam Input

Would you like to accept secure desktop input from Steam?
You must respond to this dialog while sitting at the PC. If you are seeing this when you aren't using a controller or Steam Remote Play then you should check your PC for malware.
OK Cancel
```

意思是：Steam 需要你坐在 PC 前手动确认才能继续使用 Steam Link。如果不点击这个提示，无法直接继续游戏。而且**不能用 Steam Link 远程点击**，必须在被控的 PC（以下简称 A）上用鼠标或键盘操作才行。

更麻烦的是，如果你用另一台电脑（以下简称 B）通过远程桌面连接到 A，提示框并不会在 B 上显示，也无法操作。

---

## 原因分析

Windows 支持多个终端会话控制。例如：

- 本地物理终端（A 接入的键盘鼠标）
- 远程桌面（RDP）等软件通过另一台电脑（B）连接到 A

当你通过 RDP 登录时，系统会切换到一个新的会话（Session），而 Steam Link（以下简称 C）在连接时，是绑定到 **console 会话**（本地物理机的桌面）。

问题在于：Steam Link 无法像 RDP 那样直接「踢掉」当前会话或切换会话，导致你必须手动把控制权交给它。

---

## 解决方法

可以用另一台电脑（B）连接到 A，并执行会话切换，让控制权转到 Steam Link。

在 B 上，以管理员权限打开 PowerShell，输入：

```powershell
# 查询当前的会话连接情况
query session
```

假设输出如下：

```text
PS C:\WINDOWS\system32> query session
 会话名               用户名                 ID  状态     类型        设备
 services                                            0  断开
>rdp-tcp#0                 mynzelo                   1  运行中
 console                                             3  已连接
 rdp-tcp                                         65536  侦听
```

可以看到：

- 运行中的会话：`rdp-tcp#0`（ID=1），即你当前通过 B 远程控制 A 的会话
- `console` 会话：Steam Link 所连接的会话（已连接但未运行）

要切换到 `console`，执行以下命令：

```powershell
# 将控制权转移到 Steam Link（console 会话）
tscon 1 /password:123456 /dest:console
```

这样，Steam Link 就可以直接控制 A，无需在 PC 前手动确认。

---

## 自动化方案

手动操作虽然可行，但还是不够方便。可以用自动化软件将整个流程串起来，大致步骤如下：

1. 在 iPad 上运行 Steam Link
2. 使用自动化工具（如 Workflows、Home Assistant、IFTTT 等）触发通知到 A（HTTP 请求、邮件等方式都可以）
3. A 收到触发信号后，自动执行 PowerShell 脚本完成会话切换

这样就可以实现「无需在 PC 前点击弹窗，直接进入游戏」。

---

## 参考链接

- [Steam Link 会话切换解决方案](https://johnlyu.com/2022/06/11/steam/)

---
