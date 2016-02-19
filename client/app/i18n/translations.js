angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('fr', {"% remaining.":"% restant.","A name is required":"Le champ nom est obligatoire","Add answer":"Ajouter réponse","Add new answer here":"Écrire une réponse ici","Add new file":"Ajouter un nouveau fichier","Add question":"Ajouter question","Add user":"Ajouter un utilisateur","Add users":"Ajouter des utilisateurs","Admin":"Administration","An error occured":"Une erreur est survenue","Answer polls":"Répondre à un questionnaire","Answer the poll":"Répondre au questionnaire","As an admin, your answers aren't saved.":"Vos réponses ne sont pas sauvegardées car vous êtes administrateur.","Ask your question here":"Écrire votre question ici","Cancel!":"Annuler","Change Password":"Changer le mot de passe","Confirm":"Confirmer","Current Password":"Mot de passe actuel","Delete all answers":"Supprimer toutes les réponses","Delete answer":"Supprimer la réponse","Delete question":"Supprimer la question","Doesn't look like a valid email.":"Merci de vérifier l'adresse email.","Edit polls":"Éditer les questionnaires","Eduquizz":"Eduquizz","Email":"Email","Export":"Exporter","File uploaded!":"Fichier envoyé!","Hello {{ getCurrentUser().name }}":"Bonjour {{ getCurrentUser().name }}","Hide {{ poll.questions.length}} questions":"Cacher les {{ poll.questions.length }} questions","Home":"Accueil","Incorrect password":"Mot de passe incorrect","Login":"Connexion","Logout":"Déconnexion","Move answer down":"Descendre la réponse","Move answer up":"Monter la réponse","Move down":"Descendre","Move up":"Monter","Name":"Nom","New Password":"Nouveau mot de passe","Next question":"Question suivante","No answers yet.":"Aucune réponse enregistrée.","Password":"Mot de passe","Password must be at least 3 characters.":"Le mot de passe doit faire au moins 3 caractères.","Password successfully changed.":"Mot de passe changé avec succès.","Please enter your username and password.":"Entrer votre nom d'utilisateur et votre mot de passe.","Polls":"Questionnaires","Polls list":"Liste des questionnaires","Question n°{{$index+1}}":"Question n°{{$index+1}}","Question n°{{questionNumber+1}}":"Question n°{{questionNumber+1}}","Save":"Sauvegarder","Save changes":"Sauvegarder les modifications","Save users":"Sauvegarder les utilisateurs","Saving…":"Sauvegarde en cours…","Score":"Résultat","Show more…":"Montrer plus …","Sign up":"Inscription","Submit poll":"Sauvegarder le questionnaire","Submitting…":"Envoi en cours…","Surname Name":"Prénom Nom","Title of your poll":"Titre de votre questionnaire","To edit the poll, click on the field to edit and type your text. To format the text, select it and pick the desired format in the floating box.":"Pour éditer le questionnaire, cliquer sur le champ à modifier et taper votre texte ; sélectionner pour mettre en forme (gras, italique, …).","Toggle navigation":"Basculer la navigation","Upload file":"Télécharger un fichier","Upload new file":"Télécharger le fichier","User name":"Nom d'utilisateur","Users list":"Liste des utilisateurs","View {{ poll.questions.length }} questions":"Voir les {{ poll.questions.length }} questions","What's your email address?":"Quelle est votre adresse email ?","Would you like to delete all the answers?":"Voulez-vous supprimer toutes les réponses ?","Would you like to delete this answer?":"Voulez-vous supprimer cette réponse ?","Would you like to delete this poll?":"Voulez-vous supprimer le sondage ?","Would you like to delete this user?":"Voulez-vous supprimer cet utilisateur ?","You answered the poll.":"Vous avez répondu au questionnaire.","delete answer":"supprimer la réponse","delete answers":"supprimer les questions","delete poll":"supprimer le sondage","delete user":"supprimer l'utilisateur","eduquizz":"eduquizz","— given answers":"­— réponses enregistrées"});
/* jshint +W100 */
}]);