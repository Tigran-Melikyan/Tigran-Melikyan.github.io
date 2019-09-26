let nkar = new Array();
let gago;
let vzgo = 0;


nkar[0] = 'Maserati-MY18-MY19-GranTurismo-170960M.jpg';
nkar[1] = 'used-2013-maserati-granturismo-2drcoupesport-9871-18007143-1-1024.jpg';
nkar[2] = 'mid-engined-maserati-rendering.jpg';
nkar[3] = 'cdf1c80e07641235830f7016f01fabd3.jpg';

let numOfImg = nkar.length;

function slideShow(){
	vzgo = (vzgo + 1) % nkar.length;
	document.getElementById('imgSlide').src = nkar[vzgo];
	console.log(vzgo);
}

function setInt(){
	if( gago ){
		clearInterval( gago );
		gago = null;
	} else {
		gago = setInterval(slideShow,3000);
		console.log(vzgo);
		document.getElementById("imgSlide").src = nkar[vzgo];
	}
}

function prevImg(){
	if(vzgo > 0){
		vzgo--;
	}else{
		vzgo = numOfImg - 1;
	}
	console.log(vzgo);
	document.getElementById("imgSlide").src = nkar[vzgo];
}
function nextImg(){
	if(vzgo < numOfImg - 1){
		vzgo++;
	}else{
		vzgo = 0;
	}
	console.log(vzgo);
	document.getElementById("imgSlide").src = nkar[vzgo];
}

