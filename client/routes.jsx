// Custom route triggers
function RequireLogoutTrigger (context, redirect) {
    if (Auth.isLoggedIn()) {
        redirect(context.oldRoute.path);
    }
};

function RequireLoginTrigger (context, redirect) {
    if (!Auth.isLoggedIn()) {
        if (context.oldRoute) {
            redirect(context.oldRoute.path);
        } else {
            redirect('/login');
        }
    }
};

function RequireAdminTrigger(context, redirect) {
    if (!Auth.isAdmin()) {
        redirect('/cards');
    }
};

function PerformLogoutTrigger (context, redirect) {
    if (Auth.isLoggedIn()) {
        Meteor.logout(() => {
            FlowRouter.go('/login');
        });
    }
}

// Dashboard routes
var dashboardRoutes = FlowRouter.group({
    name: 'dashboard'
});

dashboardRoutes.route('/', {
    triggersEnter: [RequireLoginTrigger],

    action() {
        ReactLayout.render(MainLayout, {content: <DashboardPage />});
    }
});

// Cards routes
var cardsRoutes = FlowRouter.group({
    name: 'cards'
});

cardsRoutes.route('/cards/new', {
    triggersEnter: [RequireLoginTrigger, RequireAdminTrigger],

    action() {
        ReactLayout.render(MainLayout, {content: <CardNewPage />});
    }
});

cardsRoutes.route('/cards/mass-add', {
    triggersEnter: [RequireLoginTrigger, RequireAdminTrigger],

    action() {
        ReactLayout.render(MainLayout, {content: <CardMassAddPage />});
    }
});

cardsRoutes.route('/cards/:cardId/view', {
    action(params) {
        ReactLayout.render(MainLayout, {content: <CardViewPage {...params} />});
    }
});

cardsRoutes.route('/cards/:cardId/edit', {
    triggersEnter: [RequireLoginTrigger, RequireAdminTrigger],

    action(params) {
        ReactLayout.render(MainLayout, {content: <CardViewPage isEditing={true} {...params} />});
    }
});

cardsRoutes.route('/cards/:page?', {
    triggersEnter: [RequireLoginTrigger],

    action(params) {
        ReactLayout.render(MainLayout, {content: <CardListPage page={parseInt(params.page)} />});
    }
});

cardsRoutes.route('/cards/scans/:page?', {
    action(params) {
        ReactLayout.render(MainLayout, {content: <CardListPage scansView={true} page={parseInt(params.page)} />, fullContent: true});
    }
});

// Sets routes
var setsRoutes = FlowRouter.group({
    name: 'sets'
});

setsRoutes.route('/sets', {
    action() {
        ReactLayout.render(MainLayout, {content: <CardSetListPage />});
    }
});

setsRoutes.route('/sets/:setId/view', {
    action(params) {
        ReactLayout.render(MainLayout, {content: <CardSetViewPage {...params} />});
    }
});

setsRoutes.route('/sets/new', {
    triggersEnter: [RequireLoginTrigger, RequireAdminTrigger],

    action() {
        ReactLayout.render(MainLayout, {content: <CardSetNewPage />});
    }
});

setsRoutes.route('/sets/:setId/edit', {
    triggersEnter: [RequireLoginTrigger, RequireAdminTrigger],

    action(params) {
        ReactLayout.render(MainLayout, {content: <CardSetViewPage isEditing="true" {...params} />});
    }
});

// Collection routes
var collectionsRoutes = FlowRouter.group({
    name: 'collection'
});

collectionsRoutes.route('/my-collection', {
    triggersEnter: [RequireLoginTrigger],

    action(params) {
        ReactLayout.render(MainLayout, {content: <CollectionStatsPage />});
    }
});

collectionsRoutes.route('/my-collection/:setId', {
    triggersEnter: [RequireLoginTrigger],

    action(params) {
        ReactLayout.render(MainLayout, {content: <CollectionListPage {...params} />, fullContent: true});
    }
});

// Scheduler routes
var schedulerRoutes = FlowRouter.group({
    name: 'scheduler'
});

schedulerRoutes.route('/scheduler', {
    triggersEnter: [RequireLoginTrigger, RequireAdminTrigger],

    action() {
        ReactLayout.render(MainLayout, {content: <SchedulerPage />});
    }
});

// Account routes
var accountRoutes = FlowRouter.group({
    name: 'account'
});

accountRoutes.route('/login', {
    triggersEnter: [RequireLogoutTrigger],

    action() {
        ReactLayout.render(MainLayout, {content: <LoginPage />});
    }
});

/*accountRoutes.route('/register', {
    triggersEnter: [RequireLogoutTrigger],

    action() {
        ReactLayout.render(MainLayout, {content: <RegisterPage />});
    }
});*/

accountRoutes.route('/logout', {
    triggersEnter: [
        RequireLoginTrigger,
        PerformLogoutTrigger
    ]
});
