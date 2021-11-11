import { Installer } from './installer.js'
import { UIMessages } from './messages.js'
const { dialog, shell } = require('@electron/remote')

class View {
  constructor (view) {
    this.view = view
    this.installer = new Installer()
    this.zxpPath = null

    for (const a of document.querySelectorAll('a[target=_blank]')) {
      a.addEventListener('click', e => {
        e.preventDefault()
        shell.openExternal(a.href)
      })
    }

    document.addEventListener('dragover', e => {
      this.resetClasses()
      this.view.classList.toggle('is-dragging', true)
      this.updateStatus(UIMessages.dropToInstall)
      e.preventDefault()
    })

    document.addEventListener('dragleave', e => {
      this.resetClasses()
      this.updateStatus(UIMessages.dragToInstall)
      e.preventDefault()
    })

    document.addEventListener('dragend', e => {
      this.resetClasses()
      this.updateStatus(UIMessages.dragToInstall)
      e.preventDefault()
    })

    document.addEventListener('drop', e => {
      this.resetClasses()
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      console.log('detected:', file.path)
      this.zxpPath = file.path
      this.install()
      e.stopPropagation()
    })

    document.querySelector('.main-view').addEventListener('click', async () => {
      const path = (await dialog.showOpenDialog({ properties: ['openFile'] })).filePaths[0]
      if (!path) return false
      console.log('detected:', path)
      this.zxpPath = path
      this.install()
      return false
    })

    this.updateStatus(UIMessages.dragToInstall)
  }

  resetClasses () {
    for (const cls of ['is-showing-spinner', 'was-successful', 'is-dragging', 'has-error']) {
      this.view.classList.toggle(cls, false)
    }
  }

  updateStatus (message) {
    document.querySelector('.status').innerText = message
  }

  toggleSpinner (state) {
    this.resetClasses()
    this.view.classList.toggle('is-showing-spinner', state)
  }

  toggleSuccess (state) {
    this.resetClasses()
    this.view.classList.toggle('was-successful', state)
  }

  startInstalling () {
    this.updateStatus(UIMessages.installing)
    this.toggleSpinner(true)
  }

  installationFailed (err) {
    this.toggleSpinner(false)
    this.updateStatus(err)
  }

  installationSuccess () {
    this.toggleSpinner(false)
    this.toggleSuccess(true)
    this.updateStatus(UIMessages.installed)
  }

  async install () {
    this.startInstalling()
    try {
      await this.installer.install(this.zxpPath)
      this.installationSuccess()
    } catch (err) {
      this.installationFailed(err)
      this.view.classList.toggle('has-error', true)
    }
  }
}

window.view = new View(document.body)
