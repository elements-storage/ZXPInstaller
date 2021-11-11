import { getErrorMessage } from './messages.js'
const { spawn } = require('child_process')
const path = require('path')

const CMD_PREFIX = process.platform === 'darwin' ? '--' : '/'

function getExManCmdPath () {
  if (process.platform === 'win32') {
    return 'bin/windows/ExManCmd.exe'
  } else {
    return 'bin/mac/Contents/MacOS/ExManCmd'
  }
}

export class Installer {
  install (zxpPath) {
    console.log('using target path of ' + getExManCmdPath())
    console.log('starting to install ZXP from path ' + zxpPath)

    return new Promise(function (resolve, reject) {
      let closeMessage = ''

      const childProcess = spawn(path.join(__dirname, getExManCmdPath()), [
        CMD_PREFIX + 'install',
        zxpPath,
      ])

      childProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString())
        const logbits = /= -(\d+)/.exec(data.toString())
        const code = logbits?.[1] ? parseInt(logbits[1]) : null
        if (code) {
          closeMessage = getErrorMessage(code) ?? 'Error: ' + data.toString()
        }
      })

      childProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString())
        const logbits = /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) : ([A-Z]+)\s+(.*)/.exec(
          data.toString()
        )
        const [_, __, ___, level, message] = logbits ?? []
        if (level === 'ERROR') {
          reject(message)
        }
      })

      // code 0 => success
      childProcess.on('exit', code => {
        if (code === 0) {
          resolve()
        } else {
          reject(closeMessage)
        }
      })
    })
  }
}
