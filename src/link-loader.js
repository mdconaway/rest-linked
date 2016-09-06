//An example link rowConfig object:
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

function linker(originRecord, loadedRecord, rowConfig){
    if(rowConfig.type === 'manyToMany')
    {
        originRecord[rowConfig.ownKey] = originRecord[rowConfig.ownKey] ? originRecord[rowConfig.ownKey] : [];
        loadedRecord[rowConfig.foreignKey] = loadedRecord[rowConfig.foreignKey] ? loadedRecord[rowConfig.foreignKey] : [];
        originRecord[rowConfig.ownKey].push(loadedRecord[rowConfig.foreignPk]);
        loadedRecord[rowConfig.foreignKey].push(originRecord[rowConfig.ownPk]);
    }
    else if(rowConfig.type === 'hasOne')
    {
        originRecord[rowConfig.ownKey] = loadedRecord[rowConfig.foreignPk];
        loadedRecord[rowConfig.foreignKey] = originRecord[rowConfig.ownPk];
    }
    else if(rowConfig.type === 'hasMany')
    {
        originRecord[rowConfig.ownKey] = originRecord[rowConfig.ownKey] ? originRecord[rowConfig.ownKey] : [loadedRecord[rowConfig.foreignPk]];
        loadedRecord[rowConfig.foreignKey] = originRecord[rowConfig.ownPk];
        originRecord[rowConfig.ownKey].push(loadedRecord[rowConfig.foreignPk]);
    }
}

export default function(originName = '', opts = {}){
    let { mapper = {}, trim = '', config = {}, pluralize = Pluralize } = opts;
    let defaultType = 'hasMany';
    return function(linkArray, query = {}){
        let origin = this;                          //a record instance
        let links = this.links ? this.links : {};   //a record's links object
        let store = mapper.datastore;               //the store instance to query from
        let promises = [];                          //an array of pending queries
        let toLoad = [];                            //a vetted list of links to load
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
            if(!config[link])
            {
                config[link] = {
                    type: defaultType,
                    ownKey: link,
                    ownPk: 'id',
                    foreignKey: pluralize(originName, 1),  //needs to be record singular name...
                    foreignPk: 'id',
                    targetCollection: pluralize(link,1)
                };
            }
            let rowConfig = config[link];
            promises.push(
                store.findAll(rowConfig.targetCollection, query, { endpoint: links[link].replace(trim, '') }).then(function(records){
                    records.forEach(function(record){
                        linker(origin, record, rowConfig);
                    });
                })
            );
        });
        return Promise.all(promises);
    };
}