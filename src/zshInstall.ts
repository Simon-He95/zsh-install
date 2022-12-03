import { isWin, jsShell } from 'simon-js-tool'
import ora from 'ora'
import figlet from 'figlet'

const THEME = /(ZSH_THEME=)"\w+"/
const PLUGINS = /(plugins=)\([\w\s]+\)/mg

export async function install() {
  if (isWin()) {
    console.log('You need to run on linux or macos')
    return
  }
  const hasBrew = (jsShell('brew -v') as string).startsWith('Homebrew')
  if (!hasBrew) {
    console.log('brew not found, install brew first')
    const spinner = ora({ text: 'Loading install brew', color: 'yellow', spinner: 'aesthetic' }).start()
    await jsShell('/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"', true) // install brew
    spinner.succeed('brew installed successfully')
  }

  const hasGum = (jsShell('gum -v') as string).startsWith('gum version')
  if (!hasGum) {
    console.log('gum not found, install gum first')
    const spinner = ora({ text: 'Loading install gum', color: 'yellow', spinner: 'aesthetic' }).start()
    await jsShell('brew install gum', true) // install gum
    spinner.succeed('gum installed successfully')
  }

  const base = [
    'ohmyzsh',
    'spaceship',
    'autosuggestions',
    'autocomplete',
    'syntaxhighlighting',
    'z',
    'vscode',
  ]
  console.log('Select additional required plugins:')
  const chooseOption = [
    'fnm',
    'degit',
    'ni',
    'pi',
    'ccommand',
    'pnpm',
    'yarn',
    'esno',
    'bun',
    'rimraf',
  ]
  const choose = (jsShell(`gum choose ${chooseOption.join(' ')} --no-limit`) as string).trim().split('\n') as string[]

  let zshrc = (jsShell('cat ~/.zshrc') as string).replace(THEME, '$1"spaceship"').replace(PLUGINS, '$1"git vscode zsh-z zsh-autosuggestions zsh-syntax-highlighting"')

  const allCommanders = [...base, ...choose]

  allCommanders.forEach(async (key) => {
    const { command, isInstalled, source } = getPlugin(key)
    const spinner = ora({ text: `Loading install ${key}`, color: 'yellow', spinner: 'aesthetic' }).start()
    if (!jsShell(isInstalled)) {
      zshrc += source
      await jsShell(command)
      spinner.succeed(`${key} installed successfully`)
    }
    spinner.succeed(`${key} is installed`)
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
      source: '$HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions/zsh-autosuggestions.plugin.zsh',
    },
    autocomplete: {
      command: `https://gitee.com/mirrors_marlonrichert/zsh-autocomplete.git ${zsh_path}/plugins/zsh-autocomplete`,
      isInstalled: `test -d ${zsh_path}/plugins/zsh-autocomplete && echo "isInstalled"`,
      source: '$HOME/.oh-my-zsh/custom/plugins/zsh-autocomplete/zsh-autocomplete.plugin.zsh',
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
    vscode: {
      command: `git clone https://github.com/valentinocossar/vscode.git ${zsh_path}/plugins/vscode`,
      isInstalled: `test -d ${zsh_path}/plugins/vscode && echo "isInstalled"`,
      source: '',
    },
    fnm: {
      command: 'brew install fnm',
      isInstalled: 'fnm -help',
      source: 'eval "$(fnm env --use-on-cd)"',
    },
    degit: {
      command: 'npm i -g degit',
      isInstalled: 'test -d ~/.degit && echo "isInstalled"',
      source: '',
    },
    ni: {
      command: 'npm i -g ni',
      isInstalled: 'ni -help',
      source: '',
    },
    pi: {
      command: 'npm i -g @simon_he/pi',
      isInstalled: 'pi -help',
      source: '',
    },
    ccommand: {
      command: 'npm i -g ccommand',
      isInstalled: 'ccommand -v && echo "isInstalled"',
      source: '',
    },
    pnpm: {
      command: 'npm i -g pnpm',
      isInstalled: 'pnpm -v && echo "isInstalled"',
      source: '',
    },
    yarn: {
      command: 'npm i -g yarn',
      isInstalled: 'yarn -v && echo "isInstalled"',
      source: '',
    },
    esno: {
      command: 'npm i -g esno',
      isInstalled: 'esno -v && echo "isInstalled"',
      source: '',
    },
    rimraf: {
      command: 'npm i -g rimraf',
      isInstalled: 'rimraf --help && echo "isInstalled"',
      source: '',
    },
    bun: {
      command: 'brew install bun',
      isInstalled: 'test -d ~/.bun && echo "isInstalled"',
      source: '',
    },
  }
  return plugins[key as keyof typeof plugins]
}

figlet('ccommand', (err, message) => {
  if (err)
    return console.log('Something went wrong...')
  console.log(message)
  install()
})

