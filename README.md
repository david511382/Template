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

## Node.js

到官網下載
https://nodejs.org/en/download/current

## Docker

管理應用系統用，用完要關掉，不然會很耗資源

到官網下載
https://www.docker.com/products/docker-desktop/

# 部屬

## 本地啟動

1. 開啟 Docker
1. 用VScode開啟程式資料夾
1. Ctrl+` 開啟終端機，在+號旁邊下拉選單，Select Defualt Profile，Git Bash
1. Ctrl+Shift+` 開啟終端機，執行 pnpm docker:dev
1. 開啟前台 http://localhost:3000
1. 開啟後台 http://localhost:3000/manager/login

## 打包ISO

作業系統：Ubuntu 22.04.4  
ISO檔：ubuntu-22.04.4-live-server-amd64  

1. 本地建立VM，[參考資料](https://ticyyang.medium.com/linux-%E5%9C%96%E8%A7%A3%E9%80%8F%E9%81%8Evmware-workstation-17-player%E5%AE%89%E8%A3%9Dubuntu-server-22-04-lts-5619ab77a748)
1. 本地與VM共享程式碼
1. VM中安裝Docker
1. VM中建置系統

### 本地與VM共享程式碼

VM綁上共享資料夾
``` bash
sudo vmhgfs-fuse .host:/ /mnt/hgfs/ -o allow_other -o uid=1000
```

複製至其他目錄
``` bash
sudo cp -r /mnt/hgfs/login-manager /run/login-manager
```

安裝基礎套件
``` bash
sudo apt update -y
sudo apt install dos2unix -y
cd /run/login-manager
find ./script -type f -print0 | sudo xargs -0 dos2unix
sudo ./script/ubuntu-setup.sh
```

完成後可以用本地ssh連線或繼續使用VM中的終端機，[參考資料](https://seanhung365.pixnet.net/blog/post/212779848-ubuntu-%E5%AE%89%E8%A3%9D%E5%92%8C%E5%95%9F%E7%94%A8-ssh-%E7%99%BB%E5%85%A5)

#### 參考資料

https://mapostech.com/shared-folder/

### 安裝 docker docker-compose

``` bash
sudo ./script/docker-setup.sh
```

### 啟動程式

``` bash
sudo sh ./script/load-config.sh prod
sudo docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d --remove-orphans
```

## DMZ

VPN連線登記系統_19.30.46  
Ubuntu Linux (64-bit)  

### 首次

1. 打包ISO
1. 匯出OVF檔案
1. 掛載到VM上
1. 掛載到VM上

#### 參考資料

https://www.kmp.tw/post/exportvmwareplayertoovf/

### 更新程式

1. 先複製一份程式碼
1. 在該程式碼執行指令`pnpm i`
1. 掛載到VM上

# 帳號

## PA-3260-SSLVPN

身分|帳號|密碼|時限
---|---|---|---
管理員|webber|!QAZ2wsx|90天換密碼
使用者|david511382|!QAZ2wsx3edc|無期限

### 更新管理員帳號或密碼

系統是用管理員帳號(webber)操作防火牆，要是更改的話要重新生成密鑰，並更新程式。

1. 更新 /script/firewall-keygen.sh 中的帳號密碼(user, password)
2. 執行 ./script/firewall-keygen.sh
3. 執行後會得到下面這樣的結果，其中<key>與</key>之間的是密鑰
``` html
<response status = 'success'><result><key>LUFRPT14ZEdoMTlKVnJ5SEpvNWRVckdjNzhlYXNxUFE9UHdCcHZwb3d2RkZZeStpc0hLb2dQS2x3Rkp0alZ6QUpmajdVTDM0TGtYYU53czMzSUdWQ21pdDdSRFF0M3BmZg==</key></result></response>
```
4. 更新密鑰，打開`/config/.prod.env`、`/config/.dev.env`、`/config/.debug.env`檔案，搜尋FIREWALL_CREDENTIAL，其`FIREWALL_CREDENTIAL=`後面換上密鑰
5. 重啟程式
