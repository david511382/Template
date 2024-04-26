# 業務邏輯

## 名詞定義

申請時間: 廠商登記時間  
連線時間: 廠商要求開始連線時間  
連線結束時間: 關閉連線時間  
連線區間: 廠商要求開始連線直到關閉連線時間區間  
  
未批核: 廠商已提交，但承辦人尚未操作  
批核: 廠商已提交，承辦人已操作  
核准: 批核之操作，允許連線  
拒絕: 批核之操作，拒絕連線  

## 邏輯

1. 每次連線時間持續八個小時，時間到會由系統關閉防火牆
2. 為了限制廠商連線時間，連線時間必須與申請時間同天
3. 為了方便管理連線時間，連線時間只精準到分
4. 為了避免廠商重複申請，連線時間與連線結束時間不得於未批核連線區間之中，且連線時間不得與核准連線時間相同
5. 為了方便廠商展延時間，連線區間得於核准連線區間之中

# 帳號

系統使用帳號 webber 的權限操作防火牆

# 開發工具

## Git

版本控管用，要用到他的指令

到官網下載
https://git-scm.com/downloads

## Vscode 

編輯檔案，用他比較方便

到官網下載
https://code.visualstudio.com/download

### 安裝外掛

1. 開啟Vscode
1. 輸入Ctrl+Shift+X
1. 搜尋並安裝套件
1. 安裝後關閉Vscode並重新打開

### 外掛清單

* Git History(Git用，可以不需要)
* Markdown Preview Mermaid Support(查看.md檔案，安裝後可以 Ctrl+K 後按 V 查看，可以不需要)

## PNPM

管理Nodejs套件用

Powershell執行指令
``` sh
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 參考資料

https://pnpm.io/zh-TW/installation

## Docker

管理應用系統用，用完要關掉，不然會很耗資源

到官網下載
https://www.docker.com/products/docker-desktop/

# 部屬

## 本地啟動

1. 開啟 Docker
1. 用VScode開啟程式資料夾
1. Ctrl+` 開啟終端機，+號旁邊下拉選單，Select Defualt Profile，Git Bash
1. Ctrl+Shift+` 開啟終端機，執行 pnpm docker:dev
1. 開啟前台 http://localhost:3000
1. 開啟後台 http://localhost:3000/manager/login

## 打包ISO

1. 本地建立VM
1. 本地與VM共享程式碼
1. VM中安裝Docker
1. VM中建置系統

### 本地建立VM

作業系統：Ubuntu 22.04.4

安裝基礎套件
``` bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### 參考資料

https://ticyyang.medium.com/linux-%E5%9C%96%E8%A7%A3%E9%80%8F%E9%81%8Evmware-workstation-17-player%E5%AE%89%E8%A3%9Dubuntu-server-22-04-lts-5619ab77a748

### 本地與VM共享程式碼

``` bash
sudo vmhgfs-fuse .host:/ /mnt/hgfs/ -o allow_other -o uid=1000
```

複製至其他目錄
``` bash
sudo cp -r login-manager /run/login-manager
```

#### 參考資料
https://mapostech.com/shared-folder/




### 安裝 docker docker-compose

``` bash
sudo apt-get update
sudo apt-get upgrade
curl -sSL https://get.docker.com/ubuntu/ | sudo sh

sudo apt update -y
sudo apt install ca-certificates curl gnupg lsb-release
sudo mkdir /etc/apt/dockerkeyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/dockerkeyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/dockerkeyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update -y
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

設定開機啟動與啟動 docker 服務
rc-service docker start
rc-update add docker
其他處理議題
非 root 使用 docker 的權限設定
參考 - https://superuser.com/questions/1395473/usermod-equivalent-for-alpine-linux
Exp. jonathan 可以執行 docker 權限
su - root
addgroup jonathan docker
在 PVE7 的 LXC 內無法啟動 docker 服務
參考
https://forum.proxmox.com/threads/run-docker-inside-lxc.112004/
https://forum.proxmox.com/threads/docker-failed-to-register-layer-applylayer-exit-status-1-stdout-stderr-unlinkat-var-log-apt-invalid-argument.119954/
需要在 /etc/pve/lxc/ID.conf 內增加
lxc.apparmor.profile: unconfined
lxc.cap.drop:
這樣才能啟動 docker 服務

需要在 /etc/docker/daemon.json 內設定 “storage-driver”: “vfs” 才能將拉下來的 docker images 寫入
如果擔心 docker log 長太大也可以在 /etc/docker/daemon.json 內設定自動分割與刪除 Exp. log size 最大 10m, 保留最近 3 份
{
  "storage-driver": "vfs",
  "log-opts": {"max-size": "10m", "max-file": "3"}
}

## 參考資料
https://alpinelinux.org/downloads/
https://www.ichiayi.com/tech/alpine_docker
