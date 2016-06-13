module.exports = {

    'facebookAuth':
    {
        id: '230153647346505',
        secret: '0c0fa7e2cbe2dfb8481d9f2b3f8db65f',
        callbackURL:'http://147.83.7.158:3000/auth/facebook/callback',
        // profileFields: ['id','name','emails','photos']
        profileFields: ['id','name','photos']

    },
    'twitterAuth': {
        'consumerKey': 'tWqQ3nPA0aULUz7Z7c9H6hTZM',
        'consumerSecret': 'HlmYdbkX3NaRIgkh2YTsjffqe6f1gUj3stdXXugxZcsHb0dauA',
        'callbackURL': '/auth/twitter/callback'
    }
};

