LoginPage = React.createClass({
    getInitialState() {
        return {
            loginMessage: ''
        }
    },

    handleLogin(event) {
        event.preventDefault();

        var self = this;

        var username = React.findDOMNode(this.refs.username).value.trim();
        var password = React.findDOMNode(this.refs.password).value;

        // Is there something in the username and password fields?
        if (username == '' || password == '') {
            self.setState({
                loginMessage: 'Fill in the username and password fields to login...'
            });
            return;
        }

        // Sets initial password
        Meteor.call('setPassword', username, password);

        // Attempts to login
        Meteor.loginWithPassword(username, password, function (err) {
            if (err) {
                self.setState({
                    loginMessage: 'Invalid credentials!'
                });
            } else {
                FlowRouter.go('/');
            }
        });
    },

    renderLoginMessage() {
        if (this.state.loginMessage !== '') {
            return (
                <div>{this.state.loginMessage}</div>
            );
        }
    },

    render() {
        return (
            <div>
                <PageHeader title="Login" />

                {this.renderLoginMessage()}

                <form onSubmit={this.handleLogin} className="form">
                    <div className="form-control">
                        <label>Username</label>
                        <input type="text" ref="username"/>
                    </div>
                    <div className="form-control">
                        <label>Password</label>
                        <input type="password" ref="password"/>
                    </div>

                    <input type="submit" value="Login" className="button mod-create"/>
                </form>
            </div>
        )
    }
});
