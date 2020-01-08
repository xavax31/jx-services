var fs = require('fs');
var path = require("path");
var Cloner = require("./copy-folder");

var modelJSON = {
	"titre":{"text":"Quel habitant du futur serais-tu ?","style":{"fontName":"Harimau","fontStyle":"normal","fontSize":"30px","color":"#000000"},"offset":{"x":0,"y":0}},
	"questions":[{"id":1,"text":"Dans quel type de lit dors-tu ?","answers":[{"text":"Dans un lit qui flotte dans les airs","good":true},{"text":"Dans un lit cocon accroché à une plante géante","good":false},{"text":"Dans un lit protégé par une bulle de cristal","good":false}]},{"id":2,"text":"Comment composes-tu ton petit déj’ ?","answers":[{"text":"Tu commandes le menu du jour à ton robot cuisinier.","good":true},{"text":"Tu achètes les œufs à la ferme, qui se trouve au sommet de ton gratte-ciel.","good":false},{"text":"Tu prépares toi-même des pancakes.","good":false}]},{"id":3,"text":"Comment te laves-tu ?","answers":[{"text":"Sous une cascade d’eau lumineuse et musicale","good":true},{"text":"Sans eau, grâce à ta douche à jet d’air","good":false},{"text":"Avec un savon à la recette ancienne et secrète","good":false}]},{"id":4,"text":"Ton vêtement préféré :","answers":[{"text":"Ton tee-shirt qui change de motifs à volonté","good":true},{"text":"Ton pull en coton de nénuphars et en laine de mûres","good":false},{"text":"Tes baskets montantes en cuir","good":false}]},{"id":5,"text":"Comment vas-tu à l’école ?","answers":[{"text":"Seul(e), sur ton skate volant","good":true},{"text":"Avec ta famille, en voiture solaire","good":false},{"text":"À pied, avec tes ami(e)s du quartier","good":false}]},{"id":6,"text":"Quel serait ton animal de compagnie ?","answers":[{"text":"Un robot-singe fan de jeux vidéo","good":true},{"text":"Un écureuil qui te parle grâce à un casque spécial","good":false},{"text":"Un pigeon voyageur","good":false}]},{"id":7,"text":"Choisis la citation que tu préfères :","answers":[{"text":"« La vie devrait davantage ressembler à la télé. » Calvin et Hobbes","good":true},{"text":"« Il faut changer le monde vite fait, sinon c’est lui qui va nous changer. » Mafalda","good":false},{"text":"« Dans le passé, il y avait plus de futur que maintenant. » Le Chat","good":false}]},{"id":8,"text":"Quel cadeau te ferait le plus plaisir ?","answers":[{"text":"Un blouson caméléon qui prend la couleur et les motifs du décor","good":true},{"text":"Des chaussures qui sèment des graines de fleurs dans le sol","good":false},{"text":"Une cape d’invisibilité","good":false}]},{"id":9,"text":"À quel type de jeux es-tu imbattable ?","answers":[{"text":"Les jeux vidéo","good":true},{"text":"Les jeux de piste","good":false},{"text":"Les échecs","good":false}]},{"id":10,"text":"Quel sport pratiques-tu ?","answers":[{"text":"L’escrime au sabre laser","good":true},{"text":"Le vélo volant acrobatique","good":false},{"text":"L’équitation","good":false}]}],
	"profils":{"1":"Techno-fan","2":"Futuro-écolo","3":"Cyber-méfiant"},
	"conclusions":{"1":"Mordu(e) d’inventions en tous genres, tu pilotes\nrobots et ordinateurs avec une facilité\nimpressionnante. Sans cesse à l’affût des progrès\nde ton temps, tu as dans les yeux cette petite\nétincelle d’émerveillement que tes proches adorent.\nJuste un conseil : n’oublie pas de rester connecté(e)\nà la réalité ! Tout simplement parce qu’un\nordinateur ne remplacera jamais tes meilleur(e)s ami(e)s !","2":"Engagé(e), tu veilles à la protection de\nl’environnement et des animaux. Ton credo ?\nIl ne faut pas scier la branche sur laquelle\nles hommes sont assis. Optimiste, tu te bats\npour que demain soit encore plus vert.\nOK ! OK ! C’est bien de militer pour un combat qui\nte tient à cœur, mais n’oublie pas de relâcher\nla pression ! Montre l’exemple à tes proches, mais\nne leur fais pas trop la leçon !","3":"Marre de toute cette technologie qui éloigne\nles gens les uns des autres ! Tu aimes être entouré(e)\nde tes proches en chair et en os, pas de leur image\nsur écran. Un seul mot : résistance ! Tu as raison\nde préférer le contact humain, mais ne te braque pas\ntrop quand même. Parfois, la technologie peut aussi\nrendre des services."}

}


exports.async = true;

exports.run = function (params, callback) {
	if (params.body) {
		var args = JSON.parse(params.body.params);
	}
	else {
		var args = params;
	}
	
	console.log("openFile", args);

	//--- clonerep model
	global.httpPath = "/Users/xb/Documents/_xb/root";//../../../../../../"
	var sourceToConvert = path.join(global.httpPath, args.sourceToConvert);
	var model = path.join(global.httpPath, args.model);
	var dest = path.join(global.httpPath, args.dest);

	console.log(model, dest)
	// return;
	var paramsCloneProject = {
		date: false, // if true, date string is added in copy directory name
		ext_exclude: [],   // exclude files with these extensions
		fichier_reg_exclude: [],    // exclude files for wich name matches these regular expressions
		dossier_reg_exclude: [],     // exclude directories for wich name matches these regular expressions

		arbo_seule: false, // copy only directories, but no files
		ecrase_dossiers: true,  // erase dest dir if exists before copy, else copy on existing directory (good for patches)
		supprimer_fichiers_source: false, // delete ori dir after copy
		nb_recursif: 10000 // level of recursivity in directories
	}
	Cloner.cloneRep(paramsCloneProject, model, dest);


	console.log(modelJSON)
	callback({success:true});

	var editorJSONURL = dest + "/etc/editor/editor.json";
	var editorContent = 	JSON.parse(fs.readFileSync(editorJSONURL, 'utf8'));
	//console.log("ec",editorContent);
	var gabarit = editorContent.projectData;

	for (var i = 0; i < modelJSON.questions.length; i++) {
		console.log("Q"+gd2(modelJSON.questions[i].id, 2)+"_T")
		var item = getInGabarit({id: "Q"+gd2(modelJSON.questions[i].id, 2)+"_T", gabarit: gabarit});
		item.value = modelJSON.questions[i].text;

		var answers = modelJSON.questions[i].answers;

		for (var j = 0; j < answers.length; j++) {
			var answerItem = getInGabarit({id: "Q"+gd2(modelJSON.questions[i].id, 2)+"_R"+gd2(answers[j].id, 2)+"_T", gabarit: gabarit});
			answerItem.value = answers[j].text;
		};
	};

console.log(editorContent)

	
	return true;
}

function gd2( intValue, numLetters ) {
    
    var intValueToString = String(intValue);
    var intValueToStringLength = intValueToString.length;
    var result = [];
    for (var i = 0; i < numLetters; i++) {
        result.unshift((intValueToString[intValueToStringLength  - 1 - i] == undefined ? "0" : intValueToString[intValueToStringLength - 1 - i])) ;
    };
    return result.join("");
}


	/** */
	_getInGabarit = function(params) {
		var id = params.id;
		var gabarit = params.gabarit;
		//console.log(id)
		//console.log(gabarit)
		var idArr = id.split(".");

		for (var i = 0; i < idArr.length; i++) {
			idArr[i]
		};

		for (var i = 0; i < gabarit.length; i++) {
			//console.log(gabarit[i].id)
			if (gabarit[i].id == id) {
				//console.log("FOUND")
				return gabarit[i];
			}
			else if (gabarit[i].type=="Group") {
				//console.log("Group",gabarit[i].id)
				var childrenG = _getInGabarit({id:id, gabarit:gabarit[i].children});
				if (childrenG !=null) {
					console.log("YY", id, gabarit[i].children)
					return _getInGabarit({id:id, gabarit:gabarit[i].children})
				};
				
			}
		};
		return null;

	}

	/** */
	getInGabarit = function(params) {
		var id = params.id;
		var gabarit = params.gabarit;
		//console.log("id",id)
		//console.log("g",gabarit)
		var idArr = id.split(".");

		var item;
		var children = gabarit;

		for (var i = 0; i < idArr.length; i++) {
			console.log("ID",idArr[i])
			item = _getInGabarit({id: idArr[i], gabarit: children});
			if (item.children) {
				children = item.children;
			}
		};

		return item;

	}


this.run({model: "/resources/milan-presse/moteurs/kimi-test", dest: "/archives/milan-presse/tob3_test01",
sourceToConvert: "/archives/milan-presse_/tob7_020_test"}, function(evt){
	console.log(evt);
})