const fileInput = document.getElementById('file') as HTMLInputElement

fileInput.addEventListener('change', (event) => {
  
  const reader = new FileReader()

  const file = (event.target as HTMLInputElement).files?.[0]

  reader.readAsText(file!)

  reader.onload = (loadEvent) => {
    const result = loadEvent.target?.result
    console.log(result)
  }
})