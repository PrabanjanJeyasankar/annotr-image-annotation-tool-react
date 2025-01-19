import ButtonComponent from '@/elements/ButtonComponent/ButtonComponent'
import CrossSvg from '@/svg/CrossSvg/CrossSvg'
import EditPenSvg from '@/svg/EditPenSvg/EditPenSvg'
import TrashSvg from '@/svg/TrashSvg/TrashSvg'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import styles from './ImageAnnotatorComponent.module.css'

const ImageAnnotatorComponent = ({
    position,
    isVisible = true,
    onSave,
    onDelete = () => {},
    onClose,
    annotation = '',
    isEditing,
}) => {
    const formRef = useRef(null)
    const inputRef = useRef(null);
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

    const handleEdit = () => {
        setText(annotation || '')
        setError('')
        if (inputRef.current) {
            inputRef.current.focus()
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
                        ref={inputRef}
                        onChange={(e) => setText(e.target.value)}
                        className={styles.input_field}
                        rows='2'
                        autoFocus
                    />
                    {error && <p className={styles.error_message}>{error}</p>}
                    <div className={styles.button_container}>
                        {isEditing && (
                            <div className={styles.edit_delete_actions}>
                                <ButtonComponent
                                    type='button'
                                    onClick={onDelete}
                                    className={styles.delete_button}>
                                    <TrashSvg />
                                </ButtonComponent>
                                <ButtonComponent
                                    type='button'
                                    onClick={handleEdit}
                                    className={styles.edit_button}>
                                    <EditPenSvg />
                                </ButtonComponent>
                            </div>
                        )}
                        <ButtonComponent
                            onClick={onClose}
                            className={styles.close_button}>
                            <CrossSvg />
                        </ButtonComponent>
                        <ButtonComponent
                            type='submit'
                            className={styles.save_button}>
                            {isEditing ? 'Update' : 'Save'}
                        </ButtonComponent>
                    </div>
                </div>
            </form>
        </div>
    )
}



export default ImageAnnotatorComponent
