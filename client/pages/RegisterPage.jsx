RegisterPage = React.createClass({
    getInitialState() {
        return {
            registerMessage: ''
        }
    },

    handleRegister(event) {
        event.preventDefault();

        var username = React.findDOMNode(this.refs.username).value.trim();
        var password = React.findDOMNode(this.refs.password).value;
        var passwordConfirm = React.findDOMNode(this.refs.passwordConfirm).value;

        // Required fields
        if (username.trim() == '' || password == '' || passwordConfirm == '') {
            this.setState({
                registerMessage: 'All fields are required!'
            });
            return;
        }

        // Same passwords
        if (password != passwordConfirm) {
            this.setState({
                registerMessage: 'The password confirmation and password fields do not match'
            });
            return;
        }

        // Attempt registration
        var self = this;
        Accounts.createUser({
            username: username,
            password: password
        }, function (err) {
            if (err) {
                self.setState({
                    registerMessage: 'Invalid username given'
                });
            } else {
                FlowRouter.go('/login');
            }
        });
    },

    renderRegisterMessage() {
        if (this.state.registerMessage !== '') {
            return (
                <div>{this.state.registerMessage}</div>
            );
        }
    },

    render() {
        return (
            <div>
                <PageHeader title="Registration" />

                {this.renderRegisterMessage()}

                <form onSubmit={this.handleRegister} className="form">
                    <div className="form-control">
                        <label>Username</label>
                        <input type="text" ref="username"/>
                    </div>
                    <div className="form-control">
                        <label>Password</label>
                        <input type="password" ref="password"/>
                    </div>
                    <div className="form-control">
                        <label>Password (confirm)</label>
                        <input type="password" ref="passwordConfirm"/>
                    </div>

                    <input type="submit" value="Register" className="button mod-create"/>
                </form>
            </div>
        )
    }
});