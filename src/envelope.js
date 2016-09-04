function serialize(config, response){ //opts
    var envelope = {};
    envelope[config.name] = response;
    return envelope;
}

function deserialize(config, response){ //opts
    return response.data[Object.keys(response.data)[0]];
}

export default { serialize, deserialize };