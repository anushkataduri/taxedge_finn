export interface ItrUploadedFile {
  name: string
  size: string
  uploadedAt: string
}

export interface FileValidationResult {
  isValid: boolean
  error?: string
  fileInfo?: ItrUploadedFile
}

export const validateItrUploadFile = (
  file: File,
  maxMb: number = 10,
  allowedExtensions: string[] = ['pdf', 'jpg', 'jpeg', 'png']
): FileValidationResult => {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (!allowedExtensions.includes(ext)) {
    return {
      isValid: false,
      error: `Invalid file format. Please upload a Photo or PDF (${allowedExtensions.map((e) => `.${e}`).join(', ')}).`,
    }
  }

  const maxBytes = maxMb * 1024 * 1024
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      isValid: false,
      error: `File size exceeds ${maxMb} MB limit (${sizeMb} MB). Please choose a smaller file.`,
    }
  }

  const formattedSize =
    file.size >= 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`

  return {
    isValid: true,
    fileInfo: {
      name: file.name,
      size: formattedSize,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  }
}
