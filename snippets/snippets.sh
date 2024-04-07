#! /bin/bash

execute_dotenv(){
  # https://stackoverflow.com/a/66118031/134904
  # Note: you might need to replace "\s" with "[[:space:]]"
  TEMP_NAME=envtemp
  cat ./.env | \
    sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g" \
    >> $TEMP_NAME
  source "./$TEMP_NAME"
  rm $TEMP_NAME
}

load_dotenv(){
    set -a
    execute_dotenv $1
    set +a
}

load_dotenv "./.env"
ROOT=$(pwd)

# 打包插件
package_extension() {
    echo "開始打包插件...\n"
    cd ./snippets

    # 檢查是否有安裝 vsce 指令
    if ! command -v vsce &>/dev/null; then
        pnpm i -g vsce
    fi

    vsce package -o "$ROOT/$APP_NAME-snippets.vsix"

    if [ $? -eq 0 ];
    then
        echo "\n打包完成！\n"
    else
        echo "\n打包失敗！\n"
        break
    fi
}

# 安裝插件
install_extension() {
    echo "開始安裝插件... \n"
    code --install-extension $ROOT/$APP_NAME-snippets.vsix

    if [ $? -eq 0 ]; then
        echo "\n安裝成功！"
    else
        echo "\n安裝失敗！請確認是否有'" + $APP_NAME + "-snippets.vsix'"
    fi
}

# 清理插件
delete_extension() {
    echo "清理插件... \n"
    rm $ROOT/$APP_NAME-snippets.vsix
}

package_extension
install_extension
delete_extension