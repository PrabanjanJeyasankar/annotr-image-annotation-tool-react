import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import styles from './ImageAnnotatorComponent.module.css'
import ButtonComponent from '@/elements/ButtonComponent/ButtonComponent'

const ImageAnnotatorComponent = ({
    position,
    isVisible,
    onSave,
    onDelete = () => {},
    onClose,
    annotation = '',
    isEditing,
}) => {
    const formRef = useRef(null)
    const [text, setText] = useState('')
    const [error, setError] = useState('')

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
        setError('')
    }, [annotation])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (text.trim().length < 3) {
            setError('*Annotation must be at least 3 characters long.')
            return
        }
        setError('')
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
                        rows='2'
                        autoFocus
                    />
                    {error && <p className={styles.error_message}>{error}</p>}
                    <div className={styles.button_container}>
                        {isEditing && (
                            <ButtonComponent
                                type='button'
                                onClick={onDelete}
                                className={styles.delete_button}>
                                Delete
                            </ButtonComponent>
                        )}
                        <ButtonComponent type='submit' className={styles.save_button}>
                            {isEditing ? 'Update' : 'Save'}
                        </ButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    )
}

ImageAnnotatorComponent.propTypes = {
    position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }).isRequired,
    isVisible: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    annotation: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
}

export default ImageAnnotatorComponent
