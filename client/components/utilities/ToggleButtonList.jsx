ToggleButtonList = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        currentValue: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    handleClick(newValue) {
        this.props.onChange(newValue);
    },

    renderItem(item) {
        return (
            <button
                type="button"
                key={item.value}
                className={`button button-toggleable ${this.props.currentValue == item.value ? 'toggled' : ''}`}
                onClick={this.handleClick.bind(this, item.value)}>
                {item.label}
            </button>
        );
    },

    render() {
        return (
            <div className="toggle-buttons-list">
                {this.props.items.map((value) => { return this.renderItem(value); })}
            </div>
        )
    }
});
