export enum ErrorCode {
  SUCCESS = 'OK',
  
  LOGIN_FAIL = '登入失敗',
  VERIFY_FAIL = '驗證失敗',
  
  NOT_FOUND = '查無資料',
  ERR_MSG_ACCOUNT_NOT_EXIST= '帳號不存在',
  EXISTING = '已存在',
  
  EXEC_FAIL = '執行失敗',
  SYSTEM_FAIL = '系統錯誤',
  SETTING_FAIL = '%s設定失敗',
  
  WRONG_INPUT = '輸入資料錯誤',
  WRONG_PASSWORD_LENGTH = 'wrong password length',
  
  ERR_MSG_SYSTEM_FAILURE= '系統操作失敗，請聯絡管理員',
  PROCESSING = '執行中',
  TIMEOUT = '%s執行時間過長，強制中斷，請確認服務或網路是否正常',
  ERR_MSG_TRY_LATER= '請稍後再試',
  
  CACHED = '資料未變動',
  
  LOGIN_REQUIRED = '你已於%s登記完成，承辦人員尚未核可',
}
