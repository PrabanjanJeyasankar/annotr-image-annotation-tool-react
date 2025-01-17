import { useCallback, useRef, useState } from 'react'
import QuoteSvg from '../../svg/QuoteSvg/QuoteSvg'
import ImageAnnotatorComponent from '../ImageAnnotatorComponent/ImageAnnotatorComponent'
import ImageUploaderComponent from '../ImageUploaderComponent/ImageUploaderComponent'
import styles from './CanvasComponent.module.css'

const CanvasComponent = () => {
    const divRef = useRef(null)
    const dragRef = useRef(null)
    const [imageData, setImageData] = useState(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [annotations, setAnnotations] = useState([])
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [isImageUploaded, setIsImageUploaded] = useState(false)
    const [editingAnnotation, setEditingAnnotation] = useState(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const onImageUpload = (base64Image) => {
        const img = new Image()
        img.onload = () => {
            setImageData(base64Image)
            setIsImageUploaded(true)
        }
        img.src = base64Image
    }

    const handleImageClick = useCallback(
        (e) => {
            if (!isImageUploaded) return

            const img = e.target
            if (img.tagName === 'IMG') {
                const rect = img.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                setMousePosition({ x, y })
                setIsFormVisible(true)
                setEditingAnnotation(null)
            }
        },
        [isImageUploaded]
    )

    const handleClearImage = () => {
        setImageData(null)
        setIsImageUploaded(false)
        setAnnotations([])
        setIsFormVisible(false)
        setEditingAnnotation(null)
    }

    const handleDotClick = useCallback((e, annotation) => {
        e.stopPropagation()
        setEditingAnnotation(annotation)
        setMousePosition(annotation.position)
        setIsFormVisible(true)
    }, [])

    const handleSaveAnnotation = useCallback(
        (newAnnotation) => {
            setAnnotations((prev) => {
                if (editingAnnotation) {
                    return prev.map((annotate) =>
                        annotate.id === editingAnnotation.id
                            ? {
                                  ...newAnnotation,
                                  id: editingAnnotation.id,
                                  position: editingAnnotation.position,
                              }
                            : annotate
                    )
                } else {
                    return [...prev, { ...newAnnotation, id: Date.now() }]
                }
            })
            setIsFormVisible(false)
            setEditingAnnotation(null)
        },
        [editingAnnotation]
    )

    const handleDeleteAnnotation = useCallback((annotationId) => {
        setAnnotations((prev) => prev.filter((annotate) => annotate.id !== annotationId))
        setIsFormVisible(false)
        setEditingAnnotation(null)
    }, [])

    const handleDragStart = useCallback((e, annotation) => {
        e.stopPropagation()
        const dot = e.currentTarget
        const rect = dot.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
        dragRef.current = annotation.id

        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
    }, [])

    const handleDrag = useCallback(
        (e) => {
            if (!dragRef.current) return

            const img = divRef.current.querySelector('img')
            const rect = img.getBoundingClientRect()

            const x = Math.max(
                0,
                Math.min(e.clientX - rect.left - dragOffset.x + 12, rect.width)
            )
            const y = Math.max(
                0,
                Math.min(e.clientY - rect.top - dragOffset.y + 12, rect.height)
            )

            setAnnotations((prev) =>
                prev.map((ann) =>
                    ann.id === dragRef.current
                        ? { ...ann, position: { x, y } }
                        : ann
                )
            )
        },
        [dragOffset]
    )

    const handleDragEnd = useCallback(() => {
        dragRef.current = null
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)
    }, [handleDrag])


    return (
        <div className={styles.canvas_container}>
            <div className={styles.app_logo} onClick={handleClearImage}>
                <QuoteSvg width={24} height={24} />
                <p className={styles.app_name}>Annotr</p>
            </div>
            <div ref={divRef} className={styles.image_container}>
                {!isImageUploaded && (
                    <div className={styles.placeholder_text}>
                        <ImageUploaderComponent onImageUpload={onImageUpload} />
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
                        className={`${styles.annotation_outer_dot} ${
                            dragRef.current === annotation.id
                                ? styles.dragging
                                : ''
                        }`}
                        style={{
                            left: `${annotation.position.x}px`,
                            top: `${annotation.position.y}px`,
                        }}
                        onClick={(e) => handleDotClick(e, annotation)}
                        onMouseDown={(e) => handleDragStart(e, annotation)}>
                        <div className={`${styles.annotation_inner_dot}`}></div>
                    </div>
                ))}
            </div>

            {isImageUploaded && (
                <ImageAnnotatorComponent
                    position={mousePosition}
                    isVisible={isFormVisible}
                    onSave={handleSaveAnnotation}
                    onDelete={
                        editingAnnotation
                            ? () => handleDeleteAnnotation(editingAnnotation.id)
                            : null
                    }
                    onClose={() => {
                        setIsFormVisible(false)
                        setEditingAnnotation(null)
                    }}
                    annotation={editingAnnotation?.text || ''}
                    isEditing={!!editingAnnotation}
                />
            )}
        </div>
    )
}

export default CanvasComponent
