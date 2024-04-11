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

./doc/docker.sh


核准列表可排序與篩選

批次審核

測試 Internal jwt時效

enable bigint firewall