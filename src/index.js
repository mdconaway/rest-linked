/*
 * This is the main entry point for rest-linked
 */

import { DataStore, utils } from 'js-data';
import { HttpAdapter } from 'js-data-http';
import Bluebird from 'bluebird';
import pluralize from 'pluralize';
import envelope from './envelope';
import mapper from './mapper';
utils.Promise = Bluebird;

function store(opts = {}){
    let http = opts.http ? opts.http : {};
    let assumeEnvelope = opts.http.enveloped ? opts.http.enveloped : true;
    let serialize = http.serialize || envelope.serialize;
    let deserialize = http.deserialize || envelope.deserialize;
    let storeOpts = opts.store ? opts.store : {};
    let store, httpAdapter;
    if(assumeEnvelope)
    {
        http.serialize = serialize;
        http.deserialize = deserialize;
    }
    storeOpts.mapperClass = mapper;
    store = new DataStore(storeOpts);
    httpAdapter = new HttpAdapter(http);
    // "store" will now use an HTTP adapter by default
    store.registerAdapter('http', httpAdapter, { 'default': true });

    return store;
}

export {
    HttpAdapter,
    DataStore,
    envelope,
    pluralize,
    store,  //this is the important guy
    utils
};