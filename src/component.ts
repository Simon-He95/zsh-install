import { jsShell } from 'simon-js-tool'

function install() {
  // jsShell('sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"')
  // 安装 spaceship-prompt
  jsShell('git clone https://github.com/spaceship-prompt/spaceship-prompt.git "$ZSH/themes/spaceship-prompt" --depth=1')
  jsShell('ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH/themes/spaceship.zsh-theme"')
  // 安装 zsh-autosuggestions
  jsShell('git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH/plugins/zsh-autosuggestions')
  // 安装 zsh-syntax-highlighting
  jsShell('git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH/plugins/zsh-syntax-highlighting')
  // 安装 zsh-z
  jsShell('git clone https://github.com/agkozak/zsh-z ${ZSH:-~/.oh-my-zsh/custom}/plugins/zsh-z')
  // plugins写入.zshrc
  jsShell(`result=$(cat ~/.zshrc | sed  's/ZSH_THEME="robbyrussell"/ZSH_THEME="spaceship"/g' | sed  "s/plugins=(git)/plugins=(git zsh-z zsh-autosuggestions zsh-syntax-highlighting)/g") 
   cat>~/.zshrc<<EOF
   $result
   `)
  // 更新zshrc
  // jsShell('source ~/.zshrc')
}
install()
