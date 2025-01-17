import { useState, useCallback, useRef } from 'react'

const useAnnotations = () => {
    const [annotations, setAnnotations] = useState([])
    const [editingAnnotation, setEditingAnnotation] = useState(null)
    const dragRef = useRef(null)

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
            setEditingAnnotation(null)
        },
        [editingAnnotation]
    )

    const handleDeleteAnnotation = useCallback((annotationId) => {
        setAnnotations((prev) => prev.filter((annotate) => annotate.id !== annotationId))
        setEditingAnnotation(null)
    }, [])

    const handleDotClick = useCallback((e, annotation) => {
        e.stopPropagation()
        setEditingAnnotation(annotation)
    }, [])

    const handleDragStart = useCallback((e, annotation, dragOffset, handleDrag, handleDragEnd) => {
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
    }, [])

    const updateDraggedAnnotation = useCallback((newAnnotations) => {
        setAnnotations(newAnnotations)
    }, [])

    const endDrag = useCallback(() => {
        dragRef.current = null
    }, [])

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
