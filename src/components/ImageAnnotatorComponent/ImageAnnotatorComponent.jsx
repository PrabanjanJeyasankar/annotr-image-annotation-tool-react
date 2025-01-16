import { useEffect, useRef, useState } from 'react'
import styles from './ImageAnnotatorComponent.module.css'

const ImageAnnotatorComponent = ({ position, isVisible, onSave, onClose }) => {
    const formRef = useRef(null)
    const [annotation, setAnnotation] = useState('')

    useEffect(() => {
        if (isVisible) {
            console.log('Annotation position:', position)
        }
    }, [position, isVisible])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isVisible, onClose])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (annotation.trim()) {
            const newAnnotation = {
                text: annotation,
                position: position,
            }
            onSave(newAnnotation)
            setAnnotation('')
        }
    }

    if (!isVisible) return null

    return (
        <div
            ref={formRef}
            className={styles.form_container}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -100%)',
                marginTop: '-10px',
            }}>
            <form onSubmit={handleSubmit}>
                <div className={styles.input_container}>
                    <div>
                        <label htmlFor='annotation' className={styles.label}>
                            Add Annotation
                        </label>
                        <textarea
                            id='annotation'
                            value={annotation}
                            onChange={(e) => setAnnotation(e.target.value)}
                            className={styles.input_field}
                            rows='3'
                            autoFocus
                        />
                    </div>
                    <button type='submit' className={styles.save_button}>
                        Save Annotation
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ImageAnnotatorComponent
