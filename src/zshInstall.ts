import { jsShell } from 'simon-js-tool'

const THEME = /(ZSH_THEME=)"\w+"/
const PLUGINS = /(plugins=)\([\w\s]+\)/mg

export async function install() {
  const hasBrew = (jsShell('brew -v') as string).startsWith('Homebrew')
  if (!hasBrew) {
    console.log('brew not found, install brew first')
    jsShell('/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"') // install brew
  }
  const hasGum = (jsShell('gum -v') as string).startsWith('gum version')
  if (!hasGum) {
    console.log('gum not found, install gum first')
    jsShell('brew install gum') // install gum
  }
  const base = [
    'ohmyzsh',
    'spaceship',
    'autosuggestions',
    'syntaxhighlighting',
    'z',
  ]
  console.log('Select additional required plugins:')
  const choose = (jsShell('gum choose "fnm" "degit" "ni" --no-limit') as string).trim().split('\n') as string[]

  let zshrc = (jsShell('cat ~/.zshrc') as string).replace(THEME, '$1"spaceship"').replace(PLUGINS, '$1"git zsh-z zsh-autosuggestions zsh-syntax-highlighting"')

  const allCommanders = [...base, ...choose]
  allCommanders.forEach((key) => {
    const { command, isInstalled, source } = getPlugin(key)
    if (!jsShell(isInstalled)) {
      zshrc += source
      return jsShell(command)
    }
    console.log(`${key} is installed`)
  })
  // 保存zshrc
  jsShell(`echo "${zshrc}" > ~/.zshrc`)
}

function getPlugin(key: string) {
  const zsh_path = `${jsShell('echo $HOME')?.toString().trim()}/.oh-my-zsh/custom`
  const plugins = {
    ohmyzsh: {
      command: 'sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)" && rm -rf install.sh',
      isInstalled: 'test -d ~/.oh-my-zsh && echo "isInstalled"',
      source: '',
    },
    spaceship: {
      command: `git clone https://gitee.com/xiaoqqya/spaceship-prompt.git "${zsh_path}/themes/spaceship-prompt" --depth=1 && ln -s "${zsh_path}/themes/spaceship-prompt/spaceship.zsh-theme" "${zsh_path}/themes/spaceship.zsh-theme"`,
      isInstalled: `test -d ${zsh_path}/themes/spaceship-prompt && echo "isInstalled"`,
      source: '$HOME/.oh-my-zsh/custom/themes/spaceship.zsh-theme',
    },
    autosuggestions: {
      command: `git clone https://gitee.com/yanzhongqian/zsh-autosuggestions.git ${zsh_path}/plugins/zsh-autosuggestions`,
      isInstalled: `test -d ${zsh_path}/plugins/zsh-autosuggestions && echo "isInstalled"`,
      source: '',
    },
    syntaxhighlighting: {
      command: `git clone https://gitee.com/lightnear/zsh-syntax-highlighting.git ${zsh_path}/plugins/zsh-syntax-highlighting`,
      isInstalled: `test -d ${zsh_path}/plugins/zsh-syntax-highlighting && echo "isInstalled"`,
      source: '$HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh',
    },
    z: {
      command: `git clone https://gitee.com/github-mirror-zsh/zsh-z.git ${zsh_path}/plugins/zsh-z`,
      isInstalled: `test -d ${zsh_path}/plugins/zsh-z && echo "isInstalled"`,
      source: '$HOME/.oh-my-zsh/custom/plugins/zsh-z/zsh-z.plugin.zsh',
    },
    fnm: {
      command: 'brew install fnm',
      isInstalled: 'fnm -help',
      source: 'eval "$(fnm env --use-on-cd)"',
    },
    degit: {
      command: 'npm i -g degit',
      isInstalled: 'degit -help',
      source: '',
    },
    ni: {
      command: 'npm i -g ni',
      isInstalled: 'ni -help',
      source: '',
    },
  }
  return plugins[key as keyof typeof plugins]
}

install()
