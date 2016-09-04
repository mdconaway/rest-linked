var testStore = new restLinked.store({
    store: {
        //any opts you want sent to the js-data DataStore instance
    },
    http: {
        basePath: '/api'  //generally you need a base path for a rest api
        //enveloped: true  //by default the rest store assumes data is enveloped
    }
});

testStore.defineMapper('post', {
  // Our API endpoints use plural form in the path
  endpoint: 'posts',
  relations: {
    hasMany: {
      comment: {
        localKeys: 'comments',
        localField: 'commentObjects',
        foreignKey: 'post'
      }
    }
  },
  methods: {
    loadLinks: new restLinked.loader('post', {
        store: testStore,
        trim: '/api',    //trims '/api' out of any returned link urls. Don't need a trim? Great! Don't include the argument!
        linkConfig: {
          //a config object hash that details how to resolve link-loaded records
        }
    })
  }
});

testStore.defineMapper('comment', {
  // Our API endpoints use plural form in the path
  endpoint: 'comments',
  relations: {
      belongsTo: {
        post: {
          localField: 'postObject',
          foreignKey: 'post'
        }
      }
  }
});

testStore.findAll('comment').then(function(comments){
  console.log('in the beginning, there were comments', comments);
  testStore.findAll('post').then(function(posts){
      posts.forEach(function(post){
          post.loadLinks(['comments']).then(function(){
              console.log('and then the posts found their links to the comments', post);
          });
      })
  });
});