const xmlparse = require('xml2js').parseString;

var xml_text = `
    <xml>
        <from>Albert</from>
        <to>Hilbert</to>
        <content>E=MC^2</content>
    </xml>
`;

//可以把explicitArray 改成 true查看结果
xmlparse(xml_text, {explicitArray : false}, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});
