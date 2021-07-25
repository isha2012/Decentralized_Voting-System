const fs = require('fs');
const path = require('path');
const solc = require('solc');
const fs_extra = require('fs-extra')

var contract_path = path.resolve(__dirname ,'election.sol');
var source = fs.readFileSync(contract_path,'utf-8');
var output = solc.compile(source,1);

for(var i in output.errors)
{
    console.log(output.errors[i]);
}
if(!output.errors)
{
    for(var contract in output.contracts)
    {
        console.log(contract);
        var json_path = path.resolve(__dirname ,"build",contract.replace(":","")+".json");
        fs_extra.outputFileSync(json_path,JSON.stringify(output.contracts[contract]))
    }
}
