const MAX_LENGTH = 150;

function validateCreateBook(payLoad){
    const errors = [];

    //verification qu'on a bien recu un objet json
    if(!payLoad || typeof payLoad !== "object") {
        errors.push("le corp de la requete doit être en json!");
        return errors;
    }

    //recupération des trois données attendus
    const {title, author, dispo} = payLoad; 

    //verification title obligatoire, chaine non vide et taille limitée
    if(typeof title !== "string" || title.trim().length === 0){
        errors.push("le titre est obligatoire, il ne doit pas etre vide");
    }else if(title.trim().length > MAX_LENGTH){
        errors.push(`le titre ne doit pas dépasser ${MAX_LENGTH} caracteres `);
    }

    //verification author obligatoire, chaine non vide et taille limitée
    if(typeof author !== "string" || author.trim().length === 0){
        errors.push("author est obligatoire, il ne doit pas etre vide");
    }else if(author.trim().length > MAX_LENGTH){
        errors.push(`author ne doit pas dépasser ${MAX_LENGTH} caracteres `);
    }

    //dispo optionnel a la recuperation des données mais il doit etre boolean
    if(typeof dispo !== "undefined" && typeof dispo !== "boolean"){
        errors.push("dispo doit être un boolean");
    }

    return errors; //return les erreurs ou un tableau vide si tout est bon
}

function validateUpdateBook(payload){
    const errors = [];

    //verification qu'on a bien recu un objet json
    if(!payload || typeof payload !== "object") {
        errors.push("le corp de la requete doit être en json!");
        return errors;
    }

    //une mis a jour est utile si au moins une valeur est différente
    if(
        typeof payload.title === "undefined" &&
        typeof payload.author === "undefined" &&
        typeof payload.dispo === "undefined" 
    ){
        errors.push("au moins un champs doit etre fournis pour une modification");
        return errors;
    }

    return validateCreateBook(payload);
}

module.exports = {
    validateCreateBook,
    validateUpdateBook
};