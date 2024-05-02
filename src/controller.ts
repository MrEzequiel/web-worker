import { Service } from "./service";
import { IView, View } from "./view";

interface IControllerConfig {
  view: IView
  worker: Worker
  service: Service
}

export class Controller {
  private view: View;
  private worker: Worker;
  private service: Service
  private USE_WEB_WORKER = true

  constructor(config: IControllerConfig) {
    this.view = config.view
    this.worker = config.worker
    this.service = config.service
  }

  private configureOnFileChange(file: File | undefined) {
    this.view.setCurrentFile(file)
    this.view.destroyProcess()
  }

  private configureOnFormSubmit({ file }: { file: File }) {
    this.view.disabledForm()
    this.view.initProcess()

    if(!window.Worker || !this.USE_WEB_WORKER) {
      this.service.processFile({
        file,
        onProgress: (progress) => {
          this.view.updateProgress(progress)
        },
        onCompile: () => {
          this.view.setIsCompiling()
        },
        onComplete: (source, totalTime) => {
          this.view.enableForm()
          this.view.doneProcess()
          this.view.updateElapsedTime(totalTime)
          this.view.setDownloadLink(source)
        }
      })
    } else {
      this.worker.postMessage({ file, type: 'process-file' })
    }
  }

  private events = {
    alive: () => {
      console.log(`🚀 worker is online`)
    },
    progress: ({ progress }: { progress: number }) => {
      this.view.updateProgress(progress)
    },
    compile: () => {
      this.view.setIsCompiling()
    },
    complete: ({ source, totalTime }: { source: string, totalTime: number }) => {
      this.view.enableForm()
      this.view.doneProcess()
      this.view.updateElapsedTime(totalTime)
      this.view.setDownloadLink(source)
    },
  }

  private configureWorker(worker: Worker) {
    worker.onmessage = ({ data }) => {
      const { type, ...payload } = data
      this.events?.[(type as keyof typeof this.events)](payload)
    }

    return worker
  }

  static init(config: IControllerConfig) {
    const controller = new Controller(config)
    controller.init();
    return controller
  }

  init() {
    this.view.configureOnFileChange(this.configureOnFileChange.bind(this))
    this.view.configureOnSubmitForm(this.configureOnFormSubmit.bind(this))
    this.worker = this.configureWorker(this.worker)
  }
}