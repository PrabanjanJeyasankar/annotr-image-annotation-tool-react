import { useRef, useState } from 'react'

const useAnnotations = () => {
    const [annotations, setAnnotations] = useState([])
    const [editingAnnotation, setEditingAnnotation] = useState(null)
    const dragRef = useRef(null)

    const handleSaveAnnotation = (newAnnotation) => {
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
        setEditingAnnotation(null)
    }

    const handleDeleteAnnotation = (annotationId) => {
        setAnnotations((prev) =>
            prev.filter((annotate) => annotate.id !== annotationId)
        )
        setEditingAnnotation(null)
    }

    const handleDotClick = (e, annotation) => {
        e.stopPropagation()
        setEditingAnnotation(annotation)
    }

    const handleDragStart = (
        e,
        annotation,
        dragOffset,
        handleDrag,
        handleDragEnd
    ) => {
        e.stopPropagation()
        const dot = e.currentTarget
        const rect = dot.getBoundingClientRect()
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
        dragRef.current = annotation.id

        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
    }

    const updateDraggedAnnotation = (newAnnotations) => {
        setAnnotations(newAnnotations)
    }

    const endDrag = () => {
        dragRef.current = null
    }

    return {
        annotations,
        editingAnnotation,
        handleSaveAnnotation,
        handleDeleteAnnotation,
        handleDotClick,
        handleDragStart,
        updateDraggedAnnotation,
        endDrag,
        dragRef,
    }
}

export default useAnnotations
