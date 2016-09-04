//An example link config object:
//{
//    type: 'hasMany',    //hasMany, hasOne, manyToMany
//    ownKey: '',    //collection field name will match link name by default
//    ownPk: 'id',
//    foreignKey: '', //foreign key name will match singular name of collection field by default
//    foreignPk:'id',
//    targetCollection: //the string name of the link's target resource
//};
import Promise from 'bluebird';
import Pluralize from 'pluralize';

function linker(originRecord, loadedRecord, config){
    if(config.type === 'manyToMany')
    {
        originRecord[config.ownKey] = originRecord[config.ownKey] ? originRecord[config.ownKey].push(loadedRecord[config.foreignPk]) : [loadedRecord[config.foreignPk]];
        loadedRecord[config.foreignKey] = loadedRecord[config.foreignKey] ? loadedRecord[config.foreignKey].push(originRecord[config.ownPk]) : [originRecord[config.ownPk]];
    }
    else if(config.type === 'hasOne')
    {
        originRecord[config.ownKey] = loadedRecord[config.foreignPk];
        loadedRecord[config.foreignKey] = originRecord[config.ownPk];
    }
    else if(config.type === 'hasMany')
    {
        originRecord[config.ownKey] = originRecord[config.ownKey] ? originRecord[config.ownKey].push(loadedRecord[config.foreignPk]) : [loadedRecord[config.foreignPk]];
        loadedRecord[config.foreignKey] = originRecord[config.ownPk];
    }
}

export default function(originName = '', opts = {}){
    let { store = {}, trim = '', linkConfig = {}, pluralize = Pluralize } = opts;
    let defaultType = 'hasMany';
    return function(linkArray, query = {}){
        let origin = this;
        let links = this.links ? this.links : {};
        let promises = [];
        let toLoad = [];
        if(Array.isArray(linkArray))
        {
            linkArray.forEach(function(link){
                if(links[link])
                {
                    toLoad.push(link);
                }
            });
        }
        else
        {
            toLoad = Object.keys(links);
        }
        toLoad.forEach(function(link){
            if(!linkConfig[link])
            {
                linkConfig[link] = {
                    type: defaultType,
                    ownKey: link,
                    ownPk: 'id',
                    foreignKey: pluralize(originName, 1),  //needs to be record singular name...
                    foreignPk: 'id',
                    targetCollection: pluralize(link,1)
                };
            }
            let config = linkConfig[link];
            promises.push(
                store.findAll(config.targetCollection, query, { endpoint: links[link].replace(trim, '') }).then(function(records){
                    records.forEach(function(record){
                        linker(origin, record, config);
                    });
                })
            );
        });
        return Promise.all(promises);
    };
}