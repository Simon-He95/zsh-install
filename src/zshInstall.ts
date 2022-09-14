import { jsShell } from 'simon-js-tool'

export function install() {
  const zsh_path = `${jsShell('echo $HOME')?.toString().trim()}/.oh-my-zsh/custom`
  jsShell([
    'wget https://gitee.com/Jiepq/ohmyzsh/blob/master/tools/install.sh && sh install.sh ', // 安装oh my zsh
    'rm - rf install.sh', // 删除安装脚本
    `git clone https://gitee.com/xiaoqqya/spaceship-prompt.git "${zsh_path}/themes/spaceship-prompt" --depth=1`, // 安装 spaceship-prompt
    `ln -s "${zsh_path}/themes/spaceship-prompt/spaceship.zsh-theme" "${zsh_path}/themes/spaceship.zsh-theme"`, // 创建软连接
    `git clone https://gitee.com/yanzhongqian/zsh-autosuggestions.git ${zsh_path}/plugins/zsh-autosuggestions`, // 安装 zsh-autosuggestions
    `git clone https://gitee.com/lightnear/zsh-syntax-highlighting.git ${zsh_path}/plugins/zsh-syntax-highlighting`, // 安装 zsh-syntax-highlighting
    'git clone https://gitee.com/github-mirror-zsh/zsh-z.git ${ZSH:-~/.oh-my-zsh/custom}/plugins/zsh-z', // 安装 zsh-z
    `result=$(cat ~/.zshrc | sed  's/ZSH_THEME="robbyrussell"/ZSH_THEME="spaceship"/g' | sed  "s/plugins=(git)/plugins=(git zsh-z zsh-autosuggestions zsh-syntax-highlighting)/g") 
   cat>~/.zshrc<<EOF
   $result
   `, // 修改配置文件
  ])
}

install()
