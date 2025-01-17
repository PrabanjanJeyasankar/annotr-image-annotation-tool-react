import PropTypes from 'prop-types'
import { useRef, useCallback } from 'react'
import styles from './ImageWithAnnotaionsComponent.module.css'

const ImageWithAnnotaionsComponent = ({
    imageData,
    annotations,
    onImageClick,
    onDotClick,
    onDragStart,
    onDrag,
    onDragEnd,
    dragRef,
}) => {
    const imageRef = useRef(null)

    const handleMouseMove = useCallback(
        (e) => {
            if (!dragRef.current) return
            const img = imageRef.current
            if (!img) return

            const rect = img.getBoundingClientRect()
            const x = Math.max(
                0,
                Math.min(e.clientX - rect.left, rect.width)
            )
            const y = Math.max(
                0,
                Math.min(e.clientY - rect.top, rect.height)
            )

            onDrag(dragRef.current, { x, y })
        },
        [dragRef, onDrag]
    )

    const handleMouseUp = useCallback(() => {
        if (dragRef.current) {
            onDragEnd()
        }
    }, [dragRef, onDragEnd])

    return (
        <div
            className={styles.image_container}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}>
            {imageData && (
                <img
                    src={imageData}
                    alt="Uploaded"
                    className={styles.uploaded_image}
                    onClick={onImageClick}
                    ref={imageRef}
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
                    onMouseDown={(e) => onDragStart(e, annotation)}
                    onClick={(e) => onDotClick(e, annotation)}>
                    <div className={styles.annotation_inner_dot}></div>
                </div>
            ))}
        </div>
    )
}

ImageWithAnnotaionsComponent.propTypes = {
    imageData: PropTypes.string,
    annotations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            position: PropTypes.shape({
                x: PropTypes.number.isRequired,
                y: PropTypes.number.isRequired,
            }).isRequired,
        })
    ).isRequired,
    onImageClick: PropTypes.func.isRequired,
    onDotClick: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    dragRef: PropTypes.object.isRequired,
}

export default ImageWithAnnotaionsComponent
