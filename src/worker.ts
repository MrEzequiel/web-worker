import { Service } from "./service"
const service = new Service()

postMessage({ type: 'alive' })

onmessage = ({ data }) => {
  service.processFile({
    file: data.file,
    onProgress(progress) {
      postMessage({ type: 'progress', progress })
    },
    onCompile() {
      postMessage({ type: 'compile' })
    },
    onComplete(source, totalTime) {
      postMessage({ type: 'complete', source, totalTime })
    }
  })
}

