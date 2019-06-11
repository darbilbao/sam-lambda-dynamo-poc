const DB = require('./aws-dynamo');
const Dynamo = new DB();

exports.lambdaHandler = async (event) => {
    console.log(event);
    if (event.httpMethod === 'PUT') {
        let response = await putCat(event)
        return done(response);
		
    } else if (event.httpMethod === 'GET') {
        //let response = await getCat(event);
		let response = await getCatAll(event);
        return done(response);
    }
};

const done = response => {
    return {
        statusCode: '200',
        body: JSON.stringify(response),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        }
    }
}

const cats = {
    SIA: 'Siamese',
	EU:'European',
	ABYS: 'Abyssinian',
	BENG: 'Bengal'	
}


const putCat = async event => {
	console.log(event.body);
    let params = JSON.parse(event.body);
	let breed = params.breed;
	console.log('param breed: ' + breed);
	
	// let ID = event.pathParameters["breed"];
    // console.log(ID);	
    return Dynamo.increment(breed, 'CatBreedTable')
}


const getCat = event => {
    //let genre = event.pathParameters.genre;
    //return cats[genre];
	return cats;
}

const getCatAll = async event => {
    let genre = 'SIA'; // event.pathParameters.genre;
    let data = await Dynamo.scan('breedId', genre, 'CatBreedTable');
    let result = data.Items.sort((a,b) => b.count - a.count);
    result = result.map(({count, ID, genre})=> { return {count, ID, genre}});
    return data;
}
