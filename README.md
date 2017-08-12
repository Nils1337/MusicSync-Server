####Server

Unter /music habe ich ein paar Songs zum testen committed. 
Theoretisch sollte man da auch einfach neue Songs in den Ordner packen können bevor man das Docker-Image baut
und dann sollte der Server die korrekt der App anzeigen, aber das habe ich noch nicht ausführlich getestet.

Der Server lässt sich mit Docker Compose ausführen
```
docker-compose build musicsync
docker-compose up
```

oder auch normal mit `docker build` und `docker run`. Es muss natürlich ein Port nach außen gemappt werden, 
intern ist dies Port 80. Bei dem Docker Compose Build wird standardmäßig auch auf Port 80 des Host gemappt.
