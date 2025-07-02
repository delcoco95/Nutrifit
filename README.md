

# NutriFit - Assistant Nutritionnel pour Sportifs

## 📌 Présentation du projet

NutriFit est une application web locale, sans backend, conçue pour être utilisée sur une borne ou un poste fixe dans une salle de sport. Elle permet :

- De rechercher des produits alimentaires via l’API Open Food Facts.
- D’en afficher les valeurs nutritionnelles.
- De recevoir des recommandations personnalisées en fonction du profil sportif.
- De consulter un historique local de consultations.

Le projet est développé côté client (HTML/CSS/JS) et hébergé localement via un serveur Apache2 sur une VM Debian (VirtualBox).

---

## 🖥️ Environnement de développement

- **Code source** : HTML, CSS (Bootstrap), JS (localStorage, fetch API)
- **Éditeur** : Visual Studio Code
- **Transfert** : WinSCP
- **Serveur Web** : Apache2
- **OS** : Debian 11/12 en machine virtuelle
- **Virtualisation** : VirtualBox (mode bridge)
- **Navigateur conseillé** : Firefox ou Chromium en mode kiosque

---

## 🛠️ Installation Apache2 sur Debian (VM)

### 1. Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
````

### 2. Installation d’Apache2

```bash
sudo apt install apache2 -y
```

### 3. Vérification du service

```bash
sudo systemctl status apache2
# ou redémarrage manuel si nécessaire
sudo systemctl restart apache2
```

Le site est désormais accessible sur la machine via :
📍 `http://localhost` ou `http://<adresse_IP_VM>`

---

## 📂 Déploiement de l'application

### 1. Transfert des fichiers

Depuis Windows (où le code est développé avec VS Code), transférer les fichiers via **WinSCP** vers :

```
/var/www/html
```

⚠️ Remplacer les fichiers par défaut d’Apache (`index.html` etc.)

### 2. Vérification des droits

```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

---

## 🌐 Configuration réseau et accès

### Mode Bridge dans VirtualBox :

* Permet à la VM d’avoir une adresse IP sur le même réseau que la machine hôte.
* Vérifier l’adresse IP de la VM :

```bash
ip a
```

### Ajout de `nutrifit.local` dans le fichier `hosts` (sur le poste client) :

```plaintext
192.168.x.x    nutrifit.local
```

📌 Accès possible via :

* `http://nutrifit.local`
* `http://<adresse_IP_VM>`

---

## 🔒 Sécurisation & supervision

### 1. Lancement automatique en mode kiosque (navigateur)

Ajout dans `.bashrc` ou fichier de session :

```bash
chromium --kiosk http://localhost
```

### 2. Script de supervision simple

Script de contrôle (ex: `/usr/local/bin/check_nutrifit.sh`) :

```bash
#!/bin/bash
curl -s -o /dev/null -w "%{http_code}" http://localhost | grep 200 > /dev/null
if [ $? -ne 0 ]; then
    systemctl restart apache2
fi
```

Planification via cron :

```bash
*/10 * * * * root /usr/local/bin/check_nutrifit.sh
```

### 3. Sécurité

* Droits utilisateurs limités
* Pare-feu pour bloquer la navigation extérieure (ex: `ufw default deny outgoing`)
* Suppression ou désactivation des raccourcis système

---

## ✅ Fonctionnalités côté client

* Recherche de produit via API Open Food Facts
* Affichage dynamique des nutriments
* Personnalisation via `localStorage` :

  * Objectif sportif (masse, sèche, entretien)
  * Type d’activité (muscu, cardio, mixte)
* Recommandation automatique selon profil
* Historique local avec date et avis nutritionnel

---

## 📎 Annexes

* VM configurée en Debian + Apache
* Application testée sur Firefox/Chromium
* Code compatible avec tout poste HTML5
* Accès offline (sans backend distant requis, sauf l’API publique)


