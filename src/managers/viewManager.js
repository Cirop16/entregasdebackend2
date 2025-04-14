class ViewManager {
    renderHome(req, res) {
        res.render('home', { user: req.session.user });
    }

    renderRegister(req, res) {
        res.render('register');
    }

    renderProfile(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render('profile', { user: req.session.user });
    }
}

export default ViewManager;