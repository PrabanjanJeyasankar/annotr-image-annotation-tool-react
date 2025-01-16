import { useRef, useState } from 'react'
import ImagePlusSvg from '../../svg/ImagePlusSvg/ImagePlusSvg'
import ImageAnnotatorComponent from '../ImageAnnotatorComponent/ImageAnnotatorComponent'
import ImageUploaderComponent from '../ImageUploaderComponent/ImageUploaderComponent'
import styles from './CanvasComponent.module.css'

const CanvasComponent = () => {
    const divRef = useRef(null)
    const [imageData, setImageData] = useState(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [annotations, setAnnotations] = useState([])
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [isImageUploaded, setIsImageUploaded] = useState(false)

    const onImageUpload = (base64Image) => {
        const img = new Image()
        img.onload = () => {
            setImageData(base64Image)
            setIsImageUploaded(true)
        }
        img.src = base64Image
    }

    const handleImageClick = (e) => {
        if (!isImageUploaded) return

        const img = e.target
        if (img.tagName === 'IMG') {
            const rect = img.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            setMousePosition({ x, y })
            setIsFormVisible(true)
        }
    }

    const handleSaveAnnotation = (newAnnotation) => {
        setAnnotations((prev) => [
            ...prev,
            {
                ...newAnnotation,
                id: Date.now(),
            },
        ])
        setIsFormVisible(false)
    }

    return (
        <div className={styles.canvas_container}>
            <div ref={divRef} className={styles.image_container}>
                {!isImageUploaded && (
                    <div className={styles.placeholder_text}>
                        <ImagePlusSvg height={54} width={54} />
                        <span>Upload image here</span>
                    </div>
                )}
                {isImageUploaded && (
                    <img
                        src={imageData}
                        alt='Uploaded'
                        className={styles.uploaded_image}
                        onClick={handleImageClick}
                    />
                )}
                {annotations.map((annotation) => (
                    <div
                        key={annotation.id}
                        className={styles.annotation_outer_dot}
                        style={{
                            left: `${annotation.position.x}px`,
                            top: `${annotation.position.y}px`,
                        }}>
                        <div className={styles.annotation_inner_dot} />
                    </div>
                ))}
            </div>

            <div className={styles.image_uploader_container}>
                <ImageUploaderComponent onImageUpload={onImageUpload} />
            </div>

            {isImageUploaded && (
                <ImageAnnotatorComponent
                    position={mousePosition}
                    isVisible={isFormVisible}
                    onSave={handleSaveAnnotation}
                    onClose={() => setIsFormVisible(false)}
                />
            )}
        </div>
    )
}

export default CanvasComponent
