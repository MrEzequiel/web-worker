interface IProcessState {
  isProcessing: boolean
  done: boolean
  error: boolean
  sourceLink: null | string,
  progress: number,
  timeElapsed: number | null
  isCompiling: boolean
}

export class View {
  private csvFile = document.getElementById('csv-file') as HTMLInputElement
  private form = document.getElementById('csv-form') as HTMLFormElement

  private fileDetail = {
    name: document.getElementById('file-item-title') as HTMLParagraphElement,
    size: document.getElementById('file-size') as HTMLSpanElement,
    container: document.getElementById('selected-file') as HTMLDivElement
  }

  private processArchive = {
    container: document.getElementById('results') as HTMLDivElement,
    status: document.getElementById('status') as HTMLParagraphElement,
    progress: document.getElementById('progress') as HTMLProgressElement,
    progressLabel: document.getElementById('progress-label') as HTMLSpanElement,
    downloadLink: document.getElementById('download-json') as HTMLAnchorElement,
    timeElapsed: document.getElementById('time-elapsed') as HTMLSpanElement,
    compileLabel: document.getElementById('compile-label') as HTMLParagraphElement
  }

  private currentFile: File | undefined

  private processState: IProcessState = {
    isProcessing: false,
    done: false,
    error: false,
    sourceLink: null,
    progress: 0,
    timeElapsed: 0,
    isCompiling: false
  }

  private isFormDisabled = false

  /**
   * @param size the size in bytes
   * @returns the size in human readable format
   */
  private humanifySize(size: number) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

    if (size == 0) return 'n/a'
    
    const i = Math.floor(Math.log(size) / Math.log(1024))
    const result = (size / Math.pow(1024, i)).toFixed(2)
    
    return `${result} ${sizes[i]}`
  }

  setDownloadLink(source: string) {
    this.processState.sourceLink = source
    this.updateProcessUi()
  }

  setIsCompiling() {
    this.processState.isCompiling = true
    this.updateProcessUi()
  }

  private setVisibilityOfFileDetail(show: boolean) {
    this.fileDetail.container.classList[show ? 'add' : 'remove']('show')
  }

  private updateFileDetail() {
    if(!this.currentFile) {
      this.setVisibilityOfFileDetail(false)
      return
    }

    const file = this.currentFile

    this.setVisibilityOfFileDetail(true)
    this.fileDetail.name.innerText = file.name
    this.fileDetail.size.innerText = this.humanifySize(file.size)
  }

  setCurrentFile(file: File | undefined) {
    this.currentFile = file
    this.updateFileDetail()
  }

  configureOnFileChange(callback: (file: File | undefined) => void) {
    this.csvFile.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0]
      callback(file)
    })
  }

  configureOnSubmitForm(callback: (form: { file: File }) => void) {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault()
      
      const file = this.csvFile.files?.[0]
      if(!file || this.isFormDisabled) return

      callback({ file })
    })
  }

  disabledForm() {
    this.csvFile.disabled = true
    this.isFormDisabled = true
  }

  enableForm() {
    this.csvFile.disabled = false
    this.isFormDisabled = false
  }

  private updateDownloadLink() {
    const file = this.currentFile

    if(!file || !this.processState.sourceLink) {
      this.processArchive.downloadLink.classList.remove('show')
      return
    }

    this.processArchive.downloadLink.href = this.processState.sourceLink
    this.processArchive.downloadLink.classList.add('show')
    this.processArchive.downloadLink.download = `${file.name}-${crypto.randomUUID()}.json`
  }

  private updateProgressUi() {
    this.processArchive.container.classList[this.processState.isProcessing ? 'add' : 'remove']('show')
    this.processArchive.progress.value = this.processState.progress
    this.processArchive.progressLabel.innerText = `${this.processState.progress}%`

    const done = this.processState.done
    this.processArchive.status.innerText = done ? 'Done!' : 'Processing...'
    this.processArchive.status.classList[done ? 'add' : 'remove']('completed')
    this.processArchive.progress.classList[done ? 'add' : 'remove']('completed')
  }

  private updateElapsedTimeUi(): void {
    if(this.processState.timeElapsed) {
      this.processArchive.timeElapsed.innerText = `Time elapsed: ${this.processState.timeElapsed.toFixed(2)} seconds`
    } else {
      this.processArchive.timeElapsed.innerText = ''
    }
  }

  private updateCompileUi() {
    this.processArchive.compileLabel.innerText = this.processState.isCompiling ? 'Compiling...' : ''
  }

  private updateProcessUi() {
    this.processArchive.container.classList[this.processState.isProcessing ? 'add' : 'remove']('show')

    this.updateCompileUi()
    this.updateProgressUi()
    this.updateElapsedTimeUi()
    this.updateDownloadLink()
  }

  doneProcess() {
    this.processState.done = true
    this.processState.isCompiling = false
    this.updateProcessUi()
  }

  updateElapsedTime(timeElapsed: number): void {
    this.processState.timeElapsed = timeElapsed
    this.updateProcessUi()
  }
  
  updateProgress(progress: number): void {
    this.processState.progress = progress
    this.updateProcessUi()
  }

  private processStateReset() {
    this.processState.done = false
    this.processState.error = false
    this.processState.isProcessing = false
    this.processState.progress = 0
    this.processState.sourceLink = null
    this.processState.timeElapsed = null
    this.processState.isCompiling = false
  }

  destroyProcess() {
    this.processStateReset()
    this.updateProcessUi()
  }

  initProcess() {
    this.processStateReset()
    this.processState.isProcessing = true
    this.updateProcessUi()
  }
}

export type IView = InstanceType<typeof View>