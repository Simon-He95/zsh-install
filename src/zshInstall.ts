import path from 'path'
import { argv } from 'process'
import { fileCopy, isWin, jsShell } from 'simon-js-tool'
import ora from 'ora'
import figlet from 'figlet'
import colorize from '@simon_he/colorize'
import { version } from '../package.json'

const THEME = /(ZSH_THEME=)"\w+"/
const PLUGINS = /(plugins=)\([\w\s]+\)/mg
const commonPlugin = '~/.oh-my-zsh/plugins'
const customPlugin = '~/.oh-my-zsh/custom/plugins'
const customTheme = '~/.oh-my-zsh/custom/themes'
const log = console.log

async function install() {
  if (isWin()) {
    log(colorize({ color: 'yellow', text: 'You need to run on linux or macos' }))
    return
  }
  const hasBrew = (jsShell('brew -v', 'pipe').result).startsWith('Homebrew')
  if (!hasBrew) {
    log(colorize({ color: 'magenta', text: 'brew not found, starting to install brew' }))
    const spinner = ora({ text: 'Loading install brew', color: 'yellow', spinner: 'aesthetic' }).start()
    await jsShell('/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"', true) // install brew
    spinner.succeed('brew installed successfully')
  }

  const hasGum = (jsShell('gum -v', 'pipe').result).startsWith('gum version')
  if (!hasGum) {
    log(colorize({ color: 'magenta', text: 'gum not found, starting to install gum' }))
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
  ]
  log(colorize({ color: 'blue', text: 'Select additional required plugins:' }))

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
  const choose = jsShell(`gum choose ${chooseOption.join(' ')} --no-limit`, 'pipe').result.trim().split('\n') as string[]
  let zshrc = jsShell('cat ~/.zshrc', 'pipe').result.replace(THEME, '$1"spaceship"').replace(PLUGINS, '$1"git zsh-z zsh-autosuggestions zsh-syntax-highlighting"')

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
  const plugins = {
    ohmyzsh: {
      command: 'sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)" && rm -rf install.sh',
      isInstalled: 'test -d ~/.oh-my-zsh && echo "isInstalled"',
      source: '',
    },
    spaceship: {
      command: `git clone https://gitee.com/xiaoqqya/spaceship-prompt.git "${customTheme}/spaceship-prompt" --depth=1 && ln -s "${customTheme}spaceship-prompt/spaceship.zsh-theme" "${customTheme}/spaceship.zsh-theme"`,
      isInstalled: `test -d ${customTheme}/spaceship-prompt && echo "isInstalled"`,
      source: `${customTheme}/spaceship.zsh-theme`,
    },
    autosuggestions: {
      command: `git clone https://gitee.com/yanzhongqian/zsh-autosuggestions.git ${customPlugin}/zsh-autosuggestions`,
      isInstalled: `test -d ${customPlugin}/zsh-autosuggestions && echo "isInstalled"`,
      source: `${customPlugin}/zsh-autosuggestions/zsh-autosuggestions.plugin.zsh`,
    },
    autocomplete: {
      command: `https://gitee.com/mirrors_marlonrichert/zsh-autocomplete.git ${customPlugin}/zsh-autocomplete`,
      isInstalled: `test -d ${customPlugin}/zsh-autocomplete && echo "isInstalled"`,
      source: `${customPlugin}/zsh-autocomplete/zsh-autocomplete.plugin.zsh`,
    },
    syntaxhighlighting: {
      command: `git clone https://gitee.com/lightnear/zsh-syntax-highlighting.git ${customPlugin}/zsh-syntax-highlighting`,
      isInstalled: `test -d ${customPlugin}/zsh-syntax-highlighting && echo "isInstalled"`,
      source: `${customPlugin}/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh`,
    },
    z: {
      command: `git clone https://gitee.com/github-mirror-zsh/zsh-z.git ${customPlugin}/zsh-z`,
      isInstalled: `test -d ${customPlugin}/plugins/zsh-z && echo "isInstalled"`,
      source: `${customPlugin}/zsh-z/zsh-z.plugin.zsh`,
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

export function run() {
  const params = argv[2]
  if (params === '-v' || params === 'version') {
    log(colorize({ color: 'magenta', text: `zsh-install version: ${version}` }))
    return
  }
  figlet('ccommand', (err, message) => {
    if (err)
      return log(colorize({ color: 'red', text: 'Something went wrong...' }))
    log(colorize({ color: 'magenta', text: message! }))
    install()
  })
  copyCommonPlugins()
}

function copyCommonPlugins() {
  const plugins = ['git', 'last-working-dir', 'web-search']
  const urls = plugins.map(plugin => path.resolve(__dirname, `../plugins/${plugin}`))
  const { status, result } = fileCopy(urls, commonPlugin)
  if (status === 0)
    log(colorize({ color: 'green', text: 'common-plugin copy successfully 🎉' }))
  else
    throw new Error(result)
}
run()

run()
