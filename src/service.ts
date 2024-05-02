interface IService {
  processFile(arg: { file: File,
    onProgress: (progress: number) => void
    onComplete: (source: string, totalTime: number) => void
    onCompile?: () => void
  }): void
}

export class Service implements IService {
  processFile: IService['processFile'] = ({ file, onProgress, onComplete, onCompile }) => {
    const progressFn = this.setupProgress(file.size, onProgress)
    const data: Record<string, string>[] = [];

    const startedAt = performance.now()
    file.stream()
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(this.csvToJson({ onProgress: progressFn }))
      .pipeTo(new WritableStream({
        write(chunk) {
          data.push(chunk)
        }
      })).then(() => {
        onCompile?.()
        const json = JSON.stringify(data)
        const blob = new Blob([json], { type: 'application/json' })
        const source = URL.createObjectURL(blob)
        onComplete(source, (performance.now() - startedAt) / 1000)
      })
  }

  private csvToJson({ onProgress }: { onProgress: (progress: number) => void }) {
    const columns: string[] = []
    
    return new TransformStream({
      transform(chunk, controller) {
        onProgress(chunk.length)
        const lines: string[] = chunk.split('\n') || []
        lines.forEach(line => {
          if(!line.length) return
          if(!columns.length) {
            const columnsItems = line.split(',').map(item => item.trim())
            columns.push(...columnsItems)
            return
          }
          
          let currentItem: Record<string, string> = {}
          const data = line.split(',')
          for(const columnIndex in data) {
            let columnItem = data[columnIndex]
            currentItem[columns[columnIndex]] = columnItem.trimEnd()
          }

          controller.enqueue(currentItem)
        })
      }
    })
  }

  private setupProgress(totalBytes: number, onProgress: (progress: number) => void) {
    let totalUploaded = 0
    onProgress(0)

    return (chunkLength: number) => {
      totalUploaded += chunkLength
      const progress = Math.round((totalUploaded / totalBytes) * 100)
      onProgress(progress)
    }
  }
}