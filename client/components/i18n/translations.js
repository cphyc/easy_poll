angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('fr', {"Add answer":"Ajouter réponse","Add new answer here":"Écrire une réponse ici","Add question":"Ajouter question","Admin":"Administration","Answer poll":"Répondre au questionnaire","Answer the poll":"Répondre au questionnaire","Ask your question here":"Écrire votre question ici","Cancel!":"Annuler","Confirm":"Confirmer","Delete answer":"Supprimer la réponse","Delete question":"Supprimer la question","Foo bar":"Foo bar","Hello {{ getCurrentUser().name }}":"Bonjour {{ getCurrentUser().name }}","Hide {{ poll.questions.length}} questions":"Cacher les {{ poll.questions.length }} questions","Home":"Accueil","Login":"Connexion","Logout":"Déconnexion","Move answer down":"Descendre la réponse","Move answer up":"Monter la réponse","Move down":"Descendre","Move up":"Monter","Name":"Nom","Next question":"Question suivante","No answers yet.":"Aucune réponse enregistrée.","Pick file":"Choisir un fichier","Polls":"Questionnaires","Polls list":"Liste des questionnaires","Question n°{{$index}}":"Question n°{{$index}}","Question n°{{questionNumber}}":"Question n°{{questionNumber}}","Score":"Résultat","Sign up":"Inscription","Submit poll":"Sauvegarder le questionnaire","To edit the poll, click on the field to edit and type your text. To format the text, select it and pick the desired format in the floating box.":"Pour éditer le questionnaire, cliquer sur le champ à modifier et taper votre texte ; sélectionner pour mettre en forme (gras, italique, …).","Toggle navigation":"Basculer la navigation","Upload file":{"$$noContext":"Télécharger un fichier","button":"Télécharger"},"Upload picture":"Télécharger une image","Uploaded!":"Fichier téléchargé !","Uploading…":"Téléchargement …","View {{ poll.questions.length }} questions":"Voir les {{ poll.questions.length }} questions","Would you like to delete this poll?":"Voulez-vous supprimer le sondage ?","You answered the poll.":"Vous avez répondu au questionnaire.","delete poll":"supprimer le sondage","eduquizz":"eduquizz","{{ poll.name }} — given answers":"{{ poll.name }} — réponses enregistrées"});
/* jshint +W100 */
}]);