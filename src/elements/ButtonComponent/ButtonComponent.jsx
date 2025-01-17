import PropTypes from 'prop-types'

const Button = ({ className, children, ...props }) => {
    return (
        <button className={className} {...props}>
            {children}
        </button>
    )
}

// Prop validation
Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string,
}

export default Button
