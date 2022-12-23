<?php
	session_start();
	if (isset($_POST['name'], $_POST['email'], $_POST['desc'])) { // Préparation du mail
		$message = 'Auteur: ' . $_POST['name'] . "\r\n"
		  . 'Adresse: ' . $_POST['email'] . "\r\n"
		  . 'Contenu: ' . $_POST['desc'];
		$to      = 'mlp.ne@outlook.fr';
		$subject = 'Message depuis le site';
		$message = wordwrap($message, 70, "\r\n"); // On saute une ligne (avec \r\n) tous les 70 mots pour correspondre au format de mail()
		$headers = array( // Contient des infos qui caractérisent le mail
		  'From' => 'melipone.site@melipone-tattoo.go.yj.fr',
		  'Reply-To' => 'mlp.ne@outlook.fr', 
		  'X-Mailer' => 'PHP/' . phpversion() // Précise la façon dont a été envoyé le mail
		);
		if(isset($_POST) && $_POST["token"]!="0"){
			if(isset($_POST["captcha"])&&$_POST["captcha"]!=""&&$_SESSION["code"]==$_POST["captcha"])
			{
				if (mail($to, $subject, $message, $headers)) { // Renvoie true si l'envoi est réussi
					?>
					<script>window.location.replace('/contact/#success');</script>
					<?php 
				  }
				  else { // si le mail n'a pas pu être envoyé
					?>
					<script>window.location.replace('/contact/#error');</script>
					<?php
				}
					
			}else{
				?>
				<script>window.location.replace('/contact/#error_captcha');</script>
				<?php 
			}
			
		}
	}
	else { // si les POST n'ont pas été correctement initialisés
		$status = "<p style='color:#FFFFFF; font-size:20px'>
		<span style='background-color:#FF0000;'>Un problème est survenu, veuillez directement contacter Mélipone Tattoo mar mail ou télephone.</span></p>";
		echo $status;
	}
	?>