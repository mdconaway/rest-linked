import { Mapper } from 'js-data';
import loader from './link-loader';

function linkMapper (opts = {}) {
    let linkObject = opts.links ? opts.links : {};
    delete  opts.links;
    linkObject.mapper = this;
    opts.methods = opts.methods ? opts.methods : {};
    opts.methods.loadLinks = new loader(opts.name, linkObject);
    Mapper.call(this, opts);
}
export default Mapper.extend({
    constructor: linkMapper
});