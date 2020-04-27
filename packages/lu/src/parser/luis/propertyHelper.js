
module.exports = {
    jsonPropertyName: function(property) {
        if (typeof property === 'object') {
            property = property.name
        }
        property+= ''
        let name = property.split(':').slice(-1)[0];
        if (!name.startsWith('geographyV2') &&
            !name.startsWith('ordinalV2') &&
            name.endsWith('V2')) {
            name = name.substring(0, name.length - 2);
        }
        return this.normalizeName(name);
    },
    normalizeName: function(name) {
        return name.replace(/\./g, '_').replace(/ /g, '_');
    }
}
