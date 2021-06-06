# Progetto Reti di Calcolatori - Moodies

# Descrizione
Moodies è un'applicazione che suggerisce agli utenti film da vedere in base al loro stato d'animo o al genere del film desiderato.

# Tecnologie Utilizzate
* API: Trakt.tv
* API: Google Calendar
* AMQP: RabbitMQ
* Database: PostgreSQL
* Web Server: Nginx
* Container: Docker

# Schema
![schema](doc/schema.PNG)

# Indicazioni sul soddisfacimento dei requisiti
Moodies:
* offre delle [API documentate](doc/API_Documentation.md);
* si collega a due API REST esterne: Trakt.tv e Google Calendar; 
* usa OAuth per autenticarsi ad entrambe le API;
* utilizza AMQP per comunicare con un server che effettua logging.


# Istruzioni per l'istallazione
1) tramite git clonare il repository utilizzando il comando git clone http://github.com/GMN177/ProgettoReti.git;
2) installare docker;
3) esegiure il comando docker-compose up --build -d;  
4) accedere al container postgres, creare un db e chiamarlo "progetto_reti" e popolarlo con il contenuto del file moviesql.sql.


# Utilizzo
1) aprire il browser e andare su localhost.
aggiungi immagini sito...

Il risultato della ricerca mostrerà all'utente tutte le informazioni riguardanti il film quali trama durata e link youtube al trailer.
L'utente potrà avere un profilo con il quale loggare e salvare i film ottenuti. Inoltre sulla pagina del profilo, l'utente avrà a disposizione due tasti che gli permetteranno di:
* collegarsi col proprio account di TraktTV e aggiungere dei film alla propria watchlist.
* collegarsi al proprio account Google per programmare la visione di un film generando un evento sul proprio calendario.
