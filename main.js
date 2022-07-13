const URL_API_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=3";
const URL_API_FAVOURITES = "https://api.thecatapi.com/v1/favourites";
const URL_API_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const URL_API_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

// Llamada a API usando promesas
//fetch(URL)
//	.then(res => res.json())
//	.then(data => {
//		const img = document.querySelector('img')
//		img.src = data[0].url;
//	});		
//
const spanError = document.getElementById('spanError');

async function loadRandomCats(){ //La función reload se crea en el boton de HTML para recargar la imagen cuando se le da click
	const res = await fetch(URL_API_RANDOM);
	const data = await res.json();//Se transforma la sintaxis para que javaScript entienda el contexto.

	if(res.status !== 200){
	spanError.innerHTML = "Hubo un error: "	+ res.status;
		} else {
			const img1 = document.getElementById("img1");
			const img2 = document.getElementById("img2");
			const img3 = document.getElementById("img3");
	
			const btn1 = document.getElementById("saveCat1");
			const btn2 = document.getElementById("saveCat2");
			const btn3 = document.getElementById("saveCat3");

			img1.src = data[0].url;
			img2.src = data[1].url;
			img3.src = data[2].url;

			btn1.onclick = ()=> saveFavouritesCat(data[0].id);
			btn2.onclick = ()=> saveFavouritesCat(data[1].id);
			btn3.onclick = ()=> saveFavouritesCat(data[2].id);
			};
}

async function loadFavouritesCats(){ //La función reload se crea en el boton de HTML para recargar la imagen cuando se le da click
	const res = await fetch(URL_API_FAVOURITES, {
		method: 'GET',
		headers:{
		'X-API-KEY':'5098bd29-025c-43b4-bf4c-cbf2f66689be',
		},
	});
	const data = await res.json();//Se transforma la sintaxis para que javaScript entienda el contexto.
	console.log("Favoritos");
	console.log(data);

	if(res.status !== 200){
		spanError.innerHTML = "error: "+ res.status + data.message;
	} else {
		const section = document.getElementById('favoritesCats')
		section.innerHTML="";
		const h2 = document.createElement("h2");
		const h2Text= document.createTextNode("Favourites cats");
		h2.appendChild(h2Text);
		section.appendChild(h2);

		data.forEach(cat => {
			const article = document.createElement('article');
			article.className = "favoritesCats__article"
			const img = document.createElement('img');
			img.className = "cat-container__img favoritesCats__img"
			const btn = document.createElement('button');
			btn.className = "cat-container__button favoritesCats__btn"
			const btnText = document.createTextNode('remove Cats from favourites');

			img.src = cat.image.url
			btn.appendChild(btnText);
			btn.onclick = () => deleteFavouriteCat(cat.id)
			article.appendChild(img);
			article.appendChild(btn);
			section.appendChild(article);
		});
	}
};

async function saveFavouritesCat (id){
	const res = await fetch(URL_API_FAVOURITES,{
		method: 'POST',
		headers:{
			'Content-Type': 'application/json',
			'x-api-key':'5098bd29-025c-43b4-bf4c-cbf2f66689be', 
		},
		body:JSON.stringify({
			image_id: id
		}),
	});	
	const data = await res.json();

	console.log('Save');
	console.log(res);

	if(res.status !== 200){
		spanError.innerHTML = "error: "+ res.status + data.message;
	} else {
		console.log('cat saved in favourites')
		loadFavouritesCats();
	}
};

async function deleteFavouriteCat (id){
	const res = await fetch(URL_API_DELETE(id), {
		method: 'DELETE',
		headers:{
			'x-api-key':'5098bd29-025c-43b4-bf4c-cbf2f66689be'
		}
	});
	const data = await res.json();

	if(res.status !== 200){
		spanError.innerHTML = "error: " + res.status + data.message;
	}else{
	console.log('cat deleted')
		loadFavouritesCats();
	}
}

async function loadCatPhoto () {
	const form = document.querySelector('#uploadingForm');
	const formData = new FormData(form);

	console.log(formData.get('file'))

	const res = await fetch(URL_API_UPLOAD, {
		method: 'POST',
		headers:{
			//'Content-type': 'multipart/form-Data',
			'X-API-KEY': '5098bd29-025c-43b4-bf4c-cbf2f66689be',
		},
		body: formData,
	});
	const data = await res.json();
	
	if(res.status !== 201){
		spanError.innerHTML = "Hubo un error: " + res.status + data.message;
		console.log({data})
	}else{
		console.log('Photo load sucesfully')
		console.log({data})
		console.log(data.url)
		saveFavouritesCat(data.id);
	}
}

loadRandomCats(); //Se llama dos veces la función para que no aparesca  vacio al principio.
loadFavouritesCats(); 


