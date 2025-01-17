import { useCallback, useRef, useState } from 'react'
import useAnnotations from '../../hooks/useAnnotations'
import useImageUpload from '../../hooks/useImageUpload'
import QuoteSvg from '../../svg/QuoteSvg/QuoteSvg'
import ImageAnnotatorComponent from '../ImageAnnotatorComponent/ImageAnnotatorComponent'
import ImageUploaderComponent from '../ImageUploaderComponent/ImageUploaderComponent'
import ImageWithAnnotaionsComponent from '../ImageWithAnnotaionsComponent/ImageWithAnnotaionsComponent'
import styles from './CanvasComponent.module.css'

const CanvasComponent = () => {
    const divRef = useRef(null)
    const dragOffset = useRef({ x: 0, y: 0 })
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isFormVisible, setIsFormVisible] = useState(false)

    const {
        annotations,
        editingAnnotation,
        handleSaveAnnotation,
        handleDeleteAnnotation,
        handleDotClick,
        handleDragStart,
        updateDraggedAnnotation,
        endDrag,
        dragRef,
    } = useAnnotations()

    const { imageData, isImageUploaded, onImageUpload, clearImage } =
        useImageUpload()

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
            }
        },
        [isImageUploaded]
    )

    const handleDrag = useCallback(
        (e) => {
            if (!dragRef.current) return

            const img = divRef.current.querySelector('img')
            const rect = img.getBoundingClientRect()

            const x = Math.max(
                0,
                Math.min(
                    e.clientX - rect.left - dragOffset.current.x + 12,
                    rect.width
                )
            )
            const y = Math.max(
                0,
                Math.min(
                    e.clientY - rect.top - dragOffset.current.y + 12,
                    rect.height
                )
            )

            updateDraggedAnnotation(
                annotations.map((ann) =>
                    ann.id === dragRef.current
                        ? { ...ann, position: { x, y } }
                        : ann
                )
            )
        },
        [annotations, updateDraggedAnnotation, dragRef]
    )

    const handleDragEnd = useCallback(() => {
        endDrag()
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)
    }, [handleDrag, endDrag])

    return (
        <div className={styles.canvas_container}>
            <div className={styles.app_logo} onClick={clearImage}>
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
                    <ImageWithAnnotaionsComponent
                        ImageWithAnnotaionsComponent
                        imageData={imageData}
                        annotations={annotations}
                        onImageClick={handleImageClick}
                        onDotClick={(e, annotation) => {
                            handleDotClick(e, annotation)
                            setIsFormVisible(true)
                        }}
                        onDragStart={(e, annotation) =>
                            handleDragStart(
                                e,
                                annotation,
                                dragOffset,
                                handleDrag,
                                handleDragEnd
                            )
                        }
                        onDrag={(id, position) => {
                            updateDraggedAnnotation(
                                annotations.map((ann) =>
                                    ann.id === id ? { ...ann, position } : ann
                                )
                            )
                        }}
                        onDragEnd={handleDragEnd}
                        dragRef={dragRef}
                    />
                )}
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
                    onClose={() => setIsFormVisible(false)}
                    annotation={editingAnnotation?.text || ''}
                    isEditing={!!editingAnnotation}
                />
            )}
        </div>
    )
}

export default CanvasComponent
