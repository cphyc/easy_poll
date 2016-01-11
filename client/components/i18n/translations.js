angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('fr', {"Add answer":"Ajouter réponse","Add question":"Ajouter question","Admin":"Administration","Answer the poll":"Répondre au questionnaire","Delete answer":"Supprimer la réponse","Hello {{ getCurrentUser().name }}":"Bonjour {{ getCurrentUser().name }}","Hide {{ poll.questions.length}} questions":"Cacher les {{ poll.questions.length }} questions","Login":"Connexion","Logout":"Déconnexion","Move answer down":"Descendre la réponse","Move answer up":"Monter la réponse","Move down":"Descendre","Move up":"Monter","Name":"Nom","Next question":"Question suivante","No answers yet.":"Aucune réponse enregistrée.","Polls list":"Liste des questionnaires","Question n°{{$index}}":"Question n°{{$index}}","Save":"Sauvegarder","Score":"Résultat","Sign up":"Inscription","Submit poll":"Sauvegarder le questionnaire","To edit the poll, click on the field to edit and type your text. To format the text, select it and pick the desired format in the floating box.":"Pour éditer le questionnaire, cliquer sur le champ à modifier et taper votre texte ; sélectionner pour mettre en forme (gras, italique, …).","Toggle navigation":"Basculer la navigation","View {{ poll.questions.length }} questions":"Voir les {{ poll.questions.length }} questions","You answered the poll.":"Vous avez répondu au questionnaire.","eduquizz":"eduquizz","{{ poll.name }} — given answers":"{{ poll.name }} — réponses enregistrées"});
/* jshint +W100 */
}]);