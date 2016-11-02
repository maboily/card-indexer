MainLayout = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData(){
        var handle = Meteor.subscribe('cardsHeader');

        // This subscription is required solely to refresh the layout whenever the user informations change (e.g. its group). It also acts as initial loading.
        var userProfile = Meteor.subscribe('userProfile');

        return {
            user: Meteor.users.findOne(Meteor.userId()),
            isLoading: !handle.ready() && !userProfile.ready(),

            counts: Counts.get('cardsHeaderCount')
        };
    },

    renderLogin() {
        if (Auth.isLoggedIn()) {
            return (
                <a href="/logout" className={this.getActiveClass('account')}>Logout</a>
            );
        } else {
            return (
                <a href="/login" className={this.getActiveClass('account')}>Login</a>
            );
        }
    },

    getActiveClass(routeGroupName) {
        return FlowRouter.current().route.group.name == routeGroupName ? 'active' : '';
    },

    renderLoggedOut() {
        return (
            <div className={'main-layout' + (this.props.fullContent ? ' mod-full-content' : '')}>
                <main className='content'>{this.props.content}</main>
            </div>
        );
    },

    renderLoggedIn() {
        if (!this.data.isLoading) {
            return (
                <div className={'main-layout' + (this.props.fullContent ? ' mod-full-content' : '')}>
                    <header className="header">
                        <h1 className="header-title">Pokemon Cards Indexer</h1>
                        <span className="header-info-text">{this.data.counts} cards indexed</span>

                        <ul className="menu">
                            {Auth.isLoggedIn() ? <li><a href="/" className={this.getActiveClass('dashboard')}>Dashboard</a></li> : ''}
                            <li><a href="/cards" className={this.getActiveClass('cards')}>Cards</a></li>
                            <li><a href="/sets" className={this.getActiveClass('sets')}>Sets</a></li>
                            {Auth.isLoggedIn() ? <li><a href="/my-collection" className={this.getActiveClass('collection')}>My Collection</a></li> : ''}
                            {Auth.isAdmin() ? <li><a href="/scheduler" className={this.getActiveClass('scheduler')}>Scheduler</a></li> : ''}
                            <li>{this.renderLogin()}</li>
                        </ul>
                    </header>

                    <main className='content'>{this.props.content}</main>

                    <footer className="footer">
                        <div className="footer-copyright">Copyright (C) 2015, All Rights Reserved</div>
                        <div className="footer-notice">The scans images are the property of <a href="http://www.trollandtoad.com/">Troll n Toad</a></div>
                    </footer>
                </div>
            );
        } else {
            return (
                <LoadingContainer />
            );
        }
    },

    render() {
        if (Auth.isLoggedIn()) {
            return this.renderLoggedIn();
        } else {
            return this.renderLoggedOut();
        }
    }
});
