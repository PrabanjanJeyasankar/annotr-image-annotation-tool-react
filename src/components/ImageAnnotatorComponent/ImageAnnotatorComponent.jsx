import { useEffect, useRef, useState } from 'react'
import styles from './ImageAnnotatorComponent.module.css'

const ImageAnnotatorComponent = ({
    position,
    isVisible,
    onSave,
    onDelete,
    onClose,
    annotation,
    isEditing,
}) => {
    const formRef = useRef(null)
    const [text, setText] = useState('')

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

    useEffect(() => {
        setText(annotation || '')
    }, [annotation])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (text.trim()) {
            onSave({ text, position })
            setText('')
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
            }}>
            <form onSubmit={handleSubmit}>
                <div className={styles.input_container}>
                   
                    <textarea
                        id='annotation'
                        placeholder='Add annotations...'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className={styles.input_field}
                        rows='3'
                        autoFocus
                    />
                    <div className={styles.button_container}>
                        {isEditing && (
                            <button
                                type='button'
                                onClick={onDelete}
                                className={styles.delete_button}>
                                Delete
                            </button>
                        )}
                        <button type='submit' className={styles.save_button}>
                            {isEditing ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ImageAnnotatorComponent
