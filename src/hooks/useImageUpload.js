import { useState } from 'react'

const useImageUpload = () => {
    const [imageData, setImageData] = useState(null)
    const [isImageUploaded, setIsImageUploaded] = useState(false)

    const onImageUpload = (base64Image) => {
        const img = new Image()
        img.onload = () => {
            setImageData(base64Image)
            setIsImageUploaded(true)
        }
        img.src = base64Image
    }

    const clearImage = () => {
        setImageData(null)
        setIsImageUploaded(false)
    }

    return {
        imageData,
        isImageUploaded,
        onImageUpload,
        clearImage,
    }
}

export default useImageUpload
