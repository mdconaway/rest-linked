# REST-LINKED

## An opinionated REST/http store that uses lightweight data links

## Installation

1. Clone this repository
2. run "npm install" from the root of the project directory
3. "npm install -g webpack"
4. "npm install -g eslint"

## Build

1. "npm run build"

## Browser Test

1. "npm run serve"
2. Open a browser to http://localhost:8080

## Exports

### store

`store` is the fundamental entity exported by rest-linked. It is a batteries-included
implementation of an enveloped REST/linked-data store and adapter. The primary function
it provides is a new instance method on all records called `loadLinks`. Additionally,
each mapper defined using the method `store.defineMapper`  automatically inherits
this instance method, and `store.defineMapper` also accepts a new options parameter
called `links`.  

Example:
```js
var testStore = new restLinked.store({
    store: {
        //any opts you want sent to the js-data DataStore instance
    },
    http: {
        basePath: '/api'  //generally you need a base path for a rest api
        //enveloped: true  //by default the rest store assumes data is enveloped, you can disable this if you want
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
  links: {
    trim: '/api',    //trims '/api' out of any returned link urls. Don't need a trim? Great! Don't include the argument!
    config: {
      //a config object hash that details how to resolve link-loaded records
    }
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
```

In general a config object for a single link row would look like this:
```js
var rowConfig = {
    type: 'hasMany',        //hasMany, hasOne, manyToMany
    ownKey: 'comments',             //collection field name will match link name by default
    ownPk: 'id',            //primary key for record containing the links hash
    foreignKey: 'post',         //foreign key name will match singular name of collection field by default
    foreignPk:'id',         //primary key for the collection refenced by the link
    targetCollection: 'comment'    //the string name of the link's target resource. Auto-populated with the link name's singular if no rowconfig provided
};
```

And you can completely customize how any single link is handled by defining your mapper like this:
```js
testStore.defineMapper('post', {
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
  links: {
    trim: '/api',    
    config: {
        comments: {
            type: 'hasMany',        
            ownKey: 'comments',             
            ownPk: 'id',            
            foreignKey: 'post',         
            foreignPk:'id',         
            targetCollection: 'comment'    
        }
    }
  }
});

```

Loading links for a relationship bears a strong resemblance to loading relations in vanilla js-data:
```js
testStore.findAll('post').then(function(posts){
    posts.forEach(function(post){
        post.loadLinks(['comments']).then(function(){
            //congratulations! your comments are now loaded and linked in the store!
        });
    });
});
```

### HttpAdapter

Exported js-data-http class.

### DataStore

Exported js-data DataStore class.

### envelope

Serlialization and deserialization methods used if no user methods are provided. Extend these, or 
just write your own serializers and pass them into the store constructor's http config.

### pluralize

The pluralization modules used to singularize link names. Add inflection rules in accordance with
the npm module's guide.

### utils

An exported instance of js-data's utils class. The promise library `bluebird` has been attached as 
the default Promise class.

## TODO

1. More documentation! (ALL THE DOCUMENTS!!!)

For an example of how to use the restLinked store in your app, take a look at server/app.js.